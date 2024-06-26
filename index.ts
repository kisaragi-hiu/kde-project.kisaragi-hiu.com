import { idToRepo } from "./built/projects.json";
import { htmlResponse, inventUrl } from "./helpers";
import * as Pages from "./pages";

/**
 * Take a string like /a/b/c, then split it into "a" and "b/c".
 */
function extractNextComponent(
  path: string,
): [string, string] | [undefined, undefined] {
  const m = path.match(/^\/?([^\/]*)\/?(.*)/);
  if (!m || m[0] === "/") return [undefined, undefined];
  return [m[1], m[2]];
}

function isValidProject(projectId: string): boolean {
  return !!projectId.match(/^[a-z0-9-]+$/);
}

async function apiFileExists(repo: string, path: string): Promise<string> {
  const encodedRepo = encodeURIComponent(repo);
  const encodedPath = encodeURIComponent(path);
  const url = `https://invent.kde.org/api/v4/projects/${encodedRepo}/repository/files/${encodedPath}?ref=HEAD`;
  const res = await fetch(url, { method: "HEAD" });
  if (res.ok) return path;
  throw undefined;
}

export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  // ... plus one special case, the /-/projectId/<path> route.
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let searchPathMode = false;
    let [first, rest] = extractNextComponent(url.pathname);

    // Case 1: Project ID invalid (not provided)
    if (typeof first === "undefined" || typeof rest === "undefined") {
      return htmlResponse(await Pages.HomePage());
    }

    let projectId = decodeURIComponent(first.toLowerCase());

    // Special case: project ID is "-".
    // Implement the /-/projectId/<path> route.
    if (projectId === "-") {
      searchPathMode = true;
      [first, rest] = extractNextComponent(rest);
      if (typeof first === "undefined" || typeof rest === "undefined") {
        return Response.redirect("/", 307);
      }
      projectId = decodeURIComponent(first.toLowerCase());
    }

    // Case 2: Project ID invalid (all other cases)
    if (!isValidProject(projectId)) {
      return htmlResponse(Pages.InvalidPage(projectId), {
        status: 400,
      });
    }

    const repo = (idToRepo as Record<string, string>)[projectId];
    // Case 3: Project ID valid and found
    if (typeof repo === "string") {
      if (searchPathMode && rest !== "") {
        // Try: /-/kmail/editor/kmcomposerwin.cpp
        // Try: /-/kmail/src/editor/kmcomposerwin.cpp
        const foundPath = await Promise.any([
          apiFileExists(repo, rest),
          apiFileExists(repo, "src/" + rest),
        ]).catch(() => undefined);
        const newUrl = inventUrl(repo, "-/blob/HEAD/" + foundPath || "");
        return Response.redirect(newUrl, 307);
      }
      // Normal mode, simple redirect
      const newUrl = inventUrl(repo, rest, url.search, url.hash);
      return Response.redirect(newUrl, 307);
    }

    // Case 4: Project ID valid but not found
    return htmlResponse(Pages.NotFoundPage(projectId), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
