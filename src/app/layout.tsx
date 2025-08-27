import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "../styles/globals.css";

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
      <body className="bg-[#000000] text-white">
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
