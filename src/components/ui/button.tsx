import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";
export interface IButton
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof btnStyles> {
	asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButton>(
	({ asChild = false, className, size, variant, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(btnStyles({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

const btnStyles = cva(
	"rounded-md whitespace-nowrap items-center inline-flex justify-center gap-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
	{
		variants: {
			size: {
				icon: "w-9 h-9",
				lg: "rounded-lg py-5 px-5 h-11",
				sm: "text-xs px-3 h-8 rounded-md",
				default: "py-2 px-4 h-9",
			},
			variant: {
				link: "hover:underline text-primary underline-offset-4",
				ghost: "hover:text-accent-foreground hover:bg-accent",
				secondary: "text-[#0663EF] hover:border bg-[#0663EF14]",
				outline:
					"hover:text-accent-foreground hover:bg-accent border-input border bg-background",
				destructive:
					"hover:bg-destructive/90 bg-destructive text-destructive-foreground",
				default:
					"hover:bg-[#0663EF]/80 border-input text-white bg-[#0663EF] border-transparent",
			},
		},
		defaultVariants: {
			size: "default",
			variant: "default",
		},
	}
);

export { Button, btnStyles };
