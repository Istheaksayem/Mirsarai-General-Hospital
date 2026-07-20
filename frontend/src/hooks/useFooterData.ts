import { useQuery } from "@tanstack/react-query";
import { normalizeImages } from "@/lib/getImageUrl";

export interface BiText { en: string; bn: string }

export interface FooterSocialLink {
  platform: string;
  icon: string;
  url: string;
  hoverColor: string;
}

export interface FooterLink {
  label: BiText;
  href: string;
}

export interface FooterDepartmentItem {
  name: BiText;
  href: string;
}

export interface FooterContactBlock {
  icon: string;
  hospitalName: BiText;
  location: BiText;
}

export interface FooterPhoneBlock {
  icon: string;
  number: string;
}

export interface FooterEmailBlock {
  icon: string;
  address: string;
}

export interface FooterEmergencyCard {
  icon: string;
  label: BiText;
  phoneNumber: string;
  gradient: string;
  badgeGradient: string;
  blobColor: string;
  iconGradient: string;
}

export interface FooterBottomBarLink {
  label: BiText;
  href: string;
}

export interface FooterBottomBar {
  hospitalName: BiText;
  rightsText: BiText;
  privacyPolicy: FooterBottomBarLink;
  termsOfService: FooterBottomBarLink;
}

export interface SectionConfig {
  isVisible: boolean;
  order: number;
}

export interface FooterData {
  brand: {
    logo: string;
    description: BiText;
    socialLinks: FooterSocialLink[];
  };
  exploreLinks: {
    title: BiText;
    links: FooterLink[];
  };
  departments: {
    title: BiText;
    items: FooterDepartmentItem[];
  };
  contactInfo: {
    title: BiText;
    address: FooterContactBlock;
    phone: FooterPhoneBlock;
    email: FooterEmailBlock;
  };
  emergencyCard: FooterEmergencyCard;
  bottomBar: FooterBottomBar;
  sections: Record<string, SectionConfig>;
}

const fetchFooterData = async (): Promise<FooterData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/footer`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch Footer data");
  }
  const json = await res.json();
  return normalizeImages(json.data) as FooterData;
};

export const useFooterData = () =>
  useQuery<FooterData>({
    queryKey: ["footerData"],
    queryFn: fetchFooterData,
    staleTime: 1000 * 60 * 15,
  });

export default useFooterData;
