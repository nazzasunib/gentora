import { formatBDT, cn } from "@/lib/utils";

export default function Price({ price, compareAt, className, size = "md" }: { price: number; compareAt?: number; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2.5", className)}>
      <span className={cn("font-semibold tabular-nums", size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[15px]")}>{formatBDT(price)}</span>
      {compareAt && compareAt > price && (
        <span className={cn("tabular-nums text-muted line-through", size === "lg" ? "text-base" : "text-xs")}>
          <span className="sr-only">Previously </span>
          {formatBDT(compareAt)}
        </span>
      )}
    </span>
  );
}
