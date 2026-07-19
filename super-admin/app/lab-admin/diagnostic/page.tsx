"use client";
import { useState, useMemo, useCallback } from "react";
import { FlaskConical, CheckCircle2, Clock, AlertCircle, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocuments, deleteDocument, updateDocument } from "@/lib/services/api";

interface DocRow {
  _id: string;
  title: string;
  patientId: { patientId: string; fullName: string } | string;
  documentType: string;
  department?: string;
  date: string;
  createdAt: string;
  fileUrl?: string;
  notes?: string;
  status?: string;
  testName?: string;
  reportType?: string;
}

const typeDisplay: Record<string, string> = {
  diagnostic_report: "Diagnostic",
  prescription: "Prescription",
  admission_form: "Admission",
  discharge_summary: "Discharge",
  certificate: "Certificate",
  bill_receipt: "Bill",
  other: "Other",
};

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

const typeVariant: Record<string, "default" | "info" | "success" | "warning"> = {
  diagnostic_report: "info",
  prescription: "warning",
  admission_form: "default",
  discharge_summary: "success",
};

export default function DiagnosticRecordsPage() {
  const queryClient = useQueryClient();

  const { data: fetched = [], isLoading } = useQuery({
    queryKey: ["lab-documents"],
    queryFn: async () => {
      const res = await getDocuments({ limit: "100" });
      return (res.data as DocRow[]) ?? [];
    },
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewDoc, setViewDoc] = useState<DocRow | null>(null);
  const [editDoc, setEditDoc] = useState<DocRow | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-documents"] });
      showNotification("success", "Document deleted successfully");
    },
    onError: (err) => {
      showNotification("error", "Failed to delete document");
      console.error(err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-documents"] });
      setEditDoc(null);
      showNotification("success", "Document updated successfully");
    },
    onError: (err) => {
      showNotification("error", "Failed to update document");
      console.error(err);
    },
  });

  const types = [...new Set(fetched.map((r) => r.documentType))];

  const filtered = fetched.filter((r) => {
    const pid = r.patientId as Record<string, unknown> | string;
    const name = typeof pid === 'object' ? (pid as Record<string, unknown>).fullName as string : "";
    const idStr = typeof pid === 'object' ? (pid as Record<string, unknown>).patientId as string : "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()) || idStr.includes(search);
    const matchType = !typeFilter || r.documentType === typeFilter;
    return matchSearch && matchType;
  }) as unknown as Record<string, unknown>[];

  const handleDelete = useCallback(async (row: Record<string, unknown>) => {
    await deleteMutation.mutateAsync(row._id as string);
  }, [deleteMutation]);

  const columns: Column<Record<string, unknown>>[] = useMemo(() => [
    {
      key: "_id", header: "Record ID",
      cell: (r) => <span className="font-mono text-xs text-gray-400">{String(r._id).slice(-6)}</span>,
    },
    {
      key: "patientId", header: "Patient",
      cell: (r) => {
        const pid = r.patientId as Record<string, unknown> | string;
        const name = typeof pid === 'object' ? (pid as Record<string, unknown>).fullName as string : "";
        const idStr = typeof pid === 'object' ? (pid as Record<string, unknown>).patientId as string : String(pid);
        return <div><p className="font-medium text-gray-900 dark:text-gray-100">{name || "N/A"}</p><p className="text-xs text-gray-400">{idStr}</p></div>;
      },
    },
    {
      key: "title", header: "Document",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.title as string}</p>
          <p className="text-xs text-gray-400">{typeDisplay[r.documentType as string] || r.documentType as string}</p>
        </div>
      ),
    },
    {
      key: "department", header: "Department",
      cell: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{(r.department as string) || "—"}</span>,
    },
    {
      key: "createdAt", header: "Date",
      cell: (r) => <span className="text-sm text-gray-500">{new Date(r.createdAt as string).toLocaleDateString()}</span>,
    },
    {
      key: "documentType", header: "Type",
      cell: (r) => <Badge variant={typeVariant[r.documentType as string] ?? "default"}>{typeDisplay[r.documentType as string] || r.documentType as string}</Badge>,
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <ActionButtons
          row={row}
          onView={() => setViewDoc(row as unknown as DocRow)}
          onEdit={() => setEditDoc(row as unknown as DocRow)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ], [handleDelete]);

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`rounded-lg px-4 py-3 shadow-lg ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <PageHeader title="Diagnostic Records" description={`${fetched.length} total documents`} icon={FlaskConical} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Documents" value={fetched.length} icon={Clock} color="amber" index={0} />
            <StatsCard title="Diagnostic Reports" value={fetched.filter(r => r.documentType === 'diagnostic_report').length} icon={AlertCircle} color="blue" index={1} />
            <StatsCard title="Other Documents" value={fetched.filter(r => r.documentType !== 'diagnostic_report').length} icon={CheckCircle2} color="green" index={2} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient name, ID or document..." className="flex-1" />
        <SelectFilter value={typeFilter} onChange={setTypeFilter}
          options={types.map((t) => ({ label: typeDisplay[t] || t, value: t }))}
          placeholder="All Types" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={10} emptyTitle="No diagnostic records found" emptyDescription="Try adjusting your search or filter criteria." />
      </div>

      {/* View Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewDoc(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Document Details</h2>
              <button onClick={() => setViewDoc(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Document ID</p>
                <p className="font-mono text-gray-900 dark:text-gray-100">{viewDoc._id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status</p>
                <Badge variant={statusVariant[viewDoc.status ?? 'pending'] ?? 'warning'}>{viewDoc.status ?? 'pending'}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Patient</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {typeof viewDoc.patientId === 'object' ? (viewDoc.patientId as Record<string, unknown>).fullName as string : "N/A"}
                </p>
                <p className="text-xs text-gray-400">
                  {typeof viewDoc.patientId === 'object' ? (viewDoc.patientId as Record<string, unknown>).patientId as string : String(viewDoc.patientId)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Document Type</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{typeDisplay[viewDoc.documentType] || viewDoc.documentType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Title</p>
                <p className="text-gray-900 dark:text-gray-100">{viewDoc.title || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Department</p>
                <p className="text-gray-900 dark:text-gray-100">{viewDoc.department || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-gray-900 dark:text-gray-100">{new Date(viewDoc.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Test Name</p>
                <p className="text-gray-900 dark:text-gray-100">{viewDoc.testName || "—"}</p>
              </div>
            </div>
            {viewDoc.notes && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">{viewDoc.notes}</p>
              </div>
            )}
            {viewDoc.fileUrl && (
              <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={viewDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] text-white rounded-xl text-sm font-medium hover:bg-[#2a3a9e] transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Open File
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDoc && (
        <EditDocumentModal
          doc={editDoc}
          onClose={() => setEditDoc(null)}
          onSave={(data) => updateMutation.mutateAsync({ id: editDoc._id, data })}
          saving={updateMutation.isPending}
        />
      )}
    </div>
  );
}

function EditDocumentModal({ doc, onClose, onSave, saving }: {
  doc: DocRow;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(doc.title || "");
  const [department, setDepartment] = useState(doc.department || "");
  const [notes, setNotes] = useState(doc.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, department, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Document</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:border-transparent transition-colors"
              placeholder="Document title"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:border-transparent transition-colors"
              placeholder="Department"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:border-transparent transition-colors resize-none"
              rows={4}
              placeholder="Optional notes"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="px-4 py-2.5 bg-[#1E2B7A] hover:bg-[#2a3a9e] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              {saving && <Clock className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
