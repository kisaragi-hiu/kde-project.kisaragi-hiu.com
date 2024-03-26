function HTMLResponse(
  body: BodyInit,
  init: ResponseInit = {}, // this default allows the deconstructing bind below
) {
  const { headers, ...rest } = init;
  // merge the headers and other properties separately
  return new Response(body, {
    headers: { "content-type": "text/html;charset=UTF-8", ...headers },
    ...rest,
  });
}

export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([^\/]*)\/?(.*)/);
    // Case 1: Project ID invalid (not provided)
    if (!match || match[0] === "/") {
      const { HomePage } = await import("./pages.tsx");
      return HTMLResponse(HomePage());
    }

    const projectId = match[1].toLowerCase();
    const remainder = match[2];
    // Case 2: Project ID invalid (all other cases)
    if (!projectId.match(/^[a-z0-9-]+$/)) {
      const { InvalidPage } = await import("./pages.tsx");
      return HTMLResponse(InvalidPage(), {
        status: 400,
      });
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
    const { NotFoundPage } = await import("./pages.tsx");
    return HTMLResponse(NotFoundPage(), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
