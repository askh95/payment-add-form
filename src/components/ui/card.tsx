import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/utils";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("pt-0 p-6", className)} {...props} />
	)
);
CardContent.displayName = "CardContent";

const CardDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardTitle = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("tracking-tight leading-none font-semibold", className)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("pt-0 p-6 flex items-center", className)}
			{...props}
		/>
	)
);
CardFooter.displayName = "CardFooter";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("p-6 flex flex-col space-y-1.5", className)}
			{...props}
		/>
	)
);
CardHeader.displayName = "CardHeader";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"bg-card border rounded-xl text-card-foreground",
				className
			)}
			{...props}
		/>
	)
);
Card.displayName = "Card";

export {
	CardContent,
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardFooter,
};
