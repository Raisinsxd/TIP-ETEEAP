"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

// Define the shape of the ref handle so the parent component can call these methods
export interface SignaturePadHandles {
  getSignature: () => string | null;
  clearSignature: () => void;
}

const SignaturePad = forwardRef<SignaturePadHandles>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas and context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // Adjust for device pixel ratio for sharper lines on high-res displays
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = '#374151'; // gray-700
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);
      }
    }
  }, []);

  // Get coordinates for both mouse and touch events
  const getCoords = (event: MouseEvent | Touch): { offsetX: number, offsetY: number } => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      return { 
        offsetX: event.clientX - rect.left, 
        offsetY: event.clientY - rect.top 
      };
    }
    return { offsetX: 0, offsetY: 0 };
  }

  // Event handler to start drawing
  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (context) {
      const nativeEvent = "touches" in event.nativeEvent ? event.nativeEvent.touches[0] : event.nativeEvent;
      const { offsetX, offsetY } = getCoords(nativeEvent);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  // Event handler to draw
  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing || !context) return;
    const nativeEvent = "touches" in event.nativeEvent ? event.nativeEvent.touches[0] : event.nativeEvent;
    const { offsetX, offsetY } = getCoords(nativeEvent);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  // Event handler to stop drawing
  const stopDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  // Clears the canvas
  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  
  // Expose methods to the parent component via the ref
  useImperativeHandle(ref, () => ({
    getSignature: () => {
      if (canvasRef.current) {
        // Check if canvas is empty before returning data URL
        const blank = document.createElement('canvas');
        blank.width = canvasRef.current.width;
        blank.height = canvasRef.current.height;
        return canvasRef.current.toDataURL('image/png') === blank.toDataURL('image/png')
          ? null
          : canvasRef.current.toDataURL('image/png');
      }
      return null;
    },
    clearSignature: clearCanvas,
  }));

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none"
      />
      <button
        type="button"
        onClick={clearCanvas}
        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        Clear Signature
      </button>
    </div>
  );
});

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;