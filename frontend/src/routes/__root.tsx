import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/useTheme";

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
    <ThemeProvider defaultTheme="system" storageKey="snugsafe-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
      {!import.meta.env.PROD && <TanStackRouterDevtools />}
    </ThemeProvider>
  ),
});
