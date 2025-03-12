"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const formSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().optional(),
  department: z.string().min(1, "Departman zorunludur"),
  date: z.coerce.date({
    required_error: "Değerlendirme tarihi zorunludur",
  }),
  nextAssessmentDate: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "OVERDUE"], {
    required_error: "Durum zorunludur",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  description: "",
  status: "DRAFT",
};

export function RiskAssessmentForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch("/api/risk-assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Bir hata oluştu");
      }

      toast({
        title: "Risk değerlendirmesi oluşturuldu",
        description: "Risk değerlendirmesi başarıyla oluşturuldu.",
      });

      router.push("/risk-assessments");
      router.refresh();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Risk değerlendirmesi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Input
        placeholder="Risk değerlendirmesi başlığı"
        {...form.register("title")}
      />

      <Textarea
        placeholder="Risk değerlendirmesi açıklaması"
        {...form.register("description")}
      />

      <Select {...form.register("department")}>
        <SelectTrigger>
          <SelectValue placeholder="Departman seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="URETIM">Üretim</SelectItem>
          <SelectItem value="KALITE">Kalite</SelectItem>
          <SelectItem value="BAKIM">Bakım</SelectItem>
          <SelectItem value="LOJISTIK">Lojistik</SelectItem>
          <SelectItem value="IDARI">İdari</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Değerlendirme Tarihi
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={!form.watch("date") ? "text-muted-foreground" : ""}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("date") ? (
                format(form.watch("date"), "PPP", { locale: tr })
              ) : (
                <span>Tarih seçin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.watch("date")}
              onSelect={(date) => {
                if (date) {
                  form.setValue("date", date);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Sonraki Değerlendirme Tarihi
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={!form.watch("nextAssessmentDate") ? "text-muted-foreground" : ""}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("nextAssessmentDate") && (
                format(form.watch("nextAssessmentDate") as Date, "PPP", { locale: tr })
              ) || (
                <span>Tarih seçin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.watch("nextAssessmentDate")}
              onSelect={(date) => {
                if (date) {
                  form.setValue("nextAssessmentDate", date);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Select {...form.register("status")}>
        <SelectTrigger>
          <SelectValue placeholder="Durum seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DRAFT">Taslak</SelectItem>
          <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
          <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
          <SelectItem value="OVERDUE">Gecikmiş</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit">Oluştur</Button>
    </form>
  );
}
