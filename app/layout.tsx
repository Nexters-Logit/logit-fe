import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/libs/query-provider";
import { ToastProvider } from "@/libs/toast";
import { MobileAppBanner } from "@/components/common/MobileAppBanner";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Logit",
  description: "경험을 기록하고, 자기소개서를 쉽게 작성하세요",
  keywords: ["자기소개서", "자소서", "이력서", "취업", "경험 정리"],
  authors: [{ name: "Logit Team" }],
  openGraph: {
    title: "Logit - 자기소개서 작성 도우미",
    description: "경험을 기록하고, 자기소개서를 쉽게 작성하세요",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 628,
        alt: "Logit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logit - 자기소개서 작성 도우미",
    description: "경험을 기록하고, 자기소개서를 쉽게 작성하세요",
    images: ["/logos/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} antialiased`}>
        <QueryProvider>
          {children}
          <MobileAppBanner />
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
