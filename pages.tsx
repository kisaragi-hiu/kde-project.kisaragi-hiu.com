import render from "preact-render-to-string";
import { install, inline, cx } from "@twind/core";
import twindConfig from "./twind.config";
import type { ComponentChildren, ComponentChild } from "preact";

function BreezeButton(props: { href: string; children: ComponentChildren }) {
  return (
    <a
      class={cx(
        "border border-solid border-background",
        "hover:border-brand-9 hover:bg-brand-3",
        "text-center text-inherit rounded-sm transition duration-100",
        "-ml-2 px-2 py-1.5",
        "flex flex-col items-start justify-start",
      )}
      href={props.href}
    >
      {props.children}
    </a>
  );
}

function Page(title: string, ...children: ComponentChild[]) {
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
        {/* @ts-ignore */}
        {typeof Bun !== "undefined" && (
          <script>
            {`new EventSource('/esbuild').addEventListener('change', () => location.reload())`}
          </script>
        )}
      </head>
      <body class="max-w-7xl mx-auto px-6 md:px-14 relative bg-background">
        <main class="pt-10 scroll-mt-24 text-neutral-12">{...children}</main>
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

async function Home() {
  const projects = (await fetch(
    "https://projects.kde.org/api/v1/identifiers",
  ).then((r) => r.json())) as string[];
  console.log("Rendering Home");
  return (
    <>
      <h1 class="font-bold text-2xl">Quick redirector for KDE Projects</h1>
      <h2>
        By{" "}
        <a class="text-accent-11" href="https://kisaragi-hiu.com/">
          Kisaragi Hiu
        </a>
      </h2>
      <ul class="flex flex-col max-w-sm">
        {projects.map((id) => (
          <li>
            <BreezeButton href={`/${id}`}>{id}</BreezeButton>
          </li>
        ))}
      </ul>
    </>
  );
}

export const InvalidPage = () => Page("Invalid project ID", Invalid());
export const NotFoundPage = () => Page("Project ID Not Found", NotFound());
export const HomePage = async () =>
  Page("Kisaragi's KDE Project Redirector", await Home());
