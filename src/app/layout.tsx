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
    "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。包含 STM32、ESP32 开发教程，嵌入式工具，项目实战。",
  keywords: [
    "嵌入式系统", "硬件设计", "编程", "STM32", "ESP32", "技术笔记",
    "嵌入式开发", "单片机", "RTOS", "FreeRTOS", "物联网", "IoT",
    "PCB设计", "电路设计", "C语言", "嵌入式C", "固件开发",
  ],
  authors: [{ name: "ls.home", url: siteUrl }],
  creator: "ls.home",
  publisher: "ls.home",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "ls.home",
    title: "ls.home - ls技术知识展示",
    description:
      "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ls.home - ls技术知识展示",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ls.home - ls技术知识展示",
    description:
      "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed`,
    },
  },
  verification: {
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ls.home",
        url: siteUrl,
        description: "ls技术知识展示，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。",
        inLanguage: "zh-CN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/archive?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "ls.home",
        url: siteUrl,
        description: "嵌入式系统、硬件设计与编程技术知识库",
        sameAs: ["https://github.com/RomeGe"],
      },
    ],
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
