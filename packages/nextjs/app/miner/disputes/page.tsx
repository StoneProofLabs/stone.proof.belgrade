"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectWalletView } from "~~/components/ConnectWalletView";
import Icon from "~~/components/dashboard/Icon";
import MineralDisputesGraph from "~~/components/dashboard/disputes/mineralDisputesVariationGraph";
import { NotificationList } from "~~/components/dashboard/disputes/recentActivities";
import MineralReports from "~~/components/dashboard/overview/mineralReports";
import RecentShipments from "~~/components/dashboard/overview/recentShipments";
import TopDemands from "~~/components/dashboard/overview/topDemands";
import Search from "~~/components/dashboard/search";
import { demands, mineralDisputesData, mockDisputes, reports, shipments } from "~~/data/data";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const LoadingSpinner = ({ size = 8, text = "Loading..." }: { size?: number; text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2">
    <Loader2 className={`w-${size} h-${size} animate-spin`} />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);

// const AccessDeniedView = ({
//   isLoadingRefresh,
//   onRefresh,
// }: {
//   address: string;
//   isLoadingRefresh: boolean;
//   onRefresh: () => void;
// }) => {
//   return (
//     <div className="px-4 sm:px-10 flex flex-col gap-10">
//       {/* the welcome message */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
//         <div className="flex flex-col">
//           <p className="text-[24px] sm:text-[28px] font-bold m-0 leading-tight">Disputes resolutions</p>
//           <p className="text-[14px] sm:text-[16px] text-[#979AA0] m-0 leading-tight">
//             View all On-going disputes in the network
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 sm:gap-1">
//           <Link
//             href={"/miner/disputes/raiseDispute"}
//             className="w-full sm:w-auto bg-red-600 gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center sm:justify-start"
//           >
//             <h1 className="translate-y-[4px]">Raise Dispute</h1>
//           </Link>

//           <button className="w-full sm:w-auto bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px]">
//             <Icon path="/dashboard/icon_set/menu.svg" alt="menu icon" />
//           </button>
//         </div>
//       </div>

//       {/* the mineral activity */}
//       <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
//         <div className="w-full lg:w-2/3">
//           <div className="h-full">
//             <MineralDisputesGraph data={mineralDisputesData} />
//           </div>
//         </div>
//         <div className="w-full lg:w-1/3">
//           <div className="h-full">
//             <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />
//           </div>
//         </div>
//       </div>

//       {/* the notifications */}
//       <div className="flex flex-col gap-5">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
//           <div>
//             <p className="text-[18px] sm:text-[20px] font-bold m-0 leading-tight">Recent Disputes in your network</p>
//           </div>

//           <div className="flex flex-wrap gap-2 sm:gap-1">
//             <Link
//               href={"/miner/disputes/raiseDispute"}
//               className="w-full sm:w-auto bg-red-600 gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center sm:justify-start"
//             >
//               <h1 className="translate-y-[4px]">Raise Dispute</h1>
//             </Link>

//             <button className="w-full sm:w-auto bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px]">
//               <Icon path="/dashboard/icon_set/menu.svg" alt="menu icon" />
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
//           <div>
//             <p className="text-[18px] sm:text-[20px] font-bold m-0 leading-tight">Recent Disputes in your network</p>
//           </div>

//           <div className="w-full sm:w-auto scale-90 origin-left sm:origin-center">
//             <Search />
//           </div>

//           {/* Refresh Button */}
//           <div className="pt-4">
//             <button
//               onClick={onRefresh}
//               disabled={isLoadingRefresh}
//               className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
//             >
//               {isLoadingRefresh ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <>
//                   Check Access Again
//                   <ChevronRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* the table */}
//         <NotificationList baseUrl="miner" notifications={mockDisputes} />
//       </div>

//       {/* the other metric cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />

//         <TopDemands
//           demands={demands}
//           onRefresh={() => console.log("Refresh demands")}
//           onAddDemand={id => console.log("Add demand", id)}
//         />

//         <MineralReports
//           reports={reports}
//           onRefresh={() => console.log("Refresh reports")}
//           onViewDetails={id => console.log("View report details", id)}
//         />
//       </div>
//     </div>
//   );
// };

export default function Page() {
  const { address, isConnected, isConnecting } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter disputes based on search query
  const filteredDisputes = mockDisputes.filter(
    dispute =>
      dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Check if user has miner role
  const { isLoading: isRoleLoading } = useScaffoldReadContract({
    contractName: "RolesManager",
    functionName: "hasMinerRole",
    args: [address],
    /*enabled: isConnected*/
  });

  // Loading state while checking roles
  if (isConnected && isRoleLoading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <LoadingSpinner size={12} text="Checking access permissions..." />
      </div>
    );
  }

  if (!isConnected) {
    return <ConnectWalletView isLoading={isConnecting} role="miner" />;
  }

  // if (!hasMinerRole) {
  //   return <AccessDeniedView address={address || ""} isLoadingRefresh={isLoadingRefresh} onRefresh={onRefresh} />;
  // }

  return (
    <div className="px-4 sm:px-10 flex flex-col gap-10">
      {/* the welcome message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col">
          <p className="text-[24px] sm:text-[28px] font-bold m-0 leading-tight">Disputes resolutions</p>
          <p className="text-[14px] sm:text-[16px] text-[#979AA0] m-0 leading-tight">
            View all On-going disputes in the network
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-1">
          <Link
            href={"/miner/disputes/raiseDispute"}
            className="w-full sm:w-auto bg-red-600 gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center sm:justify-start"
          >
            <h1 className="translate-y-[4px]">Raise Disputes</h1>
          </Link>

          <button className="w-full sm:w-auto bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px]">
            <Icon path="/dashboard/icon_set/menu.svg" alt="menu icon" />
          </button>
        </div>
      </div>

      {/* the mineral activity */}
      <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
        <div className="w-full lg:w-2/3">
          <div className="h-full">
            <MineralDisputesGraph data={mineralDisputesData} />
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="h-full">
            <RecentShipments
              baseUrl="miner"
              shipments={shipments}
              onViewAll={() => console.log("View all shipments")}
            />
          </div>
        </div>
      </div>

      {/* the notifications */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div>
            <p className="text-[18px] sm:text-[20px] font-bold m-0 leading-tight">Recent Disputes in your network</p>
          </div>

          <div className="w-full sm:w-auto scale-90 origin-left sm:origin-center">
            <Search onSearch={handleSearch} placeholder="Search disputes..." />
          </div>
        </div>

        {/* the table */}
        <NotificationList baseUrl="miner" notifications={filteredDisputes} />
      </div>

      {/* the other metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentShipments baseUrl="miner" shipments={shipments} onViewAll={() => console.log("View all shipments")} />

        <TopDemands
          demands={demands}
          onRefresh={() => console.log("Refresh demands")}
          onAddDemand={id => console.log("Add demand", id)}
        />

        <MineralReports
          baseUrl="miner"
          reports={reports}
          onRefresh={() => console.log("Refresh reports")}
          onViewDetails={id => console.log("View report details", id)}
        />
      </div>
    </div>
  );
}
