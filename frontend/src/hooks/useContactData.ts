import { useQuery } from "@tanstack/react-query";

export interface ContactData {
  header: {
    title: string;
    subtitle: string;
  };
  contactInfo: {
    title: string;
    address: {
      name: string;
      location: string;
    };
    hotline: {
      number: string;
    };
    email: {
      address: string;
    };
  };
  form: {
    title: string;
  };
}

const fetchContactData = async (): Promise<ContactData> => {
  const res = await fetch("/data/contactData.json");
  if (!res.ok) throw new Error("Failed to fetch contact data");
  return res.json();
};

export const useContactData = () =>
  useQuery<ContactData>({
    queryKey: ["contactData"],
    queryFn: fetchContactData,
    staleTime: 1000 * 60 * 15,
  });
