import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import EmergencyContact from "@/components/EmergencyContact";
import AppointmentCTA from "@/components/AppointmentCTA";
import Statistics from "@/components/Statistics";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Doctors />
      <EmergencyContact />
      <AppointmentCTA />
      <Statistics />
    </>
  );
}
