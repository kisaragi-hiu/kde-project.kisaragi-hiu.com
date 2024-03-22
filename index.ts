export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([^\/]*)\/?(.*)/);
    if (!match) {
      return new Response("No path is specified", { status: 400 });
    }

    const projectId = match[1].toLowerCase();
    const remainder = match[2];
    if (!projectId.match(/^[a-z0-9-]+$/)) {
      return new Response("Invalid project ID", { status: 400 });
    }

    const response = await fetch(
      `https://projects.kde.org/api/v1/identifier/${projectId}`,
    );
    const repo = ((await response.json()) as { repo?: string })?.repo;
    if (typeof repo === "string") {
      const newUrl =
        `https://invent.kde.org/${repo}/${remainder}` + url.search + url.hash;
      return Response.redirect(newUrl, 307);
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler;
