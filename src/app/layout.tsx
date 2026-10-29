import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PanelScroll } from "@/components/motion/PanelScroll";
import { themeBootScript } from "@/components/dev/theme-boot";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Preloader, preloaderBootScript } from "@/components/motion/Preloader";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Bulk Plant Extracts for Global Markets`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: { siteName: siteConfig.name, type: "website", locale: "en_IN" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme={siteConfig.defaultTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderBootScript }} />
        {siteConfig.showThemeSwitcher && <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />}
      </head>
      <body>
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-brand focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <PanelScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {siteConfig.chatEnabled && <ChatWidget />}
      </body>
    </html>
  );
}
