import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

console.log(`were here: `, import.meta.env.MODE);
export const Route = createRootRoute({
  beforeLoad(ctx) {
    console.log(`the context is`, ctx);
    switch (ctx.location.pathname) {
      case "/files":
        document.title = "ur files";
        console.log(`hi`);
        break;
      case "/sharing":
        document.title = "share with friends";
        break;
      case "/":
        document.title = "cute file storage";
        break;
    }
  },
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
      {!import.meta.env.PROD && <TanStackRouterDevtools />}
    </>
  ),
});
