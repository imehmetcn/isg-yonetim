"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ReactNode } from 'react';

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface DashboardShellProps {
  children: ReactNode;
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
