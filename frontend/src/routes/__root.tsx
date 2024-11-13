import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

console.log(`were here: `, import.meta.env.MODE);
export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
      {!import.meta.env.PROD && <TanStackRouterDevtools />}
    </>
  ),
});
