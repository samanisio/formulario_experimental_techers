import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-ink text-paper hover:bg-violet hover:shadow-[0_4px_16px_rgba(109,40,217,0.28)] active:scale-[0.98]"
      : "bg-transparent text-ink hover:bg-paper-dim active:scale-[0.98]";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
