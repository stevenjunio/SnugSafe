import { createFileRoute } from "@tanstack/react-router";
import { DemoFrameComponent } from "@/components/demo-frame";
import { DemoPageComponent } from "@/components/demo-page";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DemoFrameComponent>
      <DemoPageComponent />
    </DemoFrameComponent>
  );
}
