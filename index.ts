import * as Pages from "./pages";
import { HTMLResponse } from "./helpers";
import { idToRepo } from "./built/projects.json";

export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([^\/]*)\/?(.*)/);
    // Case 1: Project ID invalid (not provided)
    if (!match || match[0] === "/") {
      return HTMLResponse(await Pages.HomePage());
    }

    const projectId = match[1].toLowerCase();
    const remainder = match[2];
    // Case 2: Project ID invalid (all other cases)
    if (!projectId.match(/^[a-z0-9-]+$/)) {
      return HTMLResponse(Pages.InvalidPage(projectId), {
        status: 400,
      });
    }

    const repo = (idToRepo as Record<string, string>)[projectId];
    // Case 3: Project ID valid and found
    if (typeof repo === "string") {
      const newUrl =
        `https://invent.kde.org/${repo}/${remainder}` + url.search + url.hash;
      return Response.redirect(newUrl, 307);
    }

    // Case 4: Project ID valid but not found
    return HTMLResponse(Pages.NotFoundPage(projectId), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
