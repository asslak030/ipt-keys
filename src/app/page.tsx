"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import { Key, KeySquare, Mail, MapPin, Phone, Shield, Zap } from "lucide-react";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#1e1c2a] text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-gray-800 px-8 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-yellow-400">KeyVault</h1>
        </div>

        <SignInButton>
          <Button className="rounded-lg bg-yellow-500 font-semibold text-black transition hover:bg-yellow-400">
            <KeySquare />
            Sign In
          </Button>
        </SignInButton>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-between gap-12 px-8 py-20 md:flex-row md:px-20">
        {/* Left Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-4xl leading-tight font-extrabold md:text-6xl">
            Secure API Keys, <br />
            <span className="text-yellow-400">Simplified.</span>
          </h2>
          <p className="mx-auto max-w-lg text-lg text-gray-300 md:mx-0">
            KeyVault helps developers generate, manage, and protect API keys
            without the hassle. Built with modern security and a smooth UI.
          </p>
          <div className="flex justify-center gap-4 md:justify-start">
            <SignInButton>
              <Button className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400">
                Get Started
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Right Image / Illustration */}
        <div className="flex flex-1 justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
            alt="AI Robot Illustration"
            className="w-80 drop-shadow-2xl md:w-[420px]"
          />
        </div>
      </section>

      {/* About / Features Section */}
      <section
        id="about"
        className="rounded-t-3xl bg-[#2a2737] px-8 py-20 md:px-20"
      >
        <div className="mx-auto max-w-6xl space-y-12 text-center">
          <h3 className="text-3xl font-bold text-yellow-400 md:text-4xl">
            Why Developers Choose KeyVault
          </h3>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <Shield className="mx-auto h-12 w-12 text-yellow-400" />
              <h4 className="text-xl font-semibold">Enterprise Security</h4>
              <p className="text-sm text-gray-400">
                Encryption, role-based access, and safe storage ensure your API
                keys are never at risk.
              </p>
            </div>
            <div className="space-y-4">
              <Key className="mx-auto h-12 w-12 text-yellow-400" />
              <h4 className="text-xl font-semibold">Effortless Management</h4>
              <p className="text-sm text-gray-400">
                Create, rotate, and revoke keys instantly — no more manual
                headaches.
              </p>
            </div>
            <div className="space-y-4">
              <Zap className="mx-auto h-12 w-12 text-yellow-400" />
              <h4 className="text-xl font-semibold">Fast & Developer-First</h4>
              <p className="text-sm text-gray-400">
                Built for speed and simplicity, KeyVault fits seamlessly into
                your dev workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="border-t border-gray-800 bg-[#1b1a25] px-8 py-20 md:px-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-yellow-400 md:text-4xl">
              Contact Us
            </h3>
            <p className="max-w-md text-gray-300">
              Have questions or need support? Reach out to us anytime — we’d
              love to hear from you.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300 transition hover:text-yellow-400">
                <Mail className="h-5 w-5" />
                <span className="text-white">support@keyvault.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 transition hover:text-yellow-400">
                <Phone className="h-5 w-5" />
                <span className="text-white">+63 912 345 6789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 transition hover:text-yellow-400">
                <MapPin className="h-5 w-5" />
                <span className="text-white">
                  Holy Cross College, Pampanga, Philippines
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[250px] w-full overflow-hidden rounded-lg border-2 border-yellow-400 shadow-md md:h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3852.1625987185694!2d120.76906296070352!3d15.094364669792418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fba8a871ef9d%3A0xcf10e5f6f2a968cc!2sHoly%20Cross%20College%20-%20Pampanga!5e0!3m2!1sen!2sph!4v1755741160711!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KeyVault. All rights reserved.
      </footer>
    </div>
  );
}
