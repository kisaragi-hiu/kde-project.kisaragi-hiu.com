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

/**
 * Take a string like "foo:123" and return ["foo", "123"].
 * Specifically, split the last component of `path` and return it as a separate argument.
 * The goal is to later transform it into #L123.
 */
function pathSplitLine(path: string): [string, string] | [string, undefined] {
  const lastPos = [...path.matchAll(/:/g)].map((m) => m.index).at(-1);
  if (lastPos === undefined) {
    return [path, undefined];
  }
  return [path.slice(0, lastPos), path.slice(lastPos + 1)];
}

function isValidProject(projectId: string): boolean {
  return !!projectId.match(/^[a-z0-9-]+$/);
}

/**
 * Check if `url` navigates without redirection.
 * GitLab responds to invalid paths by trying to do helpful redirects, which is
 * great for direct entry, but in this case we want to catch that and display
 * our own error message. So we use this to avoid that.
 */
async function redirectIfValid(url: string | URL) {
  const result = await fetch(url, { method: "HEAD", redirect: "manual" });
  if (result.status === 200) {
    return Response.redirect(url, 307);
  } else {
    return htmlResponse(Pages.RejectedPage(url));
  }
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
    const [pathWithoutLine, line] = pathSplitLine(url.pathname);
    let [first, rest] = extractNextComponent(pathWithoutLine);

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
        const newUrl = inventUrl(
          repo,
          "-/blob/HEAD/" + foundPath || "",
          line && `#L${line}`,
        );
        return redirectIfValid(newUrl);
      }
      // Normal mode, simple redirect
      const newUrl = inventUrl(repo, rest, url.search, url.hash);
      return redirectIfValid(newUrl);
    }

    // Case 4: Project ID valid but not found
    return htmlResponse(Pages.NotFoundPage(projectId), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
