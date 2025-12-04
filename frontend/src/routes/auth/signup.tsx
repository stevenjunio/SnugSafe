import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CorbadoAuth, useCorbado } from "@corbado/react";
import { useEffect, useCallback, useRef } from "react";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { user, isAuthenticated, getFullUser } = useCorbado();
  const isHandlingSignup = useRef(false);

  const handleUserSignup = useCallback(() => {
    // Prevent duplicate calls
    if (isHandlingSignup.current) {
      return;
    }
    isHandlingSignup.current = true;

    // Replace with your API endpoint
    const apiEndpoint =
      import.meta.env.VITE_SERVER_URL + "/api/v1/auth/register";
    getFullUser()
      .then((userData) => {
        console.log("Full user data:", userData); // Debugging log
        if (
          userData.val &&
          "identifiers" in userData.val &&
          userData.val.identifiers.length > 0
        ) {
          console.log(`user from full user`, userData.val.identifiers[0].value);
          const username = userData.val.identifiers[0].value;
          // Make the API call to create a new user
          if (userData.val.id) {
            console.log(`Attempting to create a new user`);
            fetch(apiEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                authID: userData?.val.id,
                username: username,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  console.error("Error response from server:", response.status);
                }
                return response.json();
              })
              .then((responseData) => {
                console.log("User created:", responseData);
                // Navigate to the files page after successful user creation
                router.navigate({ to: "/files" });
              })
              .catch((error) => {
                console.error("Error creating user:", error);
                router.navigate({ to: "/files" });
              });
          } else {
            console.error("Error fetching user information", user);
            isHandlingSignup.current = false;
          }
        } else {
          isHandlingSignup.current = false;
        }
      })
      .catch((error) => {
        console.error("Error getting full user:", error);
        isHandlingSignup.current = false;
      });
  }, [getFullUser, router, user]);

  useEffect(() => {
    console.log("isauthed from Corbado:", isAuthenticated);
    if (isAuthenticated) {
      handleUserSignup();
    }
  }, [isAuthenticated, handleUserSignup]);

  return (
    <CorbadoAuth
      onLoggedIn={() => {
        console.log(`we logged`);
        handleUserSignup();
      }}
    />
  );
}
