import { FileSharingPageComponent } from "@/components/file-sharing-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_logged-in/sharing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <meta title="SnugSafe" />
      <FileSharingPageComponent />
    </>
  );
}
