export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([^\/]*)\/?(.*)/);
    // Case 1: Project ID invalid (not provided)
    if (!match || match[0] === "/") {
      return Response.redirect(
        "https://github.com/kisaragi-hiu/kde-project.kisaragi-hiu.com",
        307,
      );
    }

    const projectId = match[1].toLowerCase();
    const remainder = match[2];
    // Case 2: Project ID invalid (all other cases)
    if (!projectId.match(/^[a-z0-9-]+$/)) {
      const { test } = await import("./pages.tsx");
      return new Response(`Invalid project ID; ${test()}`, { status: 400 });
    }

    const response = await fetch(
      `https://projects.kde.org/api/v1/identifier/${projectId}`,
    );
    const repo = ((await response.json()) as { repo?: string })?.repo;
    // Case 3: Project ID valid and found
    if (typeof repo === "string") {
      const newUrl =
        `https://invent.kde.org/${repo}/${remainder}` + url.search + url.hash;
      return Response.redirect(newUrl, 307);
    }

    // Case 4: Project ID valid but not found
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler;
