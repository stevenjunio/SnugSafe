import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { LoggedInFrameComponent } from "@/components/logged-in-frame";
import { useCorbado } from "@corbado/react";

export const Route = createFileRoute("/_layout/_logged-in")({
  component: RouteComponent,
  beforeLoad() {
    // if(User.toString())
    // throw redirect({ to: "auth/signup" });
  },
});

function RouteComponent() {
  const { isAuthenticated, user } = useCorbado();
  const navigate = useNavigate();

  console.log(`we are authenticated`, isAuthenticated, user);
  if (!isAuthenticated) {
    console.log(`we are not authenticated`, isAuthenticated);
    navigate({ to: "/auth/signup" });
  }
  return (
    <div>
      <LoggedInFrameComponent>
        <Outlet />
      </LoggedInFrameComponent>
    </div>
  );
}
