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
