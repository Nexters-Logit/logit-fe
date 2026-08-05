const DEFAULT_COLORS = ["#40a5ff", "#2571eb", "#c3dcff", "#fcd34d", "#f59e0b", "#ffffff"];

export function burstConfetti(colors: string[] = DEFAULT_COLORS) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.38;
  Array.from({ length: 32 }).forEach(() => {
    const el = document.createElement("span");
    const size = Math.random() * 7 + 4;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 180 + 90;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 230;
    const duration = Math.random() * 500 + 450;
    const rot = Math.random() * 720 - 360;
    Object.assign(el.style, {
      position: "fixed", pointerEvents: "none", zIndex: "9999",
      width: `${size}px`, height: `${size}px`,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      left: `${cx}px`, top: `${cy}px`,
    });
    document.body.appendChild(el);
    let t0 = 0;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const t = Math.min((ts - t0) / duration, 1);
      el.style.transform = `translate(${vx * t}px, ${vy * t + 300 * t * t}px) rotate(${rot * t}deg)`;
      el.style.opacity = String(1 - t * t);
      if (t < 1) requestAnimationFrame(step);
      else el.remove();
    };
    requestAnimationFrame(step);
  });
}
