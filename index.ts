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
 * Check if `url` navigates with redirection.
 * GitLab responds to invalid paths by trying to do helpful redirects, which is
 * great for direct entry, but in this case we want to catch that and display
 * our own error message. So we use this to avoid that.
 */
async function doesRedirect(url: string | URL) {
  const result = await fetch(url, { method: "HEAD", redirect: "manual" });
  return result.status !== 200;
}

/**
 * Check if `url` redirects.
 * GitLab responds to invalid paths by trying to do helpful redirects, which is
 * great for direct entry, but in this case we want to catch that and display
 * our own error message. So we use this to avoid that.
 */
async function throwIfUrlRedirects(url: string | URL): Promise<string | URL> {
  if (await doesRedirect(url)) {
    throw undefined;
  }
  return url;
}

export default {
  // There are only 4 cases: valid -> found or not, invalid -> provided or not
  // ... plus one special case, the /-/projectId/<path> route.
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const [pathWithoutLine, line] = pathSplitLine(url.pathname);
    let [first, rest] = extractNextComponent(pathWithoutLine);

    // Case 1: Project ID invalid (not provided)
    if (typeof first === "undefined" || typeof rest === "undefined") {
      return htmlResponse(await Pages.HomePage());
    }

    let projectId = decodeURIComponent(first.toLowerCase());

    // Special case: project ID is "-".
    // For compatibility, get rid of it but otherwise behave as normal.
    // (This is not recursive.)
    if (projectId === "-") {
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

    // Find the repo based on the projectId
    const repo = (idToRepo as Record<string, string>)[projectId];
    // Case 3: Project ID valid and found
    if (typeof repo === "string") {
      // Only the project ID is specified. We already checked that it's there
      // in `idToRepo` and don't need to consult Invent whether it exists or
      // not. So we can directly redirect without other checks.
      if (rest === "") {
        return Response.redirect(inventUrl(repo, url.search, url.hash));
      }

      // Try: /kmail/editor/kmcomposerwin.cpp
      // Try: /kmail/src/editor/kmcomposerwin.cpp
      const urlsToTry = ["-/blob/HEAD/", "-/blob/HEAD/src/"].map((part) =>
        inventUrl(repo, part, rest, line && `#L${line}`),
      );
      const foundUrl = await Promise.any(
        urlsToTry.map(throwIfUrlRedirects),
      ).catch(() => undefined);
      if (foundUrl !== undefined) {
        return Response.redirect(
          foundUrl + [url.search, url.hash].join(""),
          307,
        );
      } else {
        return htmlResponse(Pages.RejectedPage(urlsToTry[0]));
      }
    }

    // Case 4: Project ID valid but not found
    return htmlResponse(Pages.NotFoundPage(projectId), {
      status: 404,
    });
  },
} satisfies ExportedHandler;
