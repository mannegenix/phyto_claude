// OpenNext adapter config for Cloudflare Workers.
// R2 stores the Next.js incremental cache (rendered pages, route data, future ISR/revalidation).
// The bucket is bound in wrangler.jsonc. Create it once before the first deploy:
//   npx wrangler r2 bucket create phyto-elements-opennext-cache
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  enableCacheInterception: true,
});
