import { RevealText } from "./Reveal";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = true,
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-12 flex flex-col gap-6 md:mb-16", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <Reveal y={12}>
            <p className={cn("eyebrow mb-5", !dark && "text-bronze")}>{eyebrow}</p>
          </Reveal>
        )}
        <h2 className={cn("h-display text-4xl sm:text-5xl lg:text-6xl", dark ? "text-white" : "text-deep")}>
          <RevealText text={title} />
        </h2>
        {intro && (
          <Reveal delay={0.15} y={16}>
            <p className={cn("mt-5 max-w-xl text-[15px] leading-relaxed", dark ? "text-muted" : "text-deep/65", align === "center" && "mx-auto")}>{intro}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2} y={12}>{action}</Reveal>}
    </div>
  );
}
