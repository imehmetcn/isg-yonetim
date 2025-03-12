import * as React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Equipment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye } from "lucide-react";

interface EquipmentItemProps {
  equipment: Equipment;
}

export function EquipmentItem({ equipment }: EquipmentItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{equipment.name}</CardTitle>
        <CardDescription>
          {equipment.type} - {equipment.serialNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge variant={equipment.status === "ACTIVE" ? "default" : "secondary"}>
            {equipment.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Son Bakım: {equipment.lastMaintenanceDate ? formatDate(equipment.lastMaintenanceDate) : "Belirtilmemiş"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/equipment/${equipment.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Görüntüle
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/equipment/${equipment.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
