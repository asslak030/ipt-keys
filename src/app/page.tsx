"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import {
  Key,
  KeySquare,
  Mail,
  MapPin,
  Phone,
  Shield,
  Zap,
  Sparkles,
  BookOpen,
  Lock,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-4 mt-4 flex items-center justify-between rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-2">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">KeyVault</h1>
        </div>

        <SignInButton>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg">
            <KeySquare className="h-4 w-4" />
            Sign In
          </Button>
        </SignInButton>
      </motion.header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-between gap-12 px-8 py-20 md:flex-row md:px-20">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            <Sparkles className="h-4 w-4" />
            Secure API Key Management
          </div>

          <h2 className="text-4xl leading-tight font-extrabold md:text-6xl">
            Secure API Keys, <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h2>

          <p className="mx-auto max-w-lg text-lg text-gray-300 md:mx-0">
            KeyVault helps developers generate, manage, and protect API keys
            without the hassle. Built with modern security and a smooth UI.
          </p>

          <div className="flex justify-center gap-4 md:justify-start">
            <SignInButton>
              <Button className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg">
                Get Started
              </Button>
            </SignInButton>

            <Button
              variant="outline"
              className="border-indigo-400/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </div>
        </motion.div>

        {/* Right Image / Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-1 justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl"></div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              alt="Security Illustration"
              className="relative w-80 drop-shadow-2xl md:w-[420px]"
            />
          </div>
        </motion.div>
      </section>

      {/* About / Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-t-3xl bg-gray-800/50 px-8 py-20 md:px-20"
      >
        <div className="mx-auto max-w-6xl space-y-12 text-center">
          <div>
            <h3 className="text-3xl font-bold text-white md:text-4xl">
              Why Developers Choose KeyVault
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              A modern solution for API key management with security and
              developer experience at its core
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10">
                <Lock className="h-7 w-7 text-indigo-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Enterprise Security
              </h4>
              <p className="text-sm text-gray-400">
                Encryption, role-based access, and safe storage ensure your API
                keys are never at risk.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10">
                <Key className="h-7 w-7 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Effortless Management
              </h4>
              <p className="text-sm text-gray-400">
                Create, rotate, and revoke keys instantly — no more manual
                headaches.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10">
                <Zap className="h-7 w-7 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Fast & Developer-First
              </h4>
              <p className="text-sm text-gray-400">
                Built for speed and simplicity, KeyVault fits seamlessly into
                your dev workflow.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-8 py-16 md:px-20"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400 md:text-4xl">
              3+
            </div>
            <div className="text-sm text-gray-400">Developers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 md:text-4xl">
              100+
            </div>
            <div className="text-sm text-gray-400">API Keys</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 md:text-4xl">
              99.9%
            </div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 md:text-4xl">
              Nonstop
            </div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-t-3xl bg-gray-800/50 px-8 py-20 md:px-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white md:text-4xl">
                Contact Us
              </h3>
              <p className="mt-4 max-w-md text-gray-300">
                Have questions or need support? Reach out to us anytime — we'd
                love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-lg bg-gray-800/30 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-white">support@keyvault.com</span>
              </div>

              <div className="flex items-center space-x-3 rounded-lg bg-gray-800/30 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white">+63 912 345 6789</span>
              </div>

              <div className="flex items-center space-x-3 rounded-lg bg-gray-800/30 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-white">
                  Holy Cross College, Pampanga, Philippines
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="h-[250px] w-full overflow-hidden rounded-2xl border-2 border-indigo-500/30 shadow-lg md:h-[300px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3852.1625987185694!2d120.76906296070352!3d15.094364669792418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396fba8a871ef9d%3A0xcf10e5f6f2a968cc!2sHoly%20Cross%20College%20-%20Pampanga!5e0!3m2!1sen!2sph!4v1755741160711!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-8 py-16 text-center md:px-20"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 backdrop-blur-sm">
          <Globe className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Secure Your API Keys?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Join thousands of developers who trust KeyVault with their API key
            management
          </p>
          <div className="mt-8">
            <SignInButton>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-lg font-semibold transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg">
                Get Started Free
              </Button>
            </SignInButton>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800/50 py-8 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-500/10 p-1">
                <Shield className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-white">KeyVault</span>
            </div>
            <div>
              © {new Date().getFullYear()} KeyVault. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
