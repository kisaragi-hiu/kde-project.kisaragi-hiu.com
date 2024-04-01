deps = built/projects.json

deploy: $(deps)
	bunx wrangler deploy

lint: $(deps)
	bunx @biomejs/biome lint "."

build: $(deps)
	bunx wrangler deploy --outdir built --dry-run

# For a file with the default export in the right shape for Bun.serve, Bun would
# just serve it. The shape that Bun.serve expects is the same as Cloudflare
# Workers, so this works.
#
# wrangler dev hangs on me for some reason, so this is what I have to do.
dev: $(deps)
	bun --hot bun.ts

repo-metadata:
	git clone --depth 1 "https://invent.kde.org/sysadmin/repo-metadata/"

built/projects.json: repo-metadata process-repo-metadata.ts
	@mkdir -p built
	bun process-repo-metadata.ts > built/projects.json
