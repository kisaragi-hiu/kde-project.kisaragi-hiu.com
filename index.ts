import { idToRepo } from "./built/projects.json";
import { htmlResponse, inventUrl } from "./helpers";
import * as Pages from "./pages";

function isValidProject(projectId: string): boolean {
  return projectId.match(/^[a-z0-9-]+$/);
}

async function apiFileExists(repo: string, path: string): boolean {
  const encodedRepo = encodeURIComponent(repo);
  const encodedPath = encodeURIComponent(path);
  const url = `https://invent.kde.org/api/v4/projects/${encodedRepo}/repository/files/${encodedPath}?ref=HEAD`;
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}

export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([^\/]*)\/?(.*)/);
    // Case 1: Project ID invalid (not provided)
    if (!match || match[0] === "/") {
      return htmlResponse(await Pages.HomePage());
    }

    const projectId = decodeURIComponent(match[1].toLowerCase());
    const remainder = match[2];

    // TODO: special case: /-/projectId/<path> to find the valid file path for
    // <path> in <projectId>

    // Case 2: Project ID invalid (all other cases)
    if (!isValidProject(projectId)) {
      return htmlResponse(Pages.InvalidPage(projectId), {
        status: 400,
      });
    }

    const repo = (idToRepo as Record<string, string>)[projectId];
    // Case 3: Project ID valid and found
    if (typeof repo === "string") {
      const newUrl = inventUrl(repo, remainder, url.search, url.hash);
      return Response.redirect(newUrl, 307);
    }

    // Case 4: Project ID valid but not found
    return htmlResponse(Pages.NotFoundPage(projectId), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
