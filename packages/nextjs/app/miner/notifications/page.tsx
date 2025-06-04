"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "../../lib/toast";
import { ChevronRight, Copy, Loader2, Mail, MessageSquare, Phone, ShieldAlert } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectWalletView } from "~~/components/ConnectWalletView";
import Icon from "~~/components/dashboard/Icon";
import NotificationCard from "~~/components/dashboard/notifications/notificationCard";
import MineralReports from "~~/components/dashboard/overview/mineralReports";
import RecentShipments from "~~/components/dashboard/overview/recentShipments";
import StatsCard from "~~/components/dashboard/overview/statsCard";
import TopDemands from "~~/components/dashboard/overview/topDemands";
import Search from "~~/components/dashboard/search";
import { demands, mineralsData, notifications, reports, shipments, shipmentsData, transfersData } from "~~/data/data";

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
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto">
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-300" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Miner Privileges Required</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your wallet doesn&apos;t have miner access permissions to view notifications.
        </p>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected Wallet:</span>
            <button
              onClick={copyAddress}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              title="Copy address"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="font-mono text-sm break-all text-left">{address}</p>
        </div>

        <div className="pt-4 space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">How to get miner access:</h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300 text-left">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                1
              </span>
              Contact system administrator
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                2
              </span>
              Request miner role assignment
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                3
              </span>
              Refresh this page after approval
            </li>
          </ol>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Contact Administrators</h3>
          <div className="space-y-3">
            {[
              {
                name: "Admin Email",
                value: "admin@stone.proof",
                icon: <Mail className="w-5 h-5" />,
                action: "mailto:admin@stone.proof?subject=Miner%20Role%20Request",
              },
              {
                name: "Support Phone",
                value: "+1 (555) 123-4567",
                icon: <Phone className="w-5 h-5" />,
                action: "tel:+15551234567",
              },
              {
                name: "Telegram Support",
                value: "@StoneProofSupport",
                icon: <MessageSquare className="w-5 h-5" />,
                action: "https://t.me/StoneProofSupport",
              },
            ].map((contact, index) => (
              <a
                key={index}
                href={contact.action}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{contact.value}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onRefresh}
            disabled={isLoadingRefresh}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
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
  );
};

export default function NotificationsPage() {
  const { address, isConnected, isConnecting } = useAccount();
  const [isRefreshingAccess, setIsRefreshingAccess] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [notification, setNotifications] = useState(notifications);
  const [searchQuery, setSearchQuery] = useState("");

  // Commented out the original role check but kept for reference
  /* const {
    data: hasMinerRole,
    isLoading: isLoadingRoleCheck,
    error,
    refetch: refetchRoleCheck,
  } = useScaffoldReadContract({
    contractName: "RolesManager",
    functionName: "hasMinerRole",
    args: [address],
    enabled: isConnected
  }); */

  // Bypass the role check by setting these values directly
  const hasMinerRole = true; // Always grant access
  const isLoadingRoleCheck = false; // Skip loading state

  const handleRefreshAccess = async () => {
    setIsRefreshingAccess(true);
    try {
      // Original code - commented out
      /* const { data } = await refetchRoleCheck();
      if (!data) {
        toast.error("Still no miner access. Contact administrator.");
      } */

      // Always show success when bypassing
      toast.success("Access refreshed");
    } catch (e) {
      console.error("Error refreshing access:", e);
      toast.error("Error checking access");
    } finally {
      setIsRefreshingAccess(false);
    }
  };

  useEffect(() => {
    // Always show data since we're bypassing the role check
    const timer = setTimeout(() => {
      setIsDataLoading(false);
      toast.success("Notifications data loaded successfully");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (id: number) => {
    setNotifications(
      notification.map(
        (note: {
          id: number;
          type: "error" | "success" | "warning" | "info";
          title: string;
          message: string;
          visible: boolean;
        }) => (note.id === id ? { ...note, visible: false } : note),
      ),
    );
  };

  const loadPrevious = () => {
    console.log("Loading previous notifications");
    // fetch more notifications
  };

  // Loading state while checking roles - kept for reference but will be skipped
  if (isConnected && isLoadingRoleCheck) {
    return <FullPageLoader text="Checking access permissions..." />;
  }

  // Not connected state - still require wallet connection
  if (!isConnected) {
    return <ConnectWalletView isLoading={isConnecting} role="miner" />;
  }

  // No miner role state - this code block is kept but will never execute due to hasMinerRole = true
  if (isConnected && !hasMinerRole) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <AccessDeniedCard
          address={address || ""}
          isLoadingRefresh={isRefreshingAccess}
          onRefresh={handleRefreshAccess}
        />
      </div>
    );
  }

  // Add a warning banner to indicate bypass is active
  const BypassWarningBanner = () => (
    <div className="mb-4 p-4 rounded-lg bg-yellow-900/20 border border-yellow-900/50">
      <div className="flex items-center gap-2 text-yellow-300">
        <ShieldAlert className="w-5 h-5" />
        <span>Role check temporarily bypassed - access restrictions removed</span>
      </div>
    </div>
  );

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter notifications based on search query
  const filteredNotifications = notification.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="px-4 md:px-10 flex flex-col gap-6 md:gap-10">
      {/* Warning banner to indicate bypass is active */}
      <BypassWarningBanner />

      {isDataLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size={12} text="Loading notifications..." />
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col">
              <p className="text-[24px] md:text-[28px] font-bold m-0 leading-tight">Notifications</p>
              <p className="text-[14px] md:text-[16px] text-[#979AA0] m-0 leading-tight">Realtime blockchain updates</p>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-1">
              <button className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px]">
                <span className="flex items-center gap-2">
                  <h1 className="text-sm translate-y-[7px]">Download Report</h1>
                  <Icon path="/dashboard/icon_set/download.svg" alt="Download icon" />
                </span>
              </button>

              <Link
                href={"/miner/minerals/registerMineral"}
                className="flex-1 md:flex-none bg-accentBlue gap-2 font-semibold px-4 py-1.5 rounded-[8px] flex items-center justify-center md:justify-start"
              >
                <h1 className="translate-y-[4px]">Register Mineral</h1>
              </Link>

              <button className="bg-[#252525] border border-[#323539] flex items-center justify-center gap-2 font-semibold px-4 py-1.5 pb-2.5 rounded-[8px]">
                <Icon path="/dashboard/icon_set/menu.svg" alt="menu icon" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Actions today"
                value="3405"
                tagName="Shipments"
                chartData={mineralsData}
                color="blue"
                tagLabel="Top actions"
              />

              <StatsCard
                title="Succeeded contracts"
                value="27"
                tagName="Refining"
                chartData={transfersData}
                color="green"
                tagLabel="Top contracts"
              />

              <StatsCard
                title="Total issues"
                value="27"
                tagName="Impurities"
                chartData={shipmentsData}
                color="red"
                tagLabel="Top issues"
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
              <div>
                <p className="text-[18px] md:text-[20px] font-bold m-0 leading-tight">Minerals History</p>
              </div>

              <div className="w-full md:w-auto md:scale-90">
                <Search onSearch={handleSearch} placeholder="Search notifications..." />
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="flex-1 md:flex-none bg-[#252525] border border-[#323539] flex items-center justify-center gap-1 font-medium px-3 py-1 rounded-[6px] text-sm">
                  <span className="flex items-center gap-1">
                    <span>Download Report</span>
                    <Icon path="/dashboard/icon_set/download.svg" alt="Download icon" width={14} height={14} />
                  </span>
                </button>

                <Link
                  href={"#"}
                  className="flex-1 md:flex-none bg-red-500 gap-1 font-medium px-3 py-1 rounded-[6px] flex items-center justify-center text-sm"
                >
                  Clear history
                </Link>

                <button className="bg-[#252525] border border-[#323539] flex items-center justify-center px-2 py-1 rounded-[6px]">
                  <Icon path="/dashboard/icon_set/menu.svg" alt="menu icon" width={14} height={14} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-4 min-h-screen">
              {filteredNotifications
                .filter(note => note.visible)
                .map(note => (
                  <NotificationCard
                    key={note.id}
                    type={note.type}
                    title={note.title}
                    message={note.message}
                    onClose={() => handleClose(note.id)}
                    onShowMore={() => console.log(`Showing more details for notification ${note.id}`)}
                  />
                ))}

              <div className="flex justify-center mt-4">
                <button
                  onClick={loadPrevious}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded flex items-center gap-2"
                >
                  Load Previous
                  <Icon path="/dashboard/icon_set/menu.svg" alt="Load previous icon" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
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
