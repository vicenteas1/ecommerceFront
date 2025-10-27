import type { MouseEvent, ReactNode } from "react";

export type CardProps = {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  error?: string | null;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  clickable?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
};