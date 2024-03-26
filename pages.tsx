import render from "preact-render-to-string";
import { install, inline } from "@twind/core";
import twindConfig from "./twind.config";
import type { VNode } from "preact";

function Page(title: string, ...children: VNode[]) {
  const tw = install(twindConfig);
  // tw.theme("colors...") is typed to return a ColorValue, which is a string or
  // a function returning a string. However, that's just what the configuration
  // allows, and tw.theme actually always returns a string in this case. So the
  // type cast is safe, and the types are wrong.
  const c_brand1 = tw.theme("colors.brand.1") as string;
  const html = render(
    <html lang="en-US">
      <head>
        {/* We don't need meta charset because we've set it in the headers. */}
        <title>{title}</title>
        <meta name="theme-color" content={c_brand1} />
      </head>
      <body class="max-w-7xl mx-auto px-6 md:px-14 relative bg-background text-brand-11">
        <main class="pt-10 scroll-mt-24">{...children}</main>
      </body>
    </html>,
  );
  return inline("<!DOCTYPE html>" + html);
}

function Invalid() {
  return <div>Invalid project ID</div>;
}

function NotFound() {
  return <div>Project ID is valid but not found</div>;
}

function Home() {
  return (
    <>
      <h1>Quick redirector for KDE Projects</h1>
      <h2>
        By <a href="https://kisaragi-hiu.com/">Kisaragi Hiu</a>
      </h2>
    </>
  );
}

export const InvalidPage = () => Page("Invalid project ID", Invalid());
export const NotFoundPage = () => Page("Project ID Not Found", NotFound());
export const HomePage = () => Page("Kisaragi's KDE Project Redirector", Home());
