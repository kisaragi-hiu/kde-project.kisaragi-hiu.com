# kde-project.kisaragi-hiu.com

A redirection service from a KDE project ID to KDE Invent. Probably most useful for KDE translators, who sees the project IDs the most (I think).

- https://kde-project.kisaragi-hiu.com/websites-hugo-kde redirects to https://invent.kde.org/websites/hugo-kde
- https://kde-project.kisaragi-hiu.com/krita/-/blob/master/.kde-ci.yml redirects to https://invent.kde.org/graphics/krita/-/blob/master/.kde-ci.yml

This is IMO the one thing missing from projects.kde.org/api.

Runs on Cloudflare Workers because it's so easy to deploy.

[Wrangler bundles code for us using esbuild](https://developers.cloudflare.com/workers/wrangler/bundling/), so we don't need to worry about bundling ourselves.

- Entry point: index.ts
- Dev mode entry point: bun.ts (using Bun.serve as my development mode)
