import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CorbadoAuth, useCorbado } from "@corbado/react";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { user, isAuthenticated } = useCorbado();

  useEffect(() => {
    const handleUserSignup = () => {
      // Replace with your API endpoint
      const apiEndpoint =
        import.meta.env.VITE_SERVER_URL + "/api/v1/auth/register";

      // Make the API call to create a new user
      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authID: user.sub,
          username: user.name,
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("User created:", responseData);
          // Navigate to the files page after successful user creation
          router.navigate({ to: "/files" });
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    };

    console.log("isauthed from Corbado:", isAuthenticated);
    if (isAuthenticated) {
      handleUserSignup();
    }
  }, [isAuthenticated, user, router]);

  return (
    <CorbadoAuth
      onLoggedIn={() => {
        console.log(`we logged`);
      }}
    />
  );
}
