import * as React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Training } from "@prisma/client";
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
import { Calendar, Edit, Eye, GraduationCap } from "lucide-react";

interface TrainingItemProps {
  training: Training;
}

export function TrainingItem({ training }: TrainingItemProps) {
  // Eğitim durumuna göre badge rengi
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "PENDING":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{training.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(training.startDate)} - {formatDate(training.endDate)}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <Badge variant={getBadgeVariant(training.status)}>
              {training.status}
            </Badge>
          </div>
          {training.description && (
            <p className="text-sm text-muted-foreground">{training.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/trainings/${training.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Görüntüle
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/trainings/${training.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
