"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import {
  Gamepad2,
  ShoppingBag,
  Trophy,
  Users,
  Shield,
  Zap,
  Sparkles,
  BookOpen,
  Globe,
  Clock,
  Heart,
  Star,
  Library,
  Wallet,
  Download,
  Play,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1B2838] to-[#2A475E] text-white">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-4 mt-4 flex items-center justify-between rounded-xl border border-[#3C5A78] bg-[#171D25]/90 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#66C0F4]/20 p-2">
            <Gamepad2 className="h-6 w-6 text-[#66C0F4]" />
          </div>
          <h1 className="bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-2xl font-bold text-transparent">
            HeavensPlay
          </h1>
        </div>

        <SignInButton>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] transition-all hover:from-[#66C0F4] hover:to-[#90BA3C] hover:shadow-lg hover:shadow-[#66C0F4]/30">
            <ShoppingBag className="h-4 w-4" />
            Get Started
          </Button>
        </SignInButton>
      </motion.header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-between gap-8 px-6 py-16 md:flex-row md:px-16 md:py-20">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#66C0F4]/20 px-4 py-2 text-sm text-[#90BA3C]">
            <Sparkles className="h-4 w-4" />
            Ultimate Gaming Collection
          </div>

          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Your Digital Game Library, <br />
            <span className="bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h2>

          <p className="mx-auto max-w-lg text-base text-gray-300 md:mx-0 md:text-lg">
            HeavensPlay Management helps gamers organize, manage, and discover their favorite
            titles across all platforms. Build your ultimate gaming collection
            with smart features.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <SignInButton>
              <Button className="rounded-lg bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] px-6 py-3 font-semibold text-white transition-all hover:from-[#66C0F4] hover:to-[#90BA3C] hover:shadow-lg hover:shadow-[#66C0F4]/30">
                Explore Games
              </Button>
            </SignInButton>

            <Button
              variant="outline"
              className="border-[#90BA3C]/30 bg-[#90BA3C]/10 text-[#90BA3C] hover:bg-[#90BA3C]/20"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-1 justify-center mt-8 md:mt-0"
        >
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] opacity-20 blur-xl"></div>
            <div className="relative">
              <img
                src="/bgpicture.jpg"
                alt="GameVault Gaming Platform"
                className="rounded-2xl border-2 border-[#66C0F4]/30 shadow-2xl w-full h-auto object-cover transform scale-150"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl font-semibold"></p>
                <p className="text-base text-gray-200"></p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-t-3xl border-t border-[#3C5A78] bg-[#171D25]/80 px-6 py-16 md:px-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl space-y-12 text-center">
          <div>
            <h3 className="text-3xl font-bold text-white md:text-4xl">
              Why Gamers Choose HeavensPlay
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              The ultimate platform for managing your gaming library across all
              stores and platforms
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-[#3C5A78] bg-[#171D25]/60 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#66C0F4]/20">
                <Library className="h-7 w-7 text-[#66C0F4]" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Unified Library
              </h4>
              <p className="text-sm text-gray-400">
                Organize all your games from Steam, Epic, and other platforms in
                one beautiful interface.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-[#3C5A78] bg-[#171D25]/60 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#90BA3C]/20">
                <Trophy className="h-7 w-7 text-[#90BA3C]" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Achievement Tracking
              </h4>
              <p className="text-sm text-gray-400">
                Track your progress, achievements, and playtime across all your
                games in one place.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 rounded-2xl border border-[#3C5A78] bg-[#171D25]/60 p-6 backdrop-blur-sm transition-all"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFB700]/20">
                <Zap className="h-7 w-7 text-[#FFB700]" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                Smart Discovery
              </h4>
              <p className="text-sm text-gray-400">
                Find new games tailored to your taste with our intelligent
                recommendation system.
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
        className="px-6 py-12 md:px-16 md:py-16"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#66C0F4] md:text-3xl lg:text-4xl">
              50K+
            </div>
            <div className="text-sm text-gray-400">Gamers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#90BA3C] md:text-3xl lg:text-4xl">
              100+
            </div>
            <div className="text-sm text-gray-400">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFB700] md:text-3xl lg:text-4xl">
              4.9/5
            </div>
            <div className="text-sm text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FF6B35] md:text-3xl lg:text-4xl">
              24/7
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
        className="rounded-t-3xl border-t border-[#3C5A78] bg-[#171D25]/80 px-6 py-16 md:px-16 md:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white md:text-4xl">
                Contact Us
              </h3>
              <p className="mt-4 max-w-md text-gray-300">
                Need help with your game library or have questions? Our support
                team is here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-lg border border-[#3C5A78] bg-[#171D25]/60 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#66C0F4]/20">
                  <ShoppingBag className="h-5 w-5 text-[#66C0F4]" />
                </div>
                <span className="text-white">support@heavensplay.com</span>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-[#3C5A78] bg-[#171D25]/60 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#90BA3C]/20">
                  <Users className="h-5 w-5 text-[#90BA3C]" />
                </div>
                <span className="text-white">Join our Discord</span>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-[#3C5A78] bg-[#171D25]/60 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFB700]/20">
                  <Globe className="h-5 w-5 text-[#FFB700]" />
                </div>
                <span className="text-white">
                  Global Gaming Community
                </span>
              </div>
            </div>
          </div>

          {/* Game Showcase */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="h-[200px] w-full overflow-hidden rounded-2xl border-2 border-[#66C0F4]/30 shadow-lg md:h-[250px]"
          >
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#66C0F4]/10 to-[#90BA3C]/10">
              <div className="text-center">
                <Gamepad2 className="mx-auto mb-4 h-12 w-12 text-[#90BA3C] md:h-16 md:w-16" />
                <p className="text-lg font-semibold text-white">
                  Your Gaming Universe Awaits
                </p>
                <p className="mt-2 text-sm text-gray-300">
                  Discover, organize, and play
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="px-6 py-12 text-center md:px-16 md:py-16"
      >
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#3C5A78] bg-gradient-to-r from-[#66C0F4]/10 to-[#90BA3C]/10 p-6 backdrop-blur-sm md:p-8">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-[#90BA3C] md:h-12 md:w-12" />
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Build Your Ultimate Game Library?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Join thousands of gamers who use GameVault to manage their
            collections and discover new favorites
          </p>
          <div className="mt-6 md:mt-8">
            <SignInButton>
              <Button className="bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] px-6 py-3 text-base font-semibold transition-all hover:from-[#66C0F4] hover:to-[#90BA3C] hover:shadow-lg hover:shadow-[#66C0F4]/30 md:px-8 md:py-3 md:text-lg">
                Start Gaming Now
              </Button>
            </SignInButton>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#3C5A78] py-8 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#66C0F4]/20 p-1">
                <Gamepad2 className="h-4 w-4 text-[#66C0F4]" />
              </div>
              <span className="text-white">GameVault</span>
            </div>
            <div>
              © {new Date().getFullYear()} GameVault. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#66C0F4]">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#66C0F4]">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-[#66C0F4]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}