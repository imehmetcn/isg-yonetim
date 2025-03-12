import { formatDate } from "@/lib/utils";
import { Audit } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuditItemProps {
  audit: Audit;
}

export function AuditItem({ audit }: AuditItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link href={`/dashboard/audits/${audit.id}`} className="font-semibold hover:underline">
          {audit.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{audit.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={audit.status === "COMPLETED" ? "default" : "secondary"}>
            {audit.status}
          </Badge>
          <span className="text-sm text-muted-foreground">{formatDate(audit.date)}</span>
          <span className="text-sm text-muted-foreground">{audit.department}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/audits/${audit.id}`}>Görüntüle</Link>
        </Button>
      </div>
    </div>
  );
}
