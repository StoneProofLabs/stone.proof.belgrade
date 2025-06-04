"use client";

import { useMemo, useState } from "react";
import MineralRow from "./MineralRow";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import { Mineral, MineralKey, SortConfig } from "./types";

type MineralListTableProps = {
  path?: string;
  minerals: Mineral[];
};

const PAGE_SIZE = 6;

export default function MineralListTable({ path, minerals }: MineralListTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "time", direction: "descending" });
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedMinerals = useMemo(() => {
    const sorted = [...minerals].sort((a, b) => {
      const key = sortConfig.key || "time";
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB);
      } else if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      }

      return 0;
    });

    return sortConfig.direction === "ascending" ? sorted : sorted.reverse();
  }, [minerals, sortConfig]);

  const paginatedMinerals = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedMinerals.slice(start, start + PAGE_SIZE);
  }, [sortedMinerals, currentPage]);

  const handleSort = (key: MineralKey) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "ascending" ? "descending" : "ascending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const handleSelect = (id: number) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedMinerals.map(mineral => mineral.id);
      setSelected(prev => Array.from(new Set([...prev, ...allIds])));
    } else {
      const currentPageIds = paginatedMinerals.map(m => m.id);
      setSelected(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const totalPages = Math.ceil(minerals.length / PAGE_SIZE);

  return (
    <div className="rounded-xl bg-[#252525] border border-[#323539] text-white shadow-md overflow-hidden">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[800px] lg:min-w-full">
          <table className="w-full text-sm text-left">
            <TableHeader
              sortConfig={sortConfig}
              onSort={handleSort}
              allSelected={paginatedMinerals.every(m => selected.includes(m.id))}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {paginatedMinerals.map(mineral => (
                <MineralRow
                  key={mineral.id}
                  mineral={mineral}
                  isSelected={selected.includes(mineral.id)}
                  onSelect={handleSelect}
                  path={path}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-4 py-3">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
