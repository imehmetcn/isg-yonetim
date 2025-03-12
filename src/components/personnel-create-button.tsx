"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

export function PersonnelCreateButton({ className, variant, ...props }: ButtonProps) {
  return (
    <Button variant={variant} className={className} asChild {...props}>
      <Link href="/dashboard/personnel/new">
        <Plus className="mr-2 h-4 w-4" />
        Yeni Personel
      </Link>
    </Button>
  );
}
