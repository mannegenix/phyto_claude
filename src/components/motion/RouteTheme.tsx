"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ROUTE_THEMES, siteConfig } from "@/config/site";

/** Theme a path should use: its ROUTE_THEMES entry, else the site default. */
const themeFor = (path: string) =>
  Object.entries(ROUTE_THEMES).find(([p]) => path === p || path.startsWith(`${p}/`))?.[1];

/**
 * Inline <head> script: applies a page's own colour route (e.g. the homepage "/" → verdan)
 * before first paint, so a full load never flashes the default route.
 */
export const routeThemeBootScript = `try{var m=${JSON.stringify(ROUTE_THEMES)},p=location.pathname;for(var k in m){if(p===k||p.indexOf(k+"/")===0){document.documentElement.dataset.theme=m[k];document.documentElement.dataset.routeTheme="1"}}}catch(e){}`;

/**
 * Keeps the colour route right on client navigation: entering a page listed in
 * ROUTE_THEMES switches to its route; leaving it restores the site default.
 */
export function RouteTheme() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const own = themeFor(pathname);
    if (own) {
      root.dataset.theme = own;
      root.dataset.routeTheme = "1";
    } else if (root.dataset.routeTheme) {
      root.dataset.theme = siteConfig.defaultTheme;
      delete root.dataset.routeTheme;
    }
  }, [pathname]);
  return null;
}
