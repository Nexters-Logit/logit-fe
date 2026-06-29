import { EndedStamp } from "./EndedStamp";

interface EventSectionProps {
  index: number;
  isEnded: boolean;
  bg: string;
  dark?: boolean;
  children: React.ReactNode;
}

export function EventSection({ index, isEnded, bg, dark = false, children }: EventSectionProps) {
  const textMuted = dark ? "text-white/50" : "text-primary-200/60";
  const badgeClass = dark
    ? "border border-white/30 text-white/70"
    : "border border-primary-200/30 text-primary-200";

  return (
    <section className={`w-full relative overflow-hidden ${bg}`}>
      <div className={`max-w-160 mx-auto px-6 py-20 flex flex-col items-center text-center gap-8 ${isEnded ? "opacity-30 pointer-events-none select-none" : ""}`}>
        <span className={`text-body-8-1 tracking-[0.15em] uppercase px-4 py-1.5 rounded-full ${badgeClass}`}>
          EVENT {String(index).padStart(2, "0")}
        </span>
        {children}
      </div>
      {isEnded && <EndedStamp />}
    </section>
  );
}
