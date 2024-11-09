import { FilePageComponent } from "@/components/file-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_logged-in/files")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FilePageComponent />;
}
