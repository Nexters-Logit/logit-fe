"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, User, Zap } from "lucide-react";
import { ScrollTracker } from "./_components/ScrollTracker";
import { EndedStamp } from "./_components/EndedStamp";

const EVENT_STATUS = {
  signup: false,
  attendance: false,
  referral: false,
  discount: false,
};

const POOL_TOTAL = 30_000;
const POOL_REMAINING = 24_750;

const EVENT_END = new Date("2026-11-18T23:59:59");

// INTRO 배경 파티클 — 위치/크기/딜레이 고정값
const PARTICLES = [
  { x: 7, y: 14, s: 22, d: 0, t: 3.5, coin: true },
  { x: 88, y: 9, s: 14, d: 0.8, t: 4.2, coin: false },
  { x: 18, y: 72, s: 26, d: 1.5, t: 3.0, coin: false },
  { x: 78, y: 62, s: 16, d: 0.3, t: 5.0, coin: true },
  { x: 91, y: 38, s: 18, d: 2.1, t: 3.8, coin: false },
  { x: 4, y: 52, s: 20, d: 1.0, t: 4.5, coin: true },
  { x: 52, y: 7, s: 12, d: 1.8, t: 3.2, coin: false },
  { x: 62, y: 82, s: 22, d: 0.5, t: 4.8, coin: true },
  { x: 33, y: 88, s: 16, d: 2.5, t: 3.6, coin: false },
  { x: 94, y: 77, s: 14, d: 1.2, t: 5.2, coin: true },
  { x: 14, y: 33, s: 10, d: 0.9, t: 4.0, coin: false },
  { x: 72, y: 22, s: 20, d: 1.7, t: 3.4, coin: true },
] as const;

const CALENDAR_INDICES = Array.from({ length: 35 }, (_, i) => i);

const SECTIONS = [
  { id: "intro", label: "시작", kind: "home" as const },
  { id: "event-01", label: "신규" },
  { id: "event-02", label: "출석" },
  { id: "event-03", label: "초대" },
  { id: "event-04", label: "할인" },
  { id: "notice", label: "유의", kind: "alert" as const },
];

export default function OpenEventPage() {
  const [activeId, setActiveId] = useState("intro");
  const [entered, setEntered] = useState<Set<string>>(new Set(["intro"]));
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tiltRafRef = useRef<number | null>(null);

  // EVENT 01: 단계별 애니메이션
  const [signupPhase, setSignupPhase] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  // EVENT 02: 달력 누적 (Set으로 개별 셀 관리)
  const [checkedDays, setCheckedDays] = useState<Set<number>>(new Set());
  const [calendarAnimating, setCalendarAnimating] = useState(false);

  // D-day 카운트다운
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const e01 = entered.has("event-01");
  const e02 = entered.has("event-02");
  const e03 = entered.has("event-03");
  const e04 = entered.has("event-04");

  // EVENT 01: 첫 진입 시 폭죽
  useEffect(() => {
    if (!e01) return;
    const colors = [
      "#40a5ff",
      "#2571eb",
      "#c3dcff",
      "#fcd34d",
      "#f59e0b",
      "#a78bfa",
      "#ffffff",
    ];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.35;
    Array.from({ length: 48 }).forEach((_, i) => {
      const el = document.createElement("div");
      const size = 5 + Math.random() * 7;
      const angle = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.4;
      const speed = 180 + Math.random() * 220;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};width:${size}px;height:${size}px;background:${color};left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);transition:none;`;
      document.body.appendChild(el);
      const vx = Math.cos(angle) * speed * 0.5;
      let x = 0,
        y = 0,
        vy = -speed * 0.6;
      const gravity = 380;
      let opacity = 1;
      let t = 0;
      const step = () => {
        t += 0.016;
        vy += gravity * 0.016;
        x += vx * 0.016;
        y += vy * 0.016;
        opacity = Math.max(0, 1 - t / 1.2);
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${x * 3}deg)`;
        el.style.opacity = String(opacity);
        if (opacity > 0) requestAnimationFrame(step);
        else el.remove();
      };
      setTimeout(() => requestAnimationFrame(step), i * 12);
    });
  }, [e01]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            setEntered((prev) => {
              if (prev.has(e.target.id)) return prev;
              return new Set([...prev, e.target.id]);
            });
          }
        });
      },
      { threshold: 0.5 },
    );
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // EVENT 01: 가입 보너스 → 월 지급 순서로 채우기
  useEffect(() => {
    if (!e01) {
      setSignupPhase(0);
      setDisplayCount(0);
      return;
    }

    let i1: ReturnType<typeof setInterval>;
    let i2: ReturnType<typeof setInterval>;
    let t2: ReturnType<typeof setTimeout>;

    let t3: ReturnType<typeof setTimeout>;

    const t1 = setTimeout(() => {
      setSignupPhase(1);
      let c = 0;
      i1 = setInterval(() => {
        c = Math.min(c + 2, 50);
        setDisplayCount(c);
        if (c >= 50) {
          clearInterval(i1);
          t2 = setTimeout(() => {
            setSignupPhase(2);
            i2 = setInterval(() => {
              c = Math.min(c + 2, 100);
              setDisplayCount(c);
              if (c >= 100) {
                clearInterval(i2);
                t3 = setTimeout(() => setSignupPhase(3), 500);
              }
            }, 20);
          }, 700);
        }
      }, 20);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2!);
      clearTimeout(t3!);
      clearInterval(i1!);
      clearInterval(i2!);
    };
  }, [e01]);

  // EVENT 02: 달력 날짜 순서대로 동전 채우기
  useEffect(() => {
    if (!e02) {
      setCheckedDays(new Set());
      setCalendarAnimating(false);
      return;
    }

    let interval: ReturnType<typeof setInterval>;
    setCalendarAnimating(true);
    const t = setTimeout(() => {
      let day = 0;
      interval = setInterval(() => {
        const idx = day;
        setCheckedDays((prev) => new Set([...prev, idx]));
        day++;
        if (day >= 22) {
          clearInterval(interval);
          setCalendarAnimating(false);
        }
      }, 70);
    }, 300);

    return () => {
      clearTimeout(t);
      clearInterval(interval!);
      setCalendarAnimating(false);
    };
  }, [e02]);

  const onTiltMove = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      if (!e04) return;
      const el = ev.currentTarget;
      const { left, top, width, height } = el.getBoundingClientRect();
      const clientX = ev.clientX;
      const clientY = ev.clientY;
      if (tiltRafRef.current !== null) cancelAnimationFrame(tiltRafRef.current);
      tiltRafRef.current = requestAnimationFrame(() => {
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        el.style.transition = "opacity 0.6s, background 0.3s";
        el.style.transform = `perspective(700px) rotateY(${x * 13}deg) rotateX(${-y * 10}deg) scale(1.04)`;
        tiltRafRef.current = null;
      });
    },
    [e04],
  );

  const onTiltLeave = useCallback((ev: React.MouseEvent<HTMLDivElement>) => {
    const el = ev.currentTarget;
    el.style.transition =
      "transform 0.45s ease-out, opacity 0.6s, background 0.3s";
    el.style.transform = "none";
  }, []);

  const handleDayClick = useCallback((i: number) => {
    setCheckedDays((prev) => new Set([...prev, i]));
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = EVENT_END.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const navigateTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const ref = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <>
      <ScrollTracker
        sections={SECTIONS}
        activeId={activeId}
        onNavigate={navigateTo}
      />

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {/* ── INTRO ──────────────────────────────── */}
        <section
          id="intro"
          ref={ref("intro")}
          className="snap-start h-screen relative isolate overflow-hidden flex flex-col items-center justify-center text-center gap-8 px-6"
        >
          {/* 애니메이션 그라디언트 배경 */}
          <div className="absolute inset-0 -z-10 animate-gradient-flow" />
          {/* 하단 화이트 페이드 */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-white/50 pointer-events-none" />

          {/* 배경 파티클 */}
          {PARTICLES.map(({ x, y, s, d, t, coin }, i) => (
            <div
              key={i}
              className="absolute -z-10 pointer-events-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `float-up ${t}s ${d}s ease-in-out infinite`,
                opacity: 0.18 + (s / 26) * 0.14,
              }}
            >
              {coin ? (
                <div
                  style={{
                    width: s,
                    height: s,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(145deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)",
                    boxShadow:
                      "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.15), 0 3px 8px rgba(120,53,15,0.3)",
                    border: "1.5px solid rgba(251,191,36,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: "60%",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.35)",
                    }}
                  />
                </div>
              ) : (
                <Zap
                  style={{ width: s, height: s }}
                  className="text-primary-200"
                  strokeWidth={1.5}
                  fill="currentColor"
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Image
              src="/logos/logo-symbol-2d.svg"
              alt="Logit"
              width={32}
              height={32}
            />
            <Image
              src="/logos/logo-wordmark.svg"
              alt="Logit"
              width={64}
              height={32}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-body-7-2 text-primary-200 tracking-badge uppercase">
              Open Event
            </p>
            <h1 className="text-title-1 sm:text-headline-1 text-gray-500">
              로짓 오픈을 기념해
              <br />
              특별한 이벤트를 준비했어요
            </h1>
            <p className="text-body-5-4 text-gray-200">
              신규 가입 · 매일 출석 · 친구 초대 · 요금제 할인
            </p>
          </div>
          {/* D-day 카운트다운 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-body-9-3 text-gray-200/70">
              2026.08.11 ~ 2026.11.18
            </p>
            <p className="text-body-8-1 text-gray-200 tracking-widest">
              이벤트 종료까지
            </p>
            <div className="flex items-end gap-1.5">
              {[
                { v: countdown.days, u: "일" },
                { v: countdown.hours, u: "시간" },
                { v: countdown.minutes, u: "분" },
                { v: countdown.seconds, u: "초" },
              ].map(({ v, u }, idx) => (
                <div key={u} className="flex items-end gap-1.5">
                  {idx > 0 && (
                    <span className="text-body-5-1 text-gray-100 mb-6">:</span>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-card flex items-center justify-center">
                      <span className="text-title-3 text-primary-200 tabular-nums font-bold">
                        {String(v).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-body-9-3 text-gray-200">{u}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("event-01")}
            className="px-8 py-4 rounded-3.5 bg-primary-200 text-white text-body-5-1 hover:bg-primary-300 transition-colors"
          >
            이벤트 보기
          </button>
          <div className="flex flex-col items-center gap-1.5 animate-bounce mt-2">
            <div className="h-5 w-px bg-gray-100" />
            <div className="size-1.5 rounded-full bg-gray-100" />
          </div>
        </section>

        {/* ── EVENT 01: 신규 가입 ─────────────────── */}
        <section
          id="event-01"
          ref={ref("event-01")}
          className="snap-start h-screen relative overflow-hidden bg-primary-60 flex items-center justify-center px-6"
        >
          <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary-200/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-primary-100/15 blur-3xl pointer-events-none" />

          <div
            className={`w-full max-w-96 flex flex-col items-center text-center gap-5 relative ${EVENT_STATUS.signup ? "opacity-25 pointer-events-none select-none" : ""}`}
          >
            <span
              className="text-body-8-1 tracking-badge uppercase px-4 py-1.5 rounded-full border border-primary-200/30 text-primary-200 transition-all duration-700"
              style={{ opacity: e01 ? 1 : 0 }}
            >
              EVENT 01 · 신규 가입
            </span>

            {/* 큰 타이틀 + 혜택 칩 */}
            <div
              className="flex flex-col items-center gap-3 transition-all duration-700 delay-75"
              style={{
                opacity: e01 ? 1 : 0,
                transform: e01 ? "none" : "translateY(14px)",
              }}
            >
              <p className="text-title-1 text-gray-500 font-bold tracking-tight">
                AI 자소서, 무료로 시작
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {[
                  { label: "별도 신청 없음", mobileLabel: null },
                  { label: "가입 즉시 자동 지급", mobileLabel: "자동 지급" },
                  { label: "계정당 1회", mobileLabel: null },
                ].map(({ label, mobileLabel }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-200/15 border border-primary-200/20 text-body-8-1 text-primary-200"
                  >
                    <Check className="size-3 shrink-0" strokeWidth={2.5} />
                    {mobileLabel ? (
                      <>
                        <span className="sm:hidden">{mobileLabel}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </>
                    ) : (
                      label
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* 토큰 잔액 카드 */}
            <div
              className="w-full bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-700 delay-100"
              style={{
                opacity: e01 ? 1 : 0,
                transform: e01 ? "none" : "translateY(20px) scale(0.96)",
              }}
            >
              {/* 잔액 헤더 */}
              <div className="bg-primary-50 px-6 pt-6 pb-4 text-center">
                <p className="text-body-9-1 text-primary-100 mb-2 tracking-wider">
                  내 토큰 잔액
                </p>
                <span className="text-display-1 text-primary-200 tabular-nums animate-blue-glow">
                  {displayCount}
                </span>
              </div>

              {/* 진행 바 — 두 색상 */}
              <div className="relative h-2 bg-primary-50">
                <div
                  className="absolute left-0 top-0 h-full bg-primary-60 rounded-r-full transition-all duration-500"
                  style={{ width: `${Math.min(displayCount, 50)}%` }}
                />
                <div
                  className="absolute top-0 h-full bg-primary-200 rounded-r-full transition-all duration-500"
                  style={{
                    left: "50%",
                    width: `${Math.max(0, displayCount - 50)}%`,
                  }}
                />
              </div>

              {/* 영수증 행 */}
              <div className="px-6 pt-4 pb-2 flex flex-col">
                <div
                  className="flex items-center justify-between py-3 border-b border-primary-50 transition-all duration-500"
                  style={{
                    opacity: signupPhase >= 1 ? 1 : 0,
                    transform: signupPhase >= 1 ? "none" : "translateY(8px)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <Check
                        className="size-3 text-primary-100"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-body-7-3 text-gray-200">
                      가입 보너스
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-title-3 text-primary-100 tabular-nums font-bold animate-blue-glow">
                      +50
                    </span>
                    <span className="text-body-7-2 text-primary-100">토큰</span>
                  </div>
                </div>
                <div
                  className="flex items-center justify-between py-3 border-b border-primary-50 transition-all duration-500"
                  style={{
                    opacity: signupPhase >= 2 ? 1 : 0,
                    transform: signupPhase >= 2 ? "none" : "translateY(8px)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <Check
                        className="size-3 text-primary-100"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-body-7-3 text-gray-200">
                      월 기본 지급
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-title-3 text-primary-200 tabular-nums font-bold animate-blue-glow">
                      +50
                    </span>
                    <span className="text-body-7-2 text-primary-200">토큰</span>
                  </div>
                </div>
                {/* 합계 */}
                <div
                  className="flex items-center justify-between py-3 transition-all duration-700"
                  style={{
                    opacity: signupPhase >= 3 ? 1 : 0,
                    transform: signupPhase >= 3 ? "none" : "translateY(8px)",
                  }}
                >
                  <span className="text-body-6-2 text-gray-300">합계</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-title-2 text-primary-200 tabular-nums font-bold">
                      100
                    </span>
                    <span className="text-body-5-2 text-primary-200">토큰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 설명 */}
            <div
              className="flex flex-col gap-1.5 transition-all duration-700 delay-300"
              style={{ opacity: e01 ? 1 : 0 }}
            >
              <p className="text-body-7-3 text-gray-300">
                별도 신청 없이 가입 즉시 자동 지급돼요
              </p>
              <p className="text-body-7-3 text-gray-200">
                채팅 5토큰 · 초안 생성 10토큰 소모
              </p>
            </div>
          </div>
          {EVENT_STATUS.signup && <EndedStamp />}
        </section>

        {/* ── EVENT 02: 출석 이벤트 ──────────────── */}
        <section
          id="event-02"
          ref={ref("event-02")}
          className="snap-start h-screen relative overflow-hidden bg-primary-200 flex items-center justify-center px-6"
        >
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

          <div
            className={`w-full max-w-96 flex flex-col items-center text-center gap-5 relative ${EVENT_STATUS.attendance ? "opacity-25 pointer-events-none select-none" : ""}`}
          >
            <span className="text-body-8-1 tracking-badge uppercase px-4 py-1.5 rounded-full border border-white/20 text-white/60">
              EVENT 02 · 출석
            </span>

            {/* 하루 지급 — 핵심 강조 */}
            <div
              className="flex flex-col items-center gap-1 transition-all duration-700 delay-100"
              style={{
                opacity: e02 ? 1 : 0,
                transform: e02 ? "none" : "scale(0.7)",
              }}
            >
              <p className="text-body-8-1 text-white/40 tracking-widest uppercase">
                하루 출석 보상
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-display-1 text-white tabular-nums animate-white-glow">
                  +3
                </span>
                <span className="text-title-2 text-white font-bold">토큰</span>
              </div>
            </div>

            {/* 누적 현황 + 개근 최대 혜택 — 한 줄 */}
            <div
              className="w-full flex items-center justify-between transition-all duration-700 delay-200"
              style={{ opacity: e02 ? 1 : 0 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <span className="text-body-5-1 text-white tabular-nums">
                  {checkedDays.size * 3} 토큰
                </span>
                <div className="w-px h-3.5 bg-white/20" />
                <span className="text-body-7-3 text-white/50">
                  {checkedDays.size}일 누적
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-body-8-3 text-white/40">
                  개근 시 최대
                </span>
                <span className="text-body-7-1 text-white">90토큰</span>
              </div>
            </div>

            {/* 달력 그리드 — 5×7 */}
            <div
              className="w-full grid grid-cols-7 gap-1.5 transition-all duration-700 delay-200"
              style={{ opacity: e02 ? 1 : 0 }}
            >
              {CALENDAR_INDICES.map((i) => {
                const isValidDay = i < 30;
                const isChecked = checkedDays.has(i);
                const isClickable =
                  isValidDay && !isChecked && !calendarAnimating;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => handleDayClick(i)}
                    className={[
                      "aspect-square rounded-lg flex items-center justify-center transition-all duration-200 group",
                      isChecked
                        ? "overflow-hidden"
                        : isValidDay
                          ? "bg-white/10"
                          : "bg-white/5 scale-90",
                      isClickable
                        ? "hover:bg-white/25 active:scale-90 cursor-pointer"
                        : isChecked
                          ? ""
                          : "scale-90",
                    ].join(" ")}
                    style={
                      isChecked
                        ? { background: "rgba(255, 247, 230, 0.95)" }
                        : {}
                    }
                  >
                    {isChecked ? (
                      <div
                        className="animate-coin-drop"
                        style={{
                          width: "72%",
                          aspectRatio: "1",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(145deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)",
                          boxShadow:
                            "inset 0 1.5px 2px rgba(255,255,255,0.55), 0 2px 4px rgba(120,53,15,0.3)",
                          border: "1px solid rgba(251,191,36,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 900,
                            color: "#78350f",
                            lineHeight: 1,
                            letterSpacing: "-0.3px",
                          }}
                        >
                          +3
                        </span>
                      </div>
                    ) : isClickable ? (
                      <div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        style={{
                          width: "68%",
                          aspectRatio: "1",
                          borderRadius: "50%",
                          border: "1.5px dashed rgba(252,211,77,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 900,
                            color: "rgba(252,211,77,0.6)",
                            lineHeight: 1,
                          }}
                        >
                          +3
                        </span>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* CTA + 풀 소진률 */}
            <div
              className="w-full flex flex-col gap-3 transition-all duration-700 delay-500"
              style={{ opacity: e02 ? 1 : 0 }}
            >
              {/* 이벤트 풀 소진률 */}
              <div className="w-full flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-body-8-2 text-white/40">
                    이벤트 풀 소진
                  </span>
                  <span className="text-body-8-1 text-white/70">
                    {POOL_REMAINING.toLocaleString()} /{" "}
                    {POOL_TOTAL.toLocaleString()} 남음
                  </span>
                </div>
                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-white/50 to-white/90 rounded-full"
                    style={{
                      width: `${Math.round(((POOL_TOTAL - POOL_REMAINING) / POOL_TOTAL) * 100)}%`,
                      transition: "width 1.2s ease-out 0.5s",
                    }}
                  />
                </div>
                <p className="text-body-9-3 text-white/30 text-right">
                  {Math.round(
                    ((POOL_TOTAL - POOL_REMAINING) / POOL_TOTAL) * 100,
                  )}
                  % 소진됐어요
                </p>
              </div>
              <div className="mt-1 w-full text-center py-4 rounded-3.5 bg-white/10 text-white/70 text-body-6-1">
                자동으로 출석돼요!
              </div>
            </div>
          </div>
          {EVENT_STATUS.attendance && <EndedStamp />}
        </section>

        {/* ── EVENT 03: 친구 초대 ────────────────── */}
        <section
          id="event-03"
          ref={ref("event-03")}
          className="snap-start h-screen relative overflow-hidden bg-gray-500 flex items-center justify-center px-6"
        >
          <div className="absolute inset-0 bg-radial-blue-center pointer-events-none" />

          <div
            className={`w-full max-w-120 flex flex-col items-center text-center gap-8 relative ${EVENT_STATUS.referral ? "opacity-25 pointer-events-none select-none" : ""}`}
          >
            <span className="text-body-8-1 tracking-badge uppercase px-4 py-1.5 rounded-full border border-white/20 text-white/60">
              EVENT 03 · 친구 초대
            </span>

            {/* 10 토큰씩 — 트랙 위, EVENT-01 타이틀과 같은 위치 */}
            <div
              className="flex flex-col items-center gap-3 transition-all duration-700 delay-75"
              style={{
                opacity: e03 ? 1 : 0,
                transform: e03 ? "scale(1)" : "scale(0.7)",
              }}
            >
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-display-2 text-white animate-white-glow">
                  10
                </span>
                <span className="text-title-2 text-white/80 font-bold">
                  토큰씩
                </span>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {["둘 다 지급", "즉시 자동 지급", "인원 무제한"].map((text) => (
                  <span
                    key={text}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/8 border border-white/12 text-body-8-1 text-white/65"
                  >
                    <Check
                      className="size-3 shrink-0 text-primary-100"
                      strokeWidth={2.5}
                    />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-6 w-full max-w-96">
              {/* 나 아바타 */}
              <div
                className="flex flex-col items-center gap-3 flex-1 relative transition-all duration-700 delay-200"
                style={{
                  opacity: e03 ? 1 : 0,
                  transform: e03 ? "none" : "translateX(-40px)",
                }}
              >
                <span
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-body-6-1 text-primary-100 font-bold"
                  style={{
                    animation: e03
                      ? "seq-token-left 4s ease-out infinite"
                      : "none",
                  }}
                >
                  +10
                </span>
                <div
                  className="size-16 rounded-full bg-primary-200/20 border border-primary-200/40 flex items-center justify-center"
                  style={{
                    animation: e03
                      ? "seq-glow-phase2 4s ease-out infinite"
                      : "none",
                  }}
                >
                  <User className="size-7 text-primary-100" />
                </div>
                <span className="text-body-7-2 text-white/60">나</span>
              </div>

              {/* 트랙 2개 — 아바타 원 중심(32px)에 맞춰 mt-5 오프셋 */}
              <div className="flex-1 flex flex-col gap-8 mt-5">
                {/* 트랙 1: 나 → 친구 */}
                <div className="flex items-center">
                  <div
                    className="relative flex-1 overflow-hidden"
                    style={{ height: 12 }}
                  >
                    {/* 베이스 트랙 */}
                    <div
                      className="absolute left-0 right-0 bg-white/15"
                      style={{
                        top: "50%",
                        height: 2,
                        transform: "translateY(-50%)",
                      }}
                    />
                    {/* 공통 wrapper — 글로우+빔이 같은 부모를 공유해 항상 동기화 */}
                    <div
                      className="absolute"
                      style={{
                        top: 0,
                        height: "100%",
                        width: "100%",
                        animation: e03
                          ? "seq-beam-right 4s cubic-bezier(0.4,0,0.55,1) infinite"
                          : "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "100%",
                          height: 12,
                          background:
                            "radial-gradient(ellipse at 95% 50%, rgba(64,165,255,0.7) 0%, rgba(64,165,255,0.2) 22%, transparent 48%)",
                          filter: "blur(3px)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "100%",
                          height: 2,
                          background:
                            "linear-gradient(to right, transparent 0%, rgba(64,165,255,0.1) 15%, rgba(64,165,255,0.7) 52%, rgba(64,165,255,1) 78%, rgba(255,255,255,1) 93%, transparent 100%)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: "6px solid rgba(255,255,255,0.28)",
                      flexShrink: 0,
                      animation: e03
                        ? "arrow-glow-right 4s ease-in-out infinite"
                        : "none",
                    }}
                  />
                </div>

                {/* 트랙 2: 친구 → 나 */}
                <div className="flex items-center">
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderRight: "6px solid rgba(255,255,255,0.28)",
                      flexShrink: 0,
                      animation: e03
                        ? "arrow-glow-left 4s ease-in-out infinite"
                        : "none",
                    }}
                  />
                  <div
                    className="relative flex-1 overflow-hidden"
                    style={{ height: 12 }}
                  >
                    <div
                      className="absolute left-0 right-0 bg-white/15"
                      style={{
                        top: "50%",
                        height: 2,
                        transform: "translateY(-50%)",
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: 0,
                        height: "100%",
                        width: "100%",
                        animation: e03
                          ? "seq-beam-left 4s cubic-bezier(0.4,0,0.55,1) infinite"
                          : "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "100%",
                          height: 12,
                          background:
                            "radial-gradient(ellipse at 5% 50%, rgba(64,165,255,0.7) 0%, rgba(64,165,255,0.2) 22%, transparent 48%)",
                          filter: "blur(3px)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "100%",
                          height: 2,
                          background:
                            "linear-gradient(to left, transparent 0%, rgba(64,165,255,0.1) 15%, rgba(64,165,255,0.7) 52%, rgba(64,165,255,1) 78%, rgba(255,255,255,1) 93%, transparent 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 친구 아바타 */}
              <div
                className="flex flex-col items-center gap-3 flex-1 relative transition-all duration-700 delay-200"
                style={{
                  opacity: e03 ? 1 : 0,
                  transform: e03 ? "none" : "translateX(40px)",
                }}
              >
                <span
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-body-6-1 text-primary-100 font-bold"
                  style={{
                    animation: e03
                      ? "seq-token-right 4s ease-out infinite"
                      : "none",
                  }}
                >
                  +10
                </span>
                <div
                  className="size-16 rounded-full bg-white/8 border border-white/15 flex items-center justify-center"
                  style={{
                    animation: e03
                      ? "seq-glow-phase1 4s ease-out infinite"
                      : "none",
                  }}
                >
                  <User className="size-7 text-white/40" />
                </div>
                <span className="text-body-7-2 text-white/60">친구</span>
              </div>
            </div>

            <div
              className="w-full max-w-96 transition-all duration-700 delay-900"
              style={{
                opacity: e03 ? 1 : 0,
                transform: e03 ? "none" : "translateY(12px)",
              }}
            >
              <Link
                href="/event/referral"
                className="w-full block text-center py-4 rounded-3.5 bg-white text-gray-500 text-body-6-1 hover:bg-gray-50 transition-colors"
              >
                초대 코드 확인하기
              </Link>
            </div>
          </div>
          {EVENT_STATUS.referral && <EndedStamp />}
        </section>

        {/* ── EVENT 04: 요금제 할인 ──────────────── */}
        <section
          id="event-04"
          ref={ref("event-04")}
          className="snap-start h-screen relative overflow-hidden bg-primary-600 flex items-center justify-center px-6"
        >
          <div className="absolute inset-0 bg-radial-blue-top pointer-events-none" />

          <div
            className={`w-full max-w-160 flex flex-col items-center text-center gap-6 relative ${EVENT_STATUS.discount ? "opacity-25 pointer-events-none select-none" : ""}`}
          >
            <span className="text-body-8-1 tracking-badge uppercase px-4 py-1.5 rounded-full border border-white/20 text-white/60">
              EVENT 04 · 요금제 할인
            </span>
            <div
              className="flex flex-col gap-2 transition-all duration-700 delay-100"
              style={{
                opacity: e04 ? 1 : 0,
                transform: e04 ? "none" : "translateY(16px)",
              }}
            >
              <h2 className="text-headline-1 text-white">오픈 기념 특가</h2>
              <p className="text-body-5-4 text-white/50">이벤트 기간 한정</p>
            </div>

            {/* 카드 행 — 모바일: Light+Pro 위 / MCP 아래, 데스크탑: 1줄 */}
            <div className="w-full flex flex-wrap sm:flex-nowrap gap-3 items-stretch">
              {/* MCP — 모바일 order-3(아래), 데스크탑 order-1(왼쪽) */}
              <div
                className="order-3 sm:order-1 w-full sm:w-auto sm:flex-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onMouseMove={onTiltMove}
                onMouseLeave={onTiltLeave}
                style={{
                  opacity: e04 ? 1 : 0,
                  transform: e04 ? "none" : "translateY(32px) scale(0.95)",
                  transition:
                    "opacity 0.6s 0.2s, transform 0.6s 0.2s, background 0.3s",
                  willChange: "transform",
                }}
              >
                <span className="text-body-9-1 text-white/40 tracking-wider">
                  MCP
                </span>
                <div className="flex flex-col gap-1">
                  <div className="relative self-start">
                    <span className="text-body-8-2 text-white/40">2,990원</span>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        height: 1,
                        width: "100%",
                        background: "rgba(255,255,255,0.5)",
                        transformOrigin: "left center",
                        transform: e04
                          ? "translateY(-50%) scaleX(1)"
                          : "translateY(-50%) scaleX(0)",
                        transition: e04
                          ? "transform 0.35s ease-out 1.0s"
                          : "none",
                      }}
                    />
                  </div>
                  <div
                    className="flex items-baseline gap-1"
                    style={{
                      opacity: e04 ? 1 : 0,
                      transform: e04 ? "none" : "translateY(6px)",
                      transition: e04
                        ? "opacity 0.4s 1.5s, transform 0.4s 1.5s"
                        : "none",
                    }}
                  >
                    <span className="text-title-2-2 text-white font-bold">
                      1,000원
                    </span>
                    <span className="text-body-9-3 text-white/40">/월</span>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex flex-col gap-1.5 text-left">
                  <p className="text-body-8-2 text-white/50 sm:hidden">
                    AI 어시스턴트
                  </p>
                  <div className="hidden sm:flex flex-col gap-1.5">
                    <p className="text-body-8-2 text-white/50">
                      AI 어시스턴트 연동
                    </p>
                    <p className="text-body-8-2 text-white/50">MCP 서버 이용</p>
                  </div>
                </div>
              </div>

              {/* 구분선 — 데스크탑에서만 표시 */}
              <div
                className="hidden sm:block sm:order-2 w-px shrink-0 bg-white/15 rounded-full my-2 transition-all duration-700 delay-300"
                style={{ opacity: e04 ? 1 : 0 }}
              />

              {/* Light — 모바일 order-1(위 왼쪽), 데스크탑 order-3 */}
              <div
                className="order-1 sm:order-3 flex-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border-2 border-primary-100 bg-white/10 relative hover:bg-white/15 transition-colors cursor-pointer"
                onMouseMove={onTiltMove}
                onMouseLeave={onTiltLeave}
                style={{
                  opacity: e04 ? 1 : 0,
                  transform: e04 ? "none" : "translateY(32px) scale(0.95)",
                  transition:
                    "opacity 0.6s 0.35s, transform 0.6s 0.35s, background 0.3s",
                  willChange: "transform",
                }}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-100 text-white text-body-9-1 whitespace-nowrap">
                  인기
                </div>
                <span className="text-body-9-1 text-primary-70 tracking-wider">
                  Light
                </span>
                <div className="flex flex-col gap-1">
                  <div className="relative self-start">
                    <span className="text-body-8-2 text-white/40">9,900원</span>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        height: 1,
                        width: "100%",
                        background: "rgba(255,255,255,0.5)",
                        transformOrigin: "left center",
                        transform: e04
                          ? "translateY(-50%) scaleX(1)"
                          : "translateY(-50%) scaleX(0)",
                        transition: e04
                          ? "transform 0.35s ease-out 1.15s"
                          : "none",
                      }}
                    />
                  </div>
                  <div
                    className="flex items-baseline gap-1"
                    style={{
                      opacity: e04 ? 1 : 0,
                      transform: e04 ? "none" : "translateY(6px)",
                      transition: e04
                        ? "opacity 0.4s 1.65s, transform 0.4s 1.65s"
                        : "none",
                    }}
                  >
                    <span className="text-title-2-2 text-white font-bold">
                      6,900원
                    </span>
                    <span className="text-body-9-3 text-white/40">/월</span>
                  </div>
                </div>
                <div className="h-px bg-white/15" />
                <div className="flex flex-col gap-1.5 text-left">
                  <p className="text-body-8-1 text-primary-70 font-semibold">
                    월 400토큰
                  </p>
                  <div className="hidden sm:flex flex-col gap-1">
                    <p className="text-body-8-2 text-white/50">
                      채팅 80회 상당
                    </p>
                    <p className="text-body-8-2 text-white/50">
                      초안 40회 상당
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro — 모바일 order-2(위 오른쪽), 데스크탑 order-4 */}
              <div
                className="order-2 sm:order-4 flex-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onMouseMove={onTiltMove}
                onMouseLeave={onTiltLeave}
                style={{
                  opacity: e04 ? 1 : 0,
                  transform: e04 ? "none" : "translateY(32px) scale(0.95)",
                  transition:
                    "opacity 0.6s 0.5s, transform 0.6s 0.5s, background 0.3s",
                  willChange: "transform",
                }}
              >
                <span className="text-body-9-1 text-white/40 tracking-wider">
                  Pro
                </span>
                <div className="flex flex-col gap-1">
                  <div className="relative self-start">
                    <span className="text-body-8-2 text-white/40">
                      19,900원
                    </span>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        height: 1,
                        width: "100%",
                        background: "rgba(255,255,255,0.5)",
                        transformOrigin: "left center",
                        transform: e04
                          ? "translateY(-50%) scaleX(1)"
                          : "translateY(-50%) scaleX(0)",
                        transition: e04
                          ? "transform 0.35s ease-out 1.3s"
                          : "none",
                      }}
                    />
                  </div>
                  <div
                    className="flex items-baseline gap-1"
                    style={{
                      opacity: e04 ? 1 : 0,
                      transform: e04 ? "none" : "translateY(6px)",
                      transition: e04
                        ? "opacity 0.4s 1.8s, transform 0.4s 1.8s"
                        : "none",
                    }}
                  >
                    <span className="text-title-2-2 text-white font-bold">
                      14,900원
                    </span>
                    <span className="text-body-9-3 text-white/40">/월</span>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex flex-col gap-1.5 text-left">
                  <p className="text-body-8-1 text-white/80 font-semibold">
                    월 2,000토큰
                  </p>
                  <div className="hidden sm:flex flex-col gap-1">
                    <p className="text-body-8-2 text-white/50">
                      채팅 400회 상당
                    </p>
                    <p className="text-body-8-2 text-white/50">
                      초안 200회 상당
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="w-full mt-6 transition-all duration-700 delay-700"
              style={{
                opacity: e04 ? 1 : 0,
                transform: e04 ? "none" : "translateY(12px)",
              }}
            >
              <Link
                href="/profile/plans"
                className="w-full block text-center py-4 rounded-3.5 bg-primary-100 text-white text-body-6-1 hover:bg-primary-300 transition-colors"
              >
                구독 시작하기
              </Link>
            </div>
          </div>
          {EVENT_STATUS.discount && <EndedStamp />}
        </section>

        {/* ── 유의사항 ───────────────────────────── */}
        <section
          id="notice"
          ref={ref("notice")}
          className="snap-start sm:snap-none h-screen sm:h-auto bg-gray-500 flex items-center justify-center px-6 sm:py-20"
        >
          <div className="w-full max-w-120 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-body-8-1 tracking-badge uppercase text-white/30">
                Notice
              </span>
              <h2 className="text-title-2-2 text-white/80">유의사항</h2>
            </div>

            <div className="flex flex-col gap-4">
              {[
                "이벤트는 사전 고지 없이 변경되거나 조기 종료될 수 있습니다.",
                "각 이벤트의 지급 조건을 충족해야 토큰이 지급됩니다.",
                "월 토큰은 매월 결제 주기 시작일 기준으로 지급되며, 미사용 토큰은 이월되지 않습니다.",
                "출석 이벤트 풀(30,000토큰)이 소진되면 이벤트가 자동 마감됩니다.",
                "신규 가입 보너스는 계정당 1회만 지급됩니다.",
                "친구 초대 보너스는 초대받은 친구의 신규 가입 완료 후 지급됩니다.",
                "부정 이용이 확인된 경우 사전 통보 없이 지급된 토큰이 회수될 수 있습니다.",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 mt-2 size-1 rounded-full bg-white/20" />
                  <p className="text-body-7-3 text-white/40 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 opacity-40">
                <Image
                  src="/logos/logo-symbol-2d.svg"
                  alt="Logit"
                  width={16}
                  height={16}
                />
                <span className="text-body-8-2 text-white">Logit</span>
              </div>
              <a
                href="https://pf.kakao.com/_eGnxnX/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-7-3 text-white/30 underline hover:text-white/60 transition-colors"
              >
                문의하기
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
