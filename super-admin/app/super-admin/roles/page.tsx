"use client";
import { useState } from "react";
import { Shield, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRoles } from "@/lib/hooks/useRoles";

export default function RolesPage() {
  const { data = [], isLoading } = useRoles();
  const [search, setSearch] = useState("");

  const filtered = data.filter((r) =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Role Management" description={`${data.length} roles configured`} icon={Shield}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Role</Button>
      </PageHeader>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search roles..." className="max-w-sm" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No roles found" description="Try adjusting your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((role) => (
            <div key={role.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                    <Shield className="h-4.5 w-4.5 text-[#1E2B7A] dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{role.name}</p>
                    <p className="text-xs text-gray-400">{role.userCount} users</p>
                  </div>
                </div>
                {role.isSystem && <Badge variant="info">System</Badge>}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{role.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 4).map((p) => (
                  <span key={p} className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
                {role.permissions.length > 4 && (
                  <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                    +{role.permissions.length - 4} more
                  </span>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 text-xs">Edit</Button>
                {!role.isSystem && <Button variant="outline" size="sm" className="flex-1 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800">Delete</Button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
