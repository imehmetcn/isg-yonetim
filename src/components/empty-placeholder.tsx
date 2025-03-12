import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function EmptyPlaceholder({ className, children, ...props }: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function EmptyPlaceholderIcon({ className, children, ...props }: EmptyPlaceholderIconProps) {
  return (
    <div
      className={cn("flex h-20 w-20 items-center justify-center rounded-full bg-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface EmptyPlaceholderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
}

export function EmptyPlaceholderTitle({
  className,
  children,
  ...props
}: EmptyPlaceholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}

interface EmptyPlaceholderDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
}

export function EmptyPlaceholderDescription({
  className,
  children,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
