deploy:
	bunx wrangler deploy

build:
	bunx wrangler deploy --outdir built --dry-run

dev:
	bunx wrangler dev
