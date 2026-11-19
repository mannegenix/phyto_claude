import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileDock } from "@/components/layout/MobileDock";
import { RailDots } from "@/components/ui/RailDots";
import { getCompany, getProducts } from "@/lib/content";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PanelScroll } from "@/components/motion/PanelScroll";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { themeBootScript } from "@/components/dev/theme-boot";
import { RouteTheme, routeThemeBootScript } from "@/components/motion/RouteTheme";
import { motionBootScript } from "@/lib/motion-pref";
import { skinBootScript } from "@/lib/skin-pref";
import { heroBootScript } from "@/lib/hero-pref";
import { fxBootScript } from "@/lib/fx-guard";
import { FxGuard } from "@/components/motion/FxGuard";
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
  robots: siteConfig.indexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { mailboxes } = await getCompany();
  const dockProducts = (await getProducts()).map(({ slug, short, image }) => ({ slug, short, image }));
  return (
    <html lang="en" data-theme={siteConfig.defaultTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: routeThemeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: skinBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: heroBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: fxBootScript }} />
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
        <RouteTheme />
        <SmoothScroll />
        <PanelScroll />
        <RouteTransition />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FxGuard />
        <RailDots />
        <MobileDock products={dockProducts} email={mailboxes[0].address} />
        {siteConfig.chatEnabled && <ChatWidget />}
      </body>
    </html>
  );
}
