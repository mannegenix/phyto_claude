// OpenNext adapter config for Cloudflare Workers.
// Every page is prerendered at build time and nothing revalidates, so the Next.js
// incremental cache is served read-only from Workers static assets (the ASSETS
// binding in wrangler.jsonc). No R2 bucket is needed. If ISR/revalidation is added
// later, switch to the R2 cache (overrides/incremental-cache/r2-incremental-cache)
// and add an r2_buckets binding.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
