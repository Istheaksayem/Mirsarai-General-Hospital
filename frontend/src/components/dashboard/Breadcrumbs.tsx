"use client";

import React from "react";
import { FiChevronRight, FiHome } from "react-icons/fi";
import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
  homeHref?: string;
}

export default function Breadcrumbs({ items, homeHref = "/dashboard" }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-slate-450 dark:text-slate-500 whitespace-nowrap overflow-x-auto py-1">
      <Link
        href={homeHref}
        className="hidden sm:flex items-center gap-1.5 hover:text-[#1E2B7A] dark:hover:text-accent transition-colors hover:scale-102"
      >
        <FiHome size={13} />
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div
            key={idx}
            className={`flex items-center gap-2 ${isLast ? '' : 'hidden sm:flex'}`}
          >
            <FiChevronRight size={11} className="flex-shrink-0 text-slate-300 dark:text-slate-700 hidden sm:block" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-[#1E2B7A] dark:hover:text-accent transition-colors font-bold"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-700 dark:text-slate-300 font-extrabold max-w-[120px] truncate">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
