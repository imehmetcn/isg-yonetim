import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type RiskAssessment = {
  id: string;
  title: string;
  department: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  date: Date;
  nextAssessmentDate: Date | null;
  createdAt: Date;
};

export const columns: ColumnDef<RiskAssessment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Başlık
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue("title")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Departman",
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap: Record<
        string,
        { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
      > = {
        DRAFT: { label: "Taslak", variant: "secondary" },
        IN_PROGRESS: { label: "Devam Ediyor", variant: "default" },
        COMPLETED: { label: "Tamamlandı", variant: "outline" },
        OVERDUE: { label: "Gecikmiş", variant: "destructive" },
      };

      const { label, variant } = statusMap[status] || { label: status, variant: "default" };

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "date",
    header: "Değerlendirme Tarihi",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return new Date(date).toLocaleDateString("tr-TR");
    },
  },
  {
    accessorKey: "nextAssessmentDate",
    header: "Sonraki Değerlendirme",
    cell: ({ row }) => {
      const date = row.getValue("nextAssessmentDate") as Date;
      return date ? new Date(date).toLocaleDateString("tr-TR") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assessment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/risk-assessments/${assessment.id}`}>Görüntüle</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/risk-assessments/${assessment.id}/edit`}>Düzenle</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
