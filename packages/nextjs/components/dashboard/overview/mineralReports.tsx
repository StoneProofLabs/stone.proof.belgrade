"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { cn } from "~~/utils/dashboard/cn";

interface Report {
  id: string;
  title: string;
  mineral: string;
  date: string;
  status?: "pending" | "resolved" | "under-review";
  severity?: "high" | "medium" | "low";
  description?: string;
}

interface MineralReportsProps {
  baseUrl: string;
  reports: Report[];
  title?: string;
  refreshLabel?: string;
  onRefresh?: () => void;
  onViewDetails?: (reportId: string) => void;
  bgColor?: string;
}

export default function MineralReports({
  baseUrl,
  reports,
  title = "Mineral Reports",
  refreshLabel = "Refresh List",
  onRefresh = () => {},
  onViewDetails = () => {},
  bgColor = "bg-[#252525]",
}: MineralReportsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localReports, setLocalReports] = useState(reports);
  const router = useRouter();

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (action: string) => {
    console.log(`Report action: ${action}`);
    setIsMenuOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update local reports with new data
      setLocalReports(prev =>
        prev.map(report => ({
          ...report,
          date: new Date().toLocaleDateString(),
        })),
      );
      onRefresh();
    } catch (error) {
      console.error("Error refreshing reports:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = (reportId: string) => {
    router.push(`/${baseUrl}/disputes/disputeDetails/${reportId}`);
    onViewDetails(reportId);
  };

  return (
    <div className={cn(bgColor, "border border-[#323539] rounded-2xl p-4 w-full")}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        <div className="relative">
          <button onClick={handleMenuClick} className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => handleActionClick("filterHighSeverity")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Show High Severity
                </button>
                <button
                  onClick={() => handleActionClick("exportReports")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Export Reports
                </button>
                <button
                  onClick={() => handleActionClick("viewAllReports")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  View All Reports
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {localReports.map(report => (
          <div
            key={report.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#323539] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
                <AlertCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{report.title}</p>
                <p className="text-gray-400 text-sm">
                  {report.mineral} - {report.date}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleViewDetails(report.id)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mt-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
        {refreshLabel}
      </button>
    </div>
  );
}
