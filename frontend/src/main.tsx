import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CorbadoProvider } from "@corbado/react";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
console.log(`the environment variables are`, import.meta.env);
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <CorbadoProvider
        projectId={import.meta.env.VITE_CORBADO_PROJECT_ID}
        frontendApiUrl={import.meta.env.VITE_CORBADO_FRONTEND_API_URL}
      >
        <RouterProvider router={router} />
      </CorbadoProvider>
    </StrictMode>
  );
}
