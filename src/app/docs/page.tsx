"use client";

import { UserButton } from "@clerk/nextjs";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import AuthGuard from "../component/AuthGuard";

export default function DocsPage() {
  return (
    <AuthGuard>
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      {/* Top ToolBar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Key Vault</h1>
        <div className="flex gap-2">
          <Link href={"/dashboard"}>
            <Button
              variant={"outline"}
              className="flex items-center gap-2"
              aria-label="View Documentation"
            >
              <KeyRound /> Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
