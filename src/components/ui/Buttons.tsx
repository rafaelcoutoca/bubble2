import * as React from "react";

type Variant =
  | "accentOutline"
  | "blueOutline"
  | "purpleOutline"
  | "accentSolid"
  | "purpleSolid";

type Size = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  leftIcon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2";
const sizes: Record<Size, string> = {
  md: "py-2.5 px-4",
  lg: "py-3 px-6",
};
const variants: Record<Variant, string> = {
  accentOutline:
    "border-2 border-accent-500 text-accent-600 bg-transparent hover:bg-accent-50",
  blueOutline:
    "border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50",
  purpleOutline:
    "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50",
  accentSolid:
    "bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300",
  purpleSolid: "bg-purple-600 text-white hover:bg-purple-700",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "purpleSolid",
  size = "md",
  full,
  leftIcon,
  className = "",
  children,
  ...props
}) => {
  const cls = [
    base,
    sizes[size],
    variants[variant],
    full ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} {...props}>
      {leftIcon ? <span className="mr-2">{leftIcon}</span> : null}
      {children}
    </button>
  );
};
