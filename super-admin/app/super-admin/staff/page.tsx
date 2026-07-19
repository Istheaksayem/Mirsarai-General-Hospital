"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users, Stethoscope, UserCheck, FlaskConical,
  Eye, Edit3, Trash2, ToggleLeft, ToggleRight,
  ArrowLeft, X, CheckCircle2, AlertTriangle, UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { Badge } from "@/components/ui/Badge";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  type StaffMember,
  getStaffMembers,
  getStaffMemberById,
  updateStaffMember,
  deleteStaffMember,
  activateStaffMember,
  deactivateStaffMember,
  createStaffMember,
} from "@/lib/services/api";
import toast from "react-hot-toast";

const STAFF_ROLES = [
  { key: "doctor",      label: "Doctors",       icon: Stethoscope,  color: "text-blue-600 dark:text-blue-400",  bgColor: "bg-blue-100 dark:bg-blue-900/20" },
  { key: "lab",         label: "Lab Admins",    icon: FlaskConical, color: "text-purple-600 dark:text-purple-400",bgColor: "bg-purple-100 dark:bg-purple-900/20" },
  { key: "reception",   label: "Receptionists", icon: UserCheck,    color: "text-green-600 dark:text-green-400",bgColor: "bg-green-100 dark:bg-green-900/20" },
] as const;

const statusVariant: Record<string, "success" | "warning" | "danger" | "default"> = {
  active:   "success",
  inactive: "default",
  suspended: "danger",
};

export default function StaffManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("doctor");

  const [viewStaffId, setViewStaffId] = useState<string | null>(null);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "doctor" });
  const [createError, setCreateError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", phone: "" });
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "deactivate" | "activate";
    id: string;
    name: string;
  } | null>(null);

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: () => getStaffMembers(),
    staleTime: 60_000,
  });
  const allStaff: StaffMember[] = (res?.data || []) as StaffMember[];

  const viewQuery = useQuery({
    queryKey: ["admin-staff", viewStaffId],
    queryFn: () => getStaffMemberById(viewStaffId!),
    enabled: !!viewStaffId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      setConfirmAction(null);
      toast.success("Staff member deleted");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to delete staff member"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "activate" | "deactivate" }) =>
      action === "activate" ? activateStaffMember(id) : deactivateStaffMember(id),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      queryClient.invalidateQueries({ queryKey: ["admin-staff", viewStaffId] });
      setConfirmAction(null);
      toast.success(vars.action === "activate" ? "Staff member activated" : "Staff member deactivated");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to update staff member"),
  });

  const createMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string; phone?: string; password: string; role: string }) =>
      createStaffMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      setShowCreate(false);
      setCreateForm({ fullName: "", email: "", phone: "", password: "", role: "doctor" });
      toast.success("Staff member created");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to create staff member"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffMember> }) =>
      updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      queryClient.invalidateQueries({ queryKey: ["admin-staff", editStaffId] });
      setEditStaffId(null);
      toast.success("Staff member updated");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to update staff member"),
  });

  const activeMembers = allStaff.filter((s) => {
    const matchRole = s.role === activeTab;
    const matchSearch = !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone || "").includes(search);
    return matchRole && matchSearch;
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  const roleLabel = (role: string) => STAFF_ROLES.find((r) => r.key === role)?.label || role;

  const roleCode = (member: StaffMember): string => {
    const p = member.profile as Record<string, unknown> | null;
    if (!p) return "";
    if (member.role === "reception") return (p.receptionistCode as string) || "";
    if (member.role === "lab") return (p.labAdminCode as string) || "";
    if (member.role === "doctor") return (p.doctorCode as string) || "";
    return "";
  };

  const openEdit = async (member: StaffMember) => {
    setEditStaffId(member._id);
    setEditLoading(true);
    try {
      const res = await getStaffMemberById(member._id);
      const data = res?.data as StaffMember;
      if (data) {
        setEditForm({ fullName: data.fullName, email: data.email, phone: data.phone || "" });
      } else {
        setEditForm({ fullName: member.fullName, email: member.email, phone: member.phone || "" });
      }
    } catch {
      setEditForm({ fullName: member.fullName, email: member.email, phone: member.phone || "" });
    } finally {
      setEditLoading(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff Management" icon={Users} />
        <div className="grid grid-cols-1 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/super-admin")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <PageHeader title="Staff Management" description={`${allStaff.length} staff members`} icon={Users}>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </button>
        </PageHeader>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-1 overflow-x-auto">
        {STAFF_ROLES.map((role) => {
          const count = allStaff.filter((s) => s.role === role.key).length;
          return (
            <button
              key={role.key}
              onClick={() => setActiveTab(role.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === role.key
                  ? "border-[#1E2B7A] text-[#1E2B7A] dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300"
              }`}
            >
              <role.icon className="h-4 w-4" />
              {role.label}
              <span className="text-xs ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search filter */}
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, email, or phone..." />

      {/* Error */}
      {isError ? (
        <div className="rounded-2xl border border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-8 text-center text-red-500">
          <p className="font-semibold">Could not connect to backend API</p>
          <p className="text-xs mt-1">Make sure the backend server is running</p>
        </div>
      ) : activeMembers.length === 0 && !search ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400">
          No {STAFF_ROLES.find((r) => r.key === activeTab)?.label.toLowerCase()} found
        </div>
      ) : (
        <div className="space-y-3">
          {activeMembers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-gray-400">
              No results match &quot;{search}&quot;
            </div>
          ) : (
            activeMembers.map((member, i) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center font-black text-base text-gray-500">
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{member.fullName}</p>
                    {roleCode(member) && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded font-mono">{roleCode(member)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  {member.phone && <p className="text-xs text-gray-400">{member.phone}</p>}
                </div>

                {/* Status */}
                <Badge variant={statusVariant[member.accountStatus] ?? "default"}>
                  {member.accountStatus}
                </Badge>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* View */}
                  <button
                    onClick={() => setViewStaffId(member._id)}
                    title="View details"
                    className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(member)}
                    title="Edit staff"
                    className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>

                  {/* Activate / Deactivate */}
                  <button
                    onClick={() => setConfirmAction({
                      type: member.isActive ? "deactivate" : "activate",
                      id: member._id,
                      name: member.fullName,
                    })}
                    title={member.isActive ? "Deactivate" : "Activate"}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                      member.isActive
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200"
                        : "bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {member.isActive ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmAction({ type: "delete", id: member._id, name: member.fullName })}
                    title="Delete staff"
                    className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── View Details Modal ──────────────────────────────────────────────── */}
      {viewStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewStaffId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Staff Details</h3>
              <button onClick={() => setViewStaffId(null)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {viewQuery.isLoading ? (
              <div className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
            ) : viewQuery.data?.data ? (
              <div className="space-y-4">
                <StaffDetailRow label="Full Name" value={viewQuery.data.data.fullName} />
                <StaffDetailRow label="Email" value={viewQuery.data.data.email} />
                <StaffDetailRow label="Phone" value={viewQuery.data.data.phone || "—"} />
                <StaffDetailRow label="Role" value={roleLabel(viewQuery.data.data.role)} />
                <StaffDetailRow label="Status" value={viewQuery.data.data.accountStatus} />
                <StaffDetailRow label="Active" value={viewQuery.data.data.isActive ? "Yes" : "No"} />
                <StaffDetailRow label="Verified" value={viewQuery.data.data.isVerified ? "Yes" : "No"} />
                <StaffDetailRow label="Profile Completed" value={viewQuery.data.data.profileCompleted ? "Yes" : "No"} />
                <StaffDetailRow label="Approval" value={viewQuery.data.data.approvalStatus} />
                <StaffDetailRow label="Joined" value={new Date(viewQuery.data.data.createdAt).toLocaleDateString()} />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Could not load staff details.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      {editStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditStaffId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Edit Staff</h3>
              <button onClick={() => setEditStaffId(null)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {editLoading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 rounded-full border-4 border-[#1E2B7A] border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                  <input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100"
                  />
                </div>
              </div>
            )}

            {!editLoading && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditStaffId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => updateMutation.mutate({ id: editStaffId, data: editForm })}
                  disabled={updateMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E2B7A] hover:bg-[#76BC21] text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Create Staff Modal ──────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Add Staff Member</h3>
              <button onClick={() => setShowCreate(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {createError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {createError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                <input value={createForm.fullName} onChange={e => setCreateForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
                <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                <input value={createForm.phone} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password *</label>
                <input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role *</label>
                <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] dark:text-gray-100">
                  <option value="doctor">Doctor</option>
                  <option value="reception">Receptionist</option>
                  <option value="lab">Lab Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  setCreateError(null);
                  if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password.trim()) {
                    setCreateError("Full name, email, and password are required");
                    return;
                  }
                  createMutation.mutate(createForm);
                }}
                disabled={createMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-[#1E2B7A] hover:bg-[#76BC21] text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? "Creating..." : "Create Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal (Delete / Activate / Deactivate) ────────────── */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full mx-auto ${
              confirmAction.type === "delete" ? "bg-red-100 dark:bg-red-900/30" :
              confirmAction.type === "deactivate" ? "bg-amber-100 dark:bg-amber-900/30" :
              "bg-green-100 dark:bg-green-900/30"
            }`}>
              {confirmAction.type === "delete" ? (
                <Trash2 className="h-5 w-5 text-red-500" />
              ) : confirmAction.type === "deactivate" ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {confirmAction.type === "delete" ? "Delete Staff?" :
                 confirmAction.type === "deactivate" ? "Deactivate Account?" :
                 "Activate Account?"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {confirmAction.type === "delete"
                  ? `Remove "${confirmAction.name}" from the system. They will lose all access immediately.`
                  : confirmAction.type === "deactivate"
                  ? `Deactivate "${confirmAction.name}". They will be unable to log in until reactivated.`
                  : `Activate "${confirmAction.name}". They will regain access to the dashboard.`}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    deleteMutation.mutate(confirmAction.id);
                  } else {
                    toggleActiveMutation.mutate({ id: confirmAction.id, action: confirmAction.type as "activate" | "deactivate" });
                  }
                }}
                disabled={deleteMutation.isPending || toggleActiveMutation.isPending}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors disabled:opacity-50 ${
                  confirmAction.type === "activate"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {deleteMutation.isPending || toggleActiveMutation.isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</span>
    </div>
  );
}
