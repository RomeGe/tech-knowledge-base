import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { Sidebar } from "@/components/sidebar";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import { CommandPalette } from "@/components/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://lslff-embedded-ntc.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "ls.home - ls技术知识展示",
    template: "%s | ls.home",
  },
  description:
    "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
  keywords: ["嵌入式系统", "硬件设计", "编程", "STM32", "ESP32", "技术笔记"],
  authors: [{ name: "ls.home" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "ls.home",
    title: "ls.home - ls技术知识展示",
    description:
      "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
  },
  twitter: {
    card: "summary_large_image",
    title: "ls.home - ls技术知识展示",
    description:
      "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ls.home",
    url: siteUrl,
    description:
      "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
  };

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full flex">
        <ThemeProvider>
          <ReadingProgress />
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <BackToTop />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
