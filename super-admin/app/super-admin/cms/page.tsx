"use client";
import { useRouter } from "next/navigation";
import { Globe, Edit3, CheckCircle2, XCircle, Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWebsiteContent } from "@/lib/hooks/useWebsiteContent";

export default function CMSPage() {
  const router = useRouter();
  const { data, isLoading } = useWebsiteContent();

  if (isLoading) return (
    <div className="space-y-6">
      <PageHeader title="Website CMS" icon={Globe} />
      <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Website CMS" description="Manage public-facing website content" icon={Globe}>
        <Button size="sm" onClick={() => router.push("/super-admin/homepage")}>Manage Homepage</Button>
      </PageHeader>

      {/* CMS Sub-sections Quick Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => router.push("/super-admin/homepage/hero")}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1E2B7A] dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Globe className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Hero Carousel Settings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Edit slides, search fields, blobs & styling</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="group-hover:translate-x-0.5 transition-transform">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        <div 
          onClick={() => router.push("/super-admin/homepage")}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-[#76BC21] dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Settings className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Homepage General CMS</h3>
              <p className="text-xs text-gray-400 mt-0.5">Emergency lines, booking CTA, hospital stats</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="group-hover:translate-x-0.5 transition-transform">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section Preview */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Hero Section</h2>
          <Button variant="ghost" size="sm" onClick={() => router.push("/super-admin/homepage/hero")}><Edit3 className="h-4 w-4 mr-1.5" />Edit</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["Title", data?.hero.title], ["Subtitle", data?.hero.subtitle], ["CTA Text", data?.hero.ctaText]].map(([k, v]) => (
            <div key={k as string} className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{k as string}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">{v as string}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Hospital Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {data?.stats && Object.entries(data.stats).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
              <p className="text-xl font-bold text-[#1E2B7A] dark:text-blue-400">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{k.replace(/([A-Z])/g, " $1").trim()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Services ({data?.services.length ?? 0})</h2>
          <Button size="sm" variant="outline">Add Service</Button>
        </div>
        <div className="space-y-2">
          {data?.services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                {svc.isActive ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-gray-400" />}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{svc.title}</p>
                  <p className="text-xs text-gray-400">{svc.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={svc.isActive ? "success" : "default"}>{svc.isActive ? "Active" : "Inactive"}</Badge>
                <Button variant="ghost" size="sm"><Edit3 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Notices</h2>
          <Button size="sm" variant="outline">Add Notice</Button>
        </div>
        <div className="space-y-2">
          {data?.notices.map((n) => (
            <div key={n.id} className="flex items-start justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.content}</p>
              </div>
              <Badge variant={n.isActive ? "success" : "default"}>{n.isActive ? "Active" : "Inactive"}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
