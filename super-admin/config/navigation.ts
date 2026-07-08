import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Settings,
  Stethoscope,
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
      items: [
        {
          label: "Dashboard",
          href: "/super-admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Staff & Users", href: "/super-admin/users", icon: Users },
        {
          label: "Doctors",
          href: "/super-admin/doctors",
          icon: Stethoscope,
        },
        {
          label: "Departments",
          href: "/super-admin/departments",
          icon: Activity,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Appointments",
          href: "/super-admin/appointments",
          icon: CalendarDays,
          badge: "12",
        },
        {
          label: "Reports",
          href: "/super-admin/reports",
          icon: BarChart3,
        },
        {
          label: "Billing",
          href: "/super-admin/billing",
          icon: FileText,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Settings",
          href: "/super-admin/settings",
          icon: Settings,
        },
      ],
    },
  ],

  "reception-admin": [
    {
      items: [
        {
          label: "Dashboard",
          href: "/reception-admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Reception",
      items: [
        {
          label: "Appointments",
          href: "/reception-admin/appointments",
          icon: CalendarDays,
          badge: "5",
        },
        {
          label: "Patients",
          href: "/reception-admin/patients",
          icon: Users,
        },
        {
          label: "Check-In",
          href: "/reception-admin/check-in",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Records",
      items: [
        {
          label: "Patient Records",
          href: "/reception-admin/records",
          icon: ClipboardList,
        },
        {
          label: "Billing",
          href: "/reception-admin/billing",
          icon: FileText,
        },
      ],
    },
  ],

  "lab-admin": [
    {
      items: [
        {
          label: "Dashboard",
          href: "/lab-admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Laboratory",
      items: [
        {
          label: "Test Orders",
          href: "/lab-admin/orders",
          icon: FlaskConical,
          badge: "8",
        },
        {
          label: "Results",
          href: "/lab-admin/results",
          icon: ClipboardList,
        },
        {
          label: "Patients",
          href: "/lab-admin/patients",
          icon: Users,
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          label: "Lab Reports",
          href: "/lab-admin/reports",
          icon: BarChart3,
        },
        {
          label: "Inventory",
          href: "/lab-admin/inventory",
          icon: FileText,
        },
      ],
    },
  ],

  doctor: [
    {
      items: [
        {
          label: "Dashboard",
          href: "/doctor",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Clinical",
      items: [
        {
          label: "My Patients",
          href: "/doctor/patients",
          icon: Users,
        },
        {
          label: "Appointments",
          href: "/doctor/appointments",
          icon: CalendarDays,
          badge: "3",
        },
        {
          label: "Prescriptions",
          href: "/doctor/prescriptions",
          icon: ClipboardList,
        },
      ],
    },
    {
      title: "Records",
      items: [
        {
          label: "Lab Results",
          href: "/doctor/lab-results",
          icon: FlaskConical,
        },
        {
          label: "Reports",
          href: "/doctor/reports",
          icon: BarChart3,
        },
      ],
    },
  ],
};
