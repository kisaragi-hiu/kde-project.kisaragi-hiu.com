/**
 * "Development mode" entry point.
 */

import handler from "./index";

const { fetch: handlerFetch, ...rest } = handler;
let firstStart = true;

// Bun serves an object with the same shape as Cloudflare Workers.
//
// We add this here to set up hot reloading.
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    // Do it like esbuild does
    if (url.pathname === "/esbuild") {
      const headers = {
        "cache-control": "no-store",
        "content-type": "text/event-stream",
        retry: "500",
      } satisfies HeadersInit;
      if (firstStart) {
        firstStart = false;
        return new Response("event: change\ndata: changed\n\n", {
          headers: headers,
        });
      } else {
        return new Response(":\n\n", {
          headers: headers,
        });
      }
    }
    return handlerFetch(request);
  },
  ...rest,
};
