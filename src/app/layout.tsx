import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import "../styles/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

import { ourFileRouter } from "~/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: "Game Vault - Manage Your Game API Keys",
  description: "Securely store and manage your API keys",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
          }}
        >
          {children}
        </ClerkProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}