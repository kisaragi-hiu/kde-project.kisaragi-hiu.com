deploy:
	bunx wrangler deploy

build:
	bunx wrangler deploy --outdir built --dry-run

# For a file with the default export in the right shape for Bun.serve, Bun would
# just serve it. The shape that Bun.serve expects is the same as Cloudflare
# Workers, so this works.
#
# wrangler dev hangs on me for some reason, so this is what I have to do.
dev:
	bun --hot bun.ts
