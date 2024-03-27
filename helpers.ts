/** Raw project metadata */
export interface ProjectMetadata {
  name: string;
  description: string;
  identifier: string;
  bugzilla?: {
    product: string;
    component?: string;
  };
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

export function HTMLResponse(
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

export function inventUrl(
  repo: string,
  remainder: string = "",
  ...etc: string[]
) {
  return `https://invent.kde.org/${repo}/${remainder}` + etc.join("");
}
