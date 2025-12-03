import { cn } from "@/lib/utils";
import { SecondarySpinner } from "../shared/loaders/secondary-loader";

export function SecondaryFullPageLoading() {
	return (
		<div className="size-full min-h-screen py-12 flex flex-col items-center justify-center">
			<SecondarySpinner className="size-10"/>
		</div>
	);
}

export function SecondaryPageLoading({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"size-full w-full py-12 flex flex-col items-center justify-center",
				className,
			)}
		>
			<SecondarySpinner className="size-6" />
		</div>
	);
}
