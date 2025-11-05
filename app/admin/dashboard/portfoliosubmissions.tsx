// app/admin/dashboard/portfoliosubmissions.tsx

"use client";

import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase/client";
import { Loader2, AlertCircle, ExternalLink, Camera } from "lucide-react";

// 1. Define the type based on your 'portfolio_submissions' table
interface PortfolioSubmission {
  id: number;
  created_at: string;
  user_id: string;
  full_name: string;
  degree_program: string;
  campus: string;
  portfolio_link: string;
  photo_url: string;
  signature: string;
  status: string;
}

// 2. Helper component for status badges
const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "bg-gray-100 text-gray-800";
  if (status === "Approved") {
    colorClasses = "bg-green-100 text-green-800";
  } else if (status === "Declined") {
    colorClasses = "bg-red-100 text-red-800";
  } else if (status === "Submitted") {
    colorClasses = "bg-blue-100 text-blue-800";
  } else if (status === "Pending") {
    colorClasses = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
};

// 3. Main component to fetch and display data
export default function PortfolioSubmissions() {
  const [submissions, setSubmissions] = useState<PortfolioSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      // Fetch from the 'portfolio_submissions' table
      const { data, error } = await supabase
        .from("portfolio_submissions")
        .select("*")
        .order("created_at", { ascending: false }); // Show newest first

      if (error) {
        console.error("Error fetching portfolio submissions:", error.message);
        setError(error.message);
      } else {
        setSubmissions(data || []);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin mr-3 h-6 w-6 text-yellow-500" />
        <span className="text-lg font-medium text-gray-600">
          Loading Portfolio Submissions...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 mr-3" />
          <div>
            <p className="font-bold">Error Loading Data</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No portfolio submissions found.
      </p>
    );
  }

  // 4. Render the table with the data
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Degree
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Campus
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Links
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {submission.photo_url ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={submission.photo_url}
                      alt="Photo"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {submission.user_id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {submission.degree_program}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {submission.campus}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={submission.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(submission.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href={submission.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                >
                  Portfolio <ExternalLink size={14} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}