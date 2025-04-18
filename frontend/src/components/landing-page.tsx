import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Lock, UserCheck } from "lucide-react";

import snugSafeLogo from "@/assets/snug-safe-logo.webp";
import { Link } from "@tanstack/react-router";
import { useCorbado } from "@corbado/react";

export function LandingPageComponent() {
  const { isAuthenticated } = useCorbado();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 flex items-center">
        <a className="flex items-center justify-center mx-auto mt-4" href="#">
          <img src={snugSafeLogo} width={300} alt="The logo for snugSafe" />
        </a>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Dead simple file storage and sharing
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  It's free. Why? No reason, why not. I built it for fun, and
                  it's just been sitting around. So, if you want to use it, go
                  ahead.
                </p>
              </div>
              <div className="space-x-4">
                <Button>
                  <Link
                    to={isAuthenticated ? "/files" : "/auth/signup"}
                    className="hover:text-white text-white"
                  >
                    {isAuthenticated ? `Dashboard` : "Sign up"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <Lock className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Secure Digital Vault</CardTitle>
                </CardHeader>
                <CardContent>
                  All documents are securely encrypted and stored within a
                  digital vault, accessible via a mobile app.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <UserCheck className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Flexible Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  Manage and control access to your sensitive documents with
                  ease and precision.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <div className="container px-4 md:px-6 mx-auto my-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                It's just free
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
                I built SnugSafe because I wanted a dead-simple, secure way to
                share files and login with just a username and a passkey. No
                passwords, no hassle, just modern security and privacy for
                everyone. It’s just been sitting around, so it's free, if anyone
                wants to use it ¯\_(ツ)_/¯
              </p>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg dark:text-gray-400 mt-4">
                <b>How does it work?</b>
                <br />
                • Sign up with a username and your device’s passkey (no
                passwords!)
                <br />
                • Upload and share files securely—only you (and those you share
                with) can access them
                <br />
                • Everything is encrypted and locked to your identity
                <br />• Works on web and mobile, no install required
              </p>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg dark:text-gray-400 mt-4">
                <b>Why?</b>
                <br />
                Because security should be simple and fun. And because I can.
                Enjoy!
              </p>
              <div className="space-x-4 mt-6">
                <Button>
                  <Link
                    to={isAuthenticated ? "/files" : "/auth/signup"}
                    className="hover:text-white text-white"
                  >
                    {isAuthenticated ? `Dashboard` : "Try it now"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <section
          id="fun-free"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        ></section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 SnugSafe. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
