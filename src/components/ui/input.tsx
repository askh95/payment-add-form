import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ type, className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(
					"w-full flex border-input border rounded-md px-3 py-1 h-9 text-sm bg-transparent transition-colors placeholder:text-muted-foreground file:font-medium file:text-sm file:text-foreground file:border-0 file:bg-transparent focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
					className
				)}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export type { InputProps };
export { Input };
