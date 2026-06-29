import type { Metadata } from "next";
import { AttendanceContent } from "./_components/AttendanceContent";

export const metadata: Metadata = {
  title: "출석 이벤트",
  description: "매일 출석하고 토큰을 받아요.",
};

export default function AttendancePage() {
  return <AttendanceContent />;
}
