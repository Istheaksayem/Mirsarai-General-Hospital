"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ── Delete Confirm (still modal — just a confirm dialog) ──────────────────────
function DeleteConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mx-auto">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Delete Record</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ActionButtons ────────────────────────────────────────────────────────
interface ActionButtonsProps {
  row: Record<string, unknown>;
  // Route-based navigation (preferred)
  viewHref?: string;
  editHref?: string;
  // Fallback callbacks
  onView?: (row: Record<string, unknown>) => void;
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
  hideEdit?: boolean;
}

export function ActionButtons({
  row,
  viewHref,
  editHref,
  onView,
  onEdit,
  onDelete,
  hideEdit,
}: ActionButtonsProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  const handleView = () => {
    if (viewHref) router.push(viewHref);
    else onView?.(row);
  };

  const handleEdit = () => {
    if (editHref) router.push(editHref);
    else onEdit?.(row);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* View */}
        <button
          onClick={handleView}
          title="View"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>

        {/* Edit */}
        {!hideEdit && (
          <button
            onClick={handleEdit}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => setShowDelete(true)}
          title="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {showDelete && (
        <DeleteConfirm
          onClose={() => setShowDelete(false)}
          onConfirm={() => onDelete?.(row)}
        />
      )}
    </>
  );
}

// ── createActionColumn with route support ─────────────────────────────────────
interface ActionColumnConfig {
  basePath: string; // e.g. "/super-admin/patients"
  idKey?: string;   // default "id"
}

export function createActionColumn(
  config?: ActionColumnConfig
): import("@/components/ui/DataTable").Column<Record<string, unknown>> {
  return {
    key: "__actions__",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => {
      if (config) {
        const id = row[config.idKey ?? "id"] as string;
        return (
          <ActionButtons
            row={row}
            viewHref={`${config.basePath}/${id}`}
            editHref={`${config.basePath}/${id}/edit`}
          />
        );
      }
      return <ActionButtons row={row} />;
    },
  };
}
