import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  Globe,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  Stethoscope,
  Upload,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<Role, NavSection[]> = {
  "super-admin": [
    {
      items: [{ label: "Dashboard", href: "/super-admin", icon: LayoutDashboard }],
    },
    {
      title: "Management",
      items: [
        { label: "Patients", href: "/super-admin/patients", icon: Users },
        { label: "Doctors", href: "/super-admin/doctors", icon: Stethoscope, badge: "CMS" },
        { label: "Pending Registrations", href: "/super-admin/doctors/pending-registrations", icon: UserCheck },
        { label: "Departments", href: "/super-admin/departments", icon: Building2 },
        { label: "Staff Management", href: "/super-admin/staff", icon: BadgeCheck },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Appointments", href: "/super-admin/appointments", icon: CalendarDays, badge: "12" },
        { label: "Reports", href: "/super-admin/reports", icon: BarChart3 },
        { label: "Report Management", href: "/super-admin/report-management", icon: FileText },
        // TODO: Billing — temporarily hidden
        // { label: "Billing", href: "/super-admin/billing", icon: CreditCard },
      ],
    },
    {
      title: "System",
      items: [
        // TODO: Roles — temporarily hidden
        // { label: "Roles", href: "/super-admin/roles", icon: Shield },
        { label: "Notifications", href: "/super-admin/notifications", icon: Bell },
        { label: "Website CMS", href: "/super-admin/cms", icon: Globe },
        // TODO: Settings — temporarily hidden
        // { label: "Settings", href: "/super-admin/settings", icon: Settings },
      ],
    },
  ],

  "reception-admin": [
    {
      items: [
        { label: "Dashboard", href: "/reception-admin", icon: LayoutDashboard },
        { label: "Profile", href: "/reception-admin/profile", icon: UserCheck },
      ],
    },
    {
      title: "Front Desk",
      items: [
        { label: "Patients", href: "/reception-admin/patients", icon: Users },
        { label: "Appointments", href: "/reception-admin/appointments", icon: CalendarDays, badge: "5" },
        { label: "Queue", href: "/reception-admin/queue", icon: Activity },
      ],
    },
    {
      title: "Finance",
      items: [
        // TODO: Billing — temporarily hidden
        // { label: "Billing", href: "/reception-admin/billing", icon: CreditCard },
        { label: "Notifications", href: "/reception-admin/notifications", icon: Bell },
      ],
    },
  ],

  "lab-admin": [
    {
      items: [
        { label: "Dashboard", href: "/lab-admin", icon: LayoutDashboard },
        { label: "Profile", href: "/lab-admin/profile", icon: UserCheck },
      ],
    },
    {
      title: "Laboratory",
      items: [
        { label: "Diagnostic Records", href: "/lab-admin/diagnostic", icon: FlaskConical, badge: "8" },
        { label: "Reports", href: "/lab-admin/reports", icon: BarChart3 },
        { label: "Upload Reports", href: "/lab-admin/upload", icon: Upload },
      ],
    },
    {
      title: "Search",
      items: [
        { label: "Patient Search", href: "/lab-admin/patients", icon: Search },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Notifications", href: "/lab-admin/notifications", icon: Bell },
      ],
    },
  ],

  doctor: [
    {
      items: [{ label: "Dashboard", href: "/doctor", icon: LayoutDashboard }],
    },
    {
      title: "Clinical",
      items: [
        { label: "Today's Appointments", href: "/doctor/appointments", icon: CalendarDays, badge: "3" },
        { label: "Patient History", href: "/doctor/patients", icon: Users },
        { label: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList },
      ],
    },
    {
      title: "Records",
      items: [
        { label: "Medical Reports", href: "/doctor/reports", icon: BarChart3 },
        { label: "Schedule", href: "/doctor/schedule", icon: CalendarDays },
        { label: "Profile", href: "/doctor/profile", icon: UserCheck },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Notifications", href: "/doctor/notifications", icon: Bell },
      ],
    },
  ],
};
