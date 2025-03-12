import * as React from "react";
import Link from "next/link";
import { Personnel } from "@prisma/client";
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
import { Edit, Eye, Mail, Phone } from "lucide-react";

interface PersonnelItemProps {
  person: Personnel;
}

export function PersonnelItem({ person }: PersonnelItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.name}</CardTitle>
        <CardDescription>
          {person.position} - {person.department}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Badge variant={person.status === "ACTIVE" ? "default" : "secondary"}>
            {person.status}
          </Badge>
          {person.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              {person.email}
            </div>
          )}
          {person.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              {person.phone}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/personnel/${person.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Görüntüle
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/personnel/${person.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
