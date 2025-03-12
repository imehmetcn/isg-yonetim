import { Document } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DocumentItemProps {
  document: Document;
}

export function DocumentItem({ document }: DocumentItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/documents/${document.id}`}
          className="font-semibold hover:underline"
        >
          {document.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">{document.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={document.status === "PUBLISHED" ? "default" : "secondary"}>
            {document.status}
          </Badge>
          <span className="text-sm text-muted-foreground">{document.category}</span>
          <span className="text-sm text-muted-foreground">v{document.version}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={document.fileUrl} target="_blank">
            İndir
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/documents/${document.id}`}>Görüntüle</Link>
        </Button>
      </div>
    </div>
  );
}
