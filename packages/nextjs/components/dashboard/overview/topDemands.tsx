"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, RefreshCw } from "lucide-react";
import { cn } from "~~/utils/dashboard/cn";

interface Demand {
  id: string;
  mineralName: string;
  date: string;
  icon: string;
  status?: "pending" | "in-progress" | "completed";
  quantity?: string;
  priority?: "high" | "medium" | "low";
}

interface TopDemandsProps {
  demands: Demand[];
  title?: string;
  refreshLabel?: string;
  onRefresh?: () => void;
  onAddDemand?: (demandId: string) => void;
  bgColor?: string;
}

export default function TopDemands({
  demands,
  title = "Top Demands",
  refreshLabel = "Refresh List",
  onRefresh = () => {},
  onAddDemand = () => {},
  bgColor = "bg-[#252525]",
}: TopDemandsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localDemands, setLocalDemands] = useState(demands);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (action: string) => {
    console.log(`Demand action: ${action}`);
    setIsMenuOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update local demands with new data
      setLocalDemands(prev =>
        prev.map(demand => ({
          ...demand,
          date: new Date().toLocaleDateString(),
        })),
      );
      onRefresh();
    } catch (error) {
      console.error("Error refreshing demands:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddDemand = (demandId: string) => {
    // Simulate adding demand
    setLocalDemands(prev =>
      prev.map(demand => (demand.id === demandId ? { ...demand, status: "in-progress" } : demand)),
    );
    onAddDemand(demandId);
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
                  onClick={() => handleActionClick("filterHighPriority")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Show High Priority
                </button>
                <button
                  onClick={() => handleActionClick("exportDemands")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Export Demands
                </button>
                <button
                  onClick={() => handleActionClick("viewAllDemands")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  View All Demands
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {localDemands.map(demand => (
          <div
            key={demand.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#323539] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
                <img src={demand.icon} alt={demand.mineralName} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">{demand.mineralName}</p>
                <p className="text-gray-400 text-sm">{demand.date}</p>
              </div>
            </div>
            <button
              onClick={() => handleAddDemand(demand.id)}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded transition-colors"
            >
              <Plus size={20} className="text-white" />
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
