import { LandingPageComponent } from "@/components/landing-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return <LandingPageComponent />;
}
