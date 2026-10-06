import { Planner } from "@/components/Planner";
import { TripProvider } from "@/components/TripContext";

export default function Home() {
  return (
    <TripProvider>
      <Planner />
    </TripProvider>
  );
}
