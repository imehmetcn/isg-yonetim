import * as React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
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
import { AlertTriangle, Edit, Eye } from "lucide-react";

interface RiskAssessment {
  id: string;
  title: string;
  description: string | null;
  department: string;
  severity?: number;
  likelihood?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RiskAssessmentItemProps {
  assessment: RiskAssessment;
}

export function RiskAssessmentItem({ assessment }: RiskAssessmentItemProps) {
  // Risk seviyesini hesapla
  const calculateRiskLevel = (severity: number = 3, likelihood: number = 3) => {
    const riskScore = severity * likelihood;
    if (riskScore >= 15) return "HIGH";
    if (riskScore >= 8) return "MEDIUM";
    return "LOW";
  };

  // Risk seviyesine göre badge rengi
  const getBadgeVariant = (severity: number = 3, likelihood: number = 3) => {
    const riskLevel = calculateRiskLevel(severity, likelihood);
    switch (riskLevel) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default"; // warning yerine default kullanıyoruz
      case "LOW":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assessment.title}</CardTitle>
        <CardDescription>
          {assessment.department} - {formatDate(assessment.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <Badge variant={getBadgeVariant(assessment.severity, assessment.likelihood)}>
              {calculateRiskLevel(assessment.severity, assessment.likelihood)} Risk
            </Badge>
            <span className="text-sm text-muted-foreground">
              Durum: {assessment.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{assessment.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/risk-assessments/${assessment.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Görüntüle
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/risk-assessments/${assessment.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
