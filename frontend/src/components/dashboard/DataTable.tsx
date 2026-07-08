"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "./SkeletonLoader";
import EmptyState from "./EmptyState";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  filterKey?: keyof T;
  filterOptions?: { label: string; value: string }[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: (item: T) => React.ReactNode;
  itemsPerPage?: number;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  filterKey,
  filterOptions,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters or query.",
  actions,
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterValue]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filterKey && filterValue !== "all") {
        const val = item[filterKey];
        if (String(val).toLowerCase() !== filterValue.toLowerCase()) {
          return false;
        }
      }

      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();

      if (searchKey) {
        return String(item[searchKey]).toLowerCase().includes(searchLower);
      }

      return Object.values(item).some((v) =>
        String(v).toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm, filterValue, filterKey, searchKey]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const rangeStart = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, filteredData.length);

  if (loading) {
    return <SkeletonLoader type="table" rows={itemsPerPage} />;
  }

  return (
    <div className="bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800/40">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-450 border border-slate-200/80 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/15 focus:border-[#1E2B7A] dark:focus:border-accent text-xs font-bold transition-all"
          />
        </div>

        {/* Filter Option */}
        {filterKey && filterOptions && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Filter:
            </span>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-xl focus:outline-none text-xs font-bold transition-all cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              <option value="all">All Records</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/20 dark:bg-slate-900/5 border-b border-slate-150/50 dark:border-slate-800/40">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
            <AnimatePresence mode="wait">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIdx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: rowIdx * 0.03 }}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors duration-150 tr-hover"
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={`px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-200 ${col.className || ""}`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-5 py-4 text-xs text-right whitespace-nowrap">
                        {actions(item)}
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredData.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/10 dark:bg-slate-900/5">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-700 dark:text-slate-300">{rangeStart}</span> -{" "}
            <span className="text-slate-700 dark:text-slate-300">{rangeEnd}</span> of{" "}
            <span className="text-slate-700 dark:text-slate-300">{filteredData.length}</span> entries
          </span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <FiChevronLeft size={13} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7.5 h-7.5 rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-[#1E2B7A] text-white dark:bg-accent/15 dark:text-accent border border-transparent dark:border-accent/20 shadow-sm shadow-[#1E2B7A]/10"
                    : "border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <FiChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
