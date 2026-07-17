"use client";
import { Settings, Bell, Shield, Globe, Database } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-[#1E2B7A] dark:text-blue-400" />
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${defaultChecked ? "bg-[#76BC21]" : "bg-gray-200 dark:bg-gray-700"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${defaultChecked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Manage hospital system configuration" icon={Settings}>
        <Button size="sm">Save Changes</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Hospital Information" icon={Globe}>
          <div className="space-y-4">
            <Input label="Hospital Name" defaultValue="Mirsarai General Hospital" />
            <Input label="Contact Email" type="email" defaultValue="info@mgh.com" />
            <Input label="Emergency Phone" defaultValue="+880-1234-567891" />
            <Input label="Address" defaultValue="Mirsarai, Chittagong, Bangladesh" />
          </div>
        </Section>

        <Section title="Notifications" icon={Bell}>
          <div className="space-y-4">
            <Toggle label="Email Notifications" desc="Send appointment reminders via email" defaultChecked />
            <Toggle label="SMS Alerts" desc="Send SMS for emergency updates" defaultChecked />
            <Toggle label="Lab Report Alerts" desc="Notify doctor when reports are ready" defaultChecked />
            <Toggle label="System Maintenance Alerts" desc="Notify admin of system updates" />
            <Toggle label="Patient Registration Alerts" desc="Alert on new registrations" defaultChecked />
          </div>
        </Section>

        <Section title="Security" icon={Shield}>
          <div className="space-y-4">
            <Input label="Session Timeout (minutes)" type="number" defaultValue="60" />
            <Toggle label="Two-Factor Authentication" desc="Require 2FA for all admin accounts" defaultChecked />
            <Toggle label="Login Attempt Limit" desc="Lock account after 5 failed attempts" defaultChecked />
            <Toggle label="Audit Logs" desc="Keep detailed access logs" defaultChecked />
          </div>
        </Section>

        <Section title="System" icon={Database}>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-2">
              {[
                ["App Version", "v2.0.0"],
                ["Database", "PostgreSQL 15.2"],
                ["Last Backup", "Today, 2:00 AM"],
                ["Environment", "Production"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{k}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{v}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full">Run Backup Now</Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
