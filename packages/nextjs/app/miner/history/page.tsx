"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Download, Filter, MoreHorizontal } from "lucide-react";

// Mock data for demonstration
const mockShipments = [
  {
    id: "1",
    mineralName: "Coltan",
    mineralImage: "/minerals/coltan.jpg",
    timeAgo: "2 hours ago",
    status: "completed",
    details: {
      quantity: "500 kg",
      destination: "Processing Plant A",
      trackingNumber: "TRK123456",
      date: "2024-03-15",
      notes: "Delivered on time and in good condition",
    },
  },
  {
    id: "2",
    mineralName: "Gold",
    mineralImage: "/minerals/gold.jpg",
    timeAgo: "5 hours ago",
    status: "in-transit",
    details: {
      quantity: "100 kg",
      destination: "Refinery B",
      trackingNumber: "TRK789012",
      date: "2024-03-15",
      notes: "Expected delivery in 2 days",
    },
  },
  // Add more mock shipments as needed
];

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("shipment");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectedShipment = mockShipments.find(s => s.id === shipmentId);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleActionClick = (action: string) => {
    console.log(`History action: ${action}`);
    setIsMenuOpen(false);
  };

  if (!selectedShipment) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Mining History</h1>
          <p className="text-xl text-gray-600">Select a shipment to view its details</p>
          <Link href="/miner/overview" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400">
            <ChevronLeft size={20} />
            Back to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/miner/overview" className="text-gray-400 hover:text-white">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Shipment Details</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white">
              <Download size={20} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Filter size={20} />
            </button>
            <div className="relative">
              <button onClick={handleMenuClick} className="text-gray-400 hover:text-white">
                <MoreHorizontal size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleActionClick("exportDetails")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                    >
                      Export Details
                    </button>
                    <button
                      onClick={() => handleActionClick("shareDetails")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                    >
                      Share Details
                    </button>
                    <button
                      onClick={() => handleActionClick("printDetails")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539]"
                    >
                      Print Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="bg-[#252525] border border-[#323539] rounded-2xl p-6">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800">
              <img
                src={selectedShipment.mineralImage}
                alt={selectedShipment.mineralName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedShipment.mineralName}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedShipment.status === "completed" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {selectedShipment.status === "completed" ? "Completed" : "In-transit"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Quantity</h3>
                <p className="text-white">{selectedShipment.details.quantity}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Destination</h3>
                <p className="text-white">{selectedShipment.details.destination}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Tracking Number</h3>
                <p className="text-white">{selectedShipment.details.trackingNumber}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Date</h3>
                <p className="text-white">{selectedShipment.details.date}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-gray-400 text-sm mb-1">Notes</h3>
            <p className="text-white">{selectedShipment.details.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
