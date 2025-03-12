import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

export function EquipmentCreateButton({ className, variant, ...props }: ButtonProps) {
  return (
    <Button variant={variant} className={className} asChild {...props}>
      <Link href="/dashboard/equipment/new">
        <Plus className="mr-2 h-4 w-4" />
        Yeni Ekipman
      </Link>
    </Button>
  );
}
