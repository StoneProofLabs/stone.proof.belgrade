"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "~~/utils/dashboard/cn";

interface Shipment {
  id: string;
  mineralName: string;
  mineralImage: string;
  timeAgo: string;
  status: "completed" | "in-transit";
}

interface RecentShipmentsProps {
  baseUrl: string;
  shipments: Shipment[];
  title?: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
  bgColor?: string;
}

export default function RecentShipments({
  baseUrl,
  shipments,
  title = "Recent Shipments",
  viewAllLabel = "View full history",
  onViewAll,
  bgColor = "bg-[#252525]",
}: RecentShipmentsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (action: string) => {
    console.log(`Shipment action: ${action}`);
    setIsMenuOpen(false);
  };

  const handleShipmentClick = (shipmentId: string) => {
    router.push(`/${baseUrl}/history?shipment=${shipmentId}`);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push(`/${baseUrl}/history`);
    }
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
                  onClick={() => handleActionClick("filterCompleted")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Show Completed
                </button>
                <button
                  onClick={() => handleActionClick("filterInTransit")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Show In-transit
                </button>
                <button
                  onClick={() => handleActionClick("exportData")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                >
                  Export Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {shipments.map(shipment => (
          <div
            key={shipment.id}
            className="flex items-center justify-between cursor-pointer hover:bg-[#323539] p-2 rounded-lg transition-colors"
            onClick={() => handleShipmentClick(shipment.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                <img src={shipment.mineralImage} alt={shipment.mineralName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-medium">{shipment.mineralName}</p>
                <p className="text-gray-400 text-sm">{shipment.timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  shipment.status === "completed" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {shipment.status === "completed" ? "Completed" : "In-transit"}
              </span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleViewAll}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        {viewAllLabel}
      </button>
    </div>
  );
}
