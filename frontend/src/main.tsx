import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CorbadoProvider } from "@corbado/react";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const CORBADO_PROJECT_ID = "pro-1009394064210216640";

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
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <CorbadoProvider projectId={CORBADO_PROJECT_ID}>
        <RouterProvider router={router} />
      </CorbadoProvider>
    </StrictMode>
  );
}
