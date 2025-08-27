import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "../styles/globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Key Vault",
  description: "Securely store and manage your API keys",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-br from-gray-900 to-gray-950 text-white">
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
