/** Raw project metadata */
export interface ProjectMetadata {
  name: string;
  description: string;
  identifier: string;
  bugzilla?: {
    product: string;
    component?: string;
  };
  repoactive: boolean;
}

/** Our project representation */
export interface Project {
  name: string;
  description: string;
  identifier: string;
  group: string;
  repopath: string;
}

/** Raw group metadata */
export interface GroupMetadata {
  name: string;
  description: string;
}
/** Group representation */
export interface Group {
  name: string;
  description: string;
  identifier: string;
}

export function htmlResponse(
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

/**
 * Return URL to KDE Invent for `repo`, joining `remainder` and everything else afterwards.
 */
export function inventUrl(
  repo: string,
  remainder = "",
  ...etc: (string | undefined)[]
) {
  return `https://invent.kde.org/${repo}/${remainder}` + etc.join("");
}
