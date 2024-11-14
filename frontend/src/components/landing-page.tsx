import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Lock, UserCheck, Zap } from "lucide-react";

import snugSafeLogo from "@/assets/SnugSafe-logo.webp";
import { Link } from "@tanstack/react-router";
import { useCorbado } from "@corbado/react";

export function LandingPageComponent() {
  const { isAuthenticated } = useCorbado();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <img src={snugSafeLogo} width={100} alt="The logo for snugSafe" />
        </a>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Protect Your Firm with SnugSafe
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Secure your sensitive data with our cute digital vault
                  solution. Prevent breaches, eliminate leaks, and rebuild
                  trust.
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
                <Button variant="outline">Learn More</Button>
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
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
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
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Innovative OTP Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  Our unique water bubble lamp generates unpredictable OTP keys
                  for highly secure authentication.
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
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Benefits for Your Firm
            </h2>
            <ul className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <li className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Prevent Unauthorized Access</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Keep your sensitive data safe from cybercriminals and
                    internal threats.
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Eliminate Data Leaks</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Ensure your client and company documents remain confidential
                    at all times.
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <UserCheck className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Rebuild Trust</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Show your clients that you take their data security
                    seriously with SnugSafe.
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold">Streamlined Experience</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access your secure documents easily through our web and
                    mobile applications.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Secure Your Firm?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Schedule a demo to see how SnugSafe can protect your sensitive
                  data and prevent future breaches.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Request Demo</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section id="team" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Meet Our Team
            </h2>
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                "Yuk Wong",
                "Alondra Roblero",
                "Steven Junio",
                "Rahul Vijayan",
              ].map((name) => (
                <Card key={name}>
                  <CardContent className="flex flex-col items-center p-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mb-4" />
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-sm text-gray-500">Team Member</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
