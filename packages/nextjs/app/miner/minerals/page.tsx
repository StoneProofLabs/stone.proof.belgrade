"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "../../lib/toast";
import {
  ChevronRight,
  Copy,
  Download,
  Filter,
  Loader2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectWalletView } from "~~/components/ConnectWalletView";
import Icon from "~~/components/dashboard/Icon";
import MineralActivity from "~~/components/dashboard/minerals/mineralActivity";
import MineralListTable from "~~/components/dashboard/minerals/mineralListTable/mineralList";
import MineralReports from "~~/components/dashboard/overview/mineralReports";
import RecentShipments from "~~/components/dashboard/overview/recentShipments";
import TopDemands from "~~/components/dashboard/overview/topDemands";
import Search from "~~/components/dashboard/search";
import { demands, mineralsList, reports, shipments } from "~~/data/data";

export type Shipment = {
  id: string;
  mineralName: string;
  mineralImage: string;
  timeAgo: string;
  status: "in-transit" | "completed";
};

const LoadingSpinner = ({ size = 8, text = "Loading..." }: { size?: number; text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2">
    <Loader2 className={`w-${size} h-${size} animate-spin`} />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);

const FullPageLoader = ({ text = "Verifying access permissions..." }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size={12} text={text} />
  </div>
);

const AccessDeniedCard = ({
  address,
  isLoadingRefresh,
  onRefresh,
}: {
  address: string;
  isLoadingRefresh: boolean;
  onRefresh: () => void;
}) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-4 sm:p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center flex flex-col items-center gap-5">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-700 rounded-full mx-auto">
              <ShieldAlert className="w-8 h-8 text-red-300" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-red-400 mt-3">Miner Privileges Required</h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2">
              Your wallet doesn&apos;t have miner access permissions to view this dashboard.
            </p>
          </div>

          {/* Main content - switches from row to column on small screens */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-[100%] ">
            {/* Left section - miner privileges */}
            <div className="w-full lg:w-[50%] h-[100%] flex flex-col justify-between">
              <div className="bg-gray-700 p-3 sm:p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-400">Connected Wallet:</span>
                  <button onClick={copyAddress} className="text-blue-400 hover:text-blue-300" title="Copy address">
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="font-mono text-xs sm:text-sm break-all text-left text-gray-200">{address}</p>
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="font-medium text-white">How to get miner access:</h3>
                <ol className="space-y-2 text-xs sm:text-sm text-gray-300 text-left">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-200 text-xs font-medium">
                      1
                    </span>
                    Contact system administrator
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-200 text-xs font-medium">
                      2
                    </span>
                    Request miner role assignment
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-200 text-xs font-medium">
                      3
                    </span>
                    Refresh this page after approval
                  </li>
                </ol>
              </div>
            </div>

            {/* Right section - contact administrators */}
            <div className="w-full lg:w-[40%] mt-4 lg:mt-0 lg:pt-0">
              <h3 className="font-medium text-white mb-3 sm:mb-4">Contact Administrators</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    name: "Admin Email",
                    value: "admin@stone.proof",
                    icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
                    action: "mailto:admin@stone.proof?subject=Miner%20Access%20Request",
                  },
                  {
                    name: "Support Phone",
                    value: "+1 (555) 123-4567",
                    icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />,
                    action: "tel:+15551234567",
                  },
                  {
                    name: "Telegram Support",
                    value: "@StoneProofSupport",
                    icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
                    action: "https://t.me/StoneProofSupport",
                  },
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={contact.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-xs"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full text-blue-300">
                        {contact.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-white truncate leading-tight text-xs sm:text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-400 truncate leading-tight">{contact.value}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Refresh button */}
          <div className="w-full pt-2 sm:pt-4">
            <button
              onClick={onRefresh}
              disabled={isLoadingRefresh}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoadingRefresh ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Check Access Again
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MineralsPage() {
  const { address, isConnected, isConnecting } = useAccount();
  const [isRefreshingAccess, setIsRefreshingAccess] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredMinerals, setFilteredMinerals] = useState(mineralsList);

  // Commented out the original role check but kept for reference
  /* const {
    data: hasMinerRole,
    isLoading: isLoadingRoleCheck,
    refetch: refetchRoleCheck,
  } = useScaffoldReadContract({
    contractName: "RolesManager",
    functionName: "hasMinerRole",
    args: [address],
  }); */

  const hasMinerRole = true; // Bypassing role check
  const isLoadingRoleCheck = false; // No loading needed

  const handleRefreshAccess = async () => {
    setIsRefreshingAccess(true);
    try {
      // await refetchRoleCheck();
      toast.info("Access refreshed");
    } catch (e) {
      console.error("Error refreshing access:", e);
      toast.error("Error checking access");
    } finally {
      setIsRefreshingAccess(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
      toast.success("Minerals data loaded successfully");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    const filtered = mineralsList.filter(
      mineral =>
        mineral.name.toLowerCase().includes(query.toLowerCase()) ||
        mineral.code.toLowerCase().includes(query.toLowerCase()) ||
        mineral.origin.toLowerCase().includes(query.toLowerCase()) ||
        mineral.status.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredMinerals(filtered);
  };

  // Handle clear history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the minerals history? This action cannot be undone.")) {
      setFilteredMinerals([]);
      toast.success("Minerals history cleared successfully");
    }
  };

  // Handle menu actions
  const handleMenuAction = (action: string) => {
    switch (action) {
      case "export":
        toast.success("Exporting minerals data...");
        break;
      case "filter":
        toast.success("Filtering minerals...");
        break;
      case "sort":
        toast.success("Sorting minerals...");
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  // Loading state while checking roles
  if (isConnected && isLoadingRoleCheck) {
    return <FullPageLoader text="Checking access permissions..." />;
  }

  // Not connected state
  if (!isConnected) {
    return <ConnectWalletView isLoading={isConnecting} role="miner" />;
  }

  // Show warning but don't restrict access
  if (isConnected && !hasMinerRole) {
    return (
      <div className="px-4 md:px-10 flex flex-col gap-6 md:gap-10">
        <div className="mb-4 p-4 rounded-lg bg-red-900/20 border border-red-900/50">
          <div className="flex items-center gap-2 text-red-300">
            <ShieldAlert className="w-5 h-5" />
            <span>Your wallet doesn't have miner privileges</span>
          </div>
        </div>

        {isDataLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size={12} text="Loading minerals data..." />
          </div>
        ) : (
          <>
            {/* the welcome message */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
              <div className="flex flex-col">
                <p className="text-[24px] md:text-[28px] font-bold m-0 leading-tight">Minerals</p>
                <p className="text-[14px] md:text-[16px] text-[#979AA0] m-0 leading-tight">
                  Access detailed info about minerals
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-1">
                <button
                  onClick={() => handleMenuAction("export")}
                  className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px] hover:bg-[#323539] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <h1 className="text-sm translate-y-[7px]">Download Report</h1>
                    <Download size={16} className="text-gray-400" />
                  </span>
                </button>

                <Link
                  href={"/miner/minerals/registerMineral"}
                  className="flex-1 md:flex-none bg-accentBlue gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center md:justify-start hover:bg-blue-600 transition-colors"
                >
                  <h1 className="translate-y-[4px]">Register Mineral</h1>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px] hover:bg-[#323539] transition-colors"
                  >
                    <MoreHorizontal size={20} className="text-gray-400" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuAction("export")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <Download size={16} />
                          Export Data
                        </button>
                        <button
                          onClick={() => handleMenuAction("filter")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <Filter size={16} />
                          Filter Minerals
                        </button>
                        <button
                          onClick={() => handleMenuAction("sort")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <ChevronRight size={16} />
                          Sort Minerals
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* the mineral activity */}
            <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
              <div className="w-full lg:w-2/3">
                <div className="h-full">
                  <MineralActivity />
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="h-full">
                  <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />
                </div>
              </div>
            </div>

            {/* the history table */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
                <div>
                  <p className="text-[18px] md:text-[20px] font-bold m-0 leading-tight">Minerals History</p>
                </div>

                <div className="w-full md:w-auto md:scale-90">
                  <Search onSearch={handleSearch} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleMenuAction("export")}
                    className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-1 font-medium px-3 py-1 rounded-[6px] text-sm hover:bg-[#323539] transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <span>Download Report</span>
                      <Download size={14} className="text-gray-400" />
                    </span>
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="flex-1 md:flex-none bg-red-500 gap-1 font-medium px-3 py-1 rounded-[6px] flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                    Clear history
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="bg-[#252525] border border-[#323539] flex items-center justify-center px-2 py-1 rounded-[6px] hover:bg-[#323539] transition-colors"
                    >
                      <MoreHorizontal size={14} className="text-gray-400" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleMenuAction("export")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                          >
                            <Download size={16} />
                            Export Data
                          </button>
                          <button
                            onClick={() => handleMenuAction("filter")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                          >
                            <Filter size={16} />
                            Filter Minerals
                          </button>
                          <button
                            onClick={() => handleMenuAction("sort")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                          >
                            <ChevronRight size={16} />
                            Sort Minerals
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* the table */}
              <div className="overflow-x-auto">
                <MineralListTable minerals={filteredMinerals} />
              </div>
            </div>

            {/* the other metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />

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
          </>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 flex flex-col gap-6 md:gap-10">
      {isDataLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size={12} text="Loading minerals data..." />
        </div>
      ) : (
        <>
          {/* the welcome message */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col">
              <p className="text-[24px] md:text-[28px] font-bold m-0 leading-tight">Minerals</p>
              <p className="text-[14px] md:text-[16px] text-[#979AA0] m-0 leading-tight">
                Access detailed info about minerals
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-1">
              <button
                onClick={() => handleMenuAction("export")}
                className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px] hover:bg-[#323539] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <h1 className="text-sm translate-y-[7px]">Download Report</h1>
                  <Download size={16} className="text-gray-400" />
                </span>
              </button>

              <Link
                href={"/miner/minerals/registerMineral"}
                className="flex-1 md:flex-none bg-accentBlue gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center md:justify-start hover:bg-blue-600 transition-colors"
              >
                <h1 className="translate-y-[4px]">Register Mineral</h1>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px] hover:bg-[#323539] transition-colors"
                >
                  <MoreHorizontal size={20} className="text-gray-400" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleMenuAction("export")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                      >
                        <Download size={16} />
                        Export Data
                      </button>
                      <button
                        onClick={() => handleMenuAction("filter")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                      >
                        <Filter size={16} />
                        Filter Minerals
                      </button>
                      <button
                        onClick={() => handleMenuAction("sort")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                      >
                        <ChevronRight size={16} />
                        Sort Minerals
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* the mineral activity */}
          <div className="flex flex-col lg:flex-row gap-5 w-full items-stretch">
            <div className="w-full lg:w-2/3">
              <div className="h-full">
                <MineralActivity />
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="h-full">
                <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />
              </div>
            </div>
          </div>

          {/* the history table */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
              <div>
                <p className="text-[18px] md:text-[20px] font-bold m-0 leading-tight">Minerals History</p>
              </div>

              <div className="w-full md:w-auto md:scale-90">
                <Search onSearch={handleSearch} />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMenuAction("export")}
                  className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-1 font-medium px-3 py-1 rounded-[6px] text-sm hover:bg-[#323539] transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <span>Download Report</span>
                    <Download size={14} className="text-gray-400" />
                  </span>
                </button>

                <button
                  onClick={handleClearHistory}
                  className="flex-1 md:flex-none bg-red-500 gap-1 font-medium px-3 py-1 rounded-[6px] flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                  Clear history
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-[#252525] border border-[#323539] flex items-center justify-center px-2 py-1 rounded-[6px] hover:bg-[#323539] transition-colors"
                  >
                    <MoreHorizontal size={14} className="text-gray-400" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#323539] rounded-[8px] shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuAction("export")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <Download size={16} />
                          Export Data
                        </button>
                        <button
                          onClick={() => handleMenuAction("filter")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <Filter size={16} />
                          Filter Minerals
                        </button>
                        <button
                          onClick={() => handleMenuAction("sort")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#323539] flex items-center gap-2"
                        >
                          <ChevronRight size={16} />
                          Sort Minerals
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* the table */}
            <div className="overflow-x-auto">
              <MineralListTable minerals={filteredMinerals} />
            </div>
          </div>

          {/* the other metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecentShipments shipments={shipments} onViewAll={() => console.log("View all shipments")} />

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
        </>
      )}
    </div>
  );
}
