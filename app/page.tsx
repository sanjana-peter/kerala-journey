import { MoodProvider } from "@/components/MoodContext";
import { Planner } from "@/components/Planner";
import { TripProvider } from "@/components/TripContext";

export default function Home() {
  return (
    <TripProvider>
      <MoodProvider>
        <Planner />
      </MoodProvider>
    </TripProvider>
  );
}
