// /app/api/email-history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to map Resend's status to your component's status
function mapResendStatus(status: string): 'Sent' | 'Failed' | string {
  if (!status) return 'Unknown'; // <-- Added safety check
  const lowerStatus = status.toLowerCase();

  if (lowerStatus === 'sent' || lowerStatus === 'delivered') {
    return 'Sent';
  }
  if (lowerStatus === 'bounced' || lowerStatus === 'complained') {
    return 'Failed';
  }
  
  // For 'delivery_delayed', 'pending', etc.
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch the logs from Resend's API
    const { data, error } = await resend.emails.list();

    if (error) {
      console.error('Error fetching email history:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // 2. Map the logs to the format your component expects
    const logs = data.data || [];

    const formattedLogs = logs.map(log => ({
      id: log.id,
      // 'log.to' is an array (e.g., ['person@example.com']). Handle it safely.
recipient: Array.isArray(log.to) ? log.to.join(', ') : log.to || '',subject: log.subject || 'No Subject',
      status: mapResendStatus(log.last_event),
      created_at: log.created_at || 'Unknown Date',
    }));    
    // 3. Return the formatted logs
    return NextResponse.json(formattedLogs);

  } catch (error) {
    console.error('Error in email-history route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}