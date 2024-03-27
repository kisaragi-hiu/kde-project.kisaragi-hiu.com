import render from "preact-render-to-string";
import { install, inline, cx } from "@twind/core";
import twindConfig from "./twind.config";
import { inventUrl } from "./helpers";
import { groupedProjects, groups } from "./built/projects.json";

import type { ComponentChildren, ComponentChild } from "preact";
import type { Project, Group } from "./helpers";

function BreezeButton(props: { href: string; children: ComponentChildren }) {
  return (
    <a
      target="_blank"
      class={cx(
        "border border-solid border-background",
        "hover:border-brand-9 hover:bg-brand-3",
        "focus-visible:outline-none",
        "focus-visible:border-brand-9 focus-visible:bg-brand-3",
        "text-inherit rounded-sm",
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
      <body class="relative bg-background text-neutral-12">
        <div
          class={cx(
            "max-w-7xl mx-auto px-6 md:px-14 pt-10 pb-2 mb-4",
            "scroll-mt-24 bg-[#31363B]",
            "border-b border-neutral-9",
          )}
        >
          <h1 class="font-bold text-2xl">Quick redirector for KDE Projects</h1>
          <p>
            By{" "}
            <a
              class="text-link hover:underline"
              href="https://kisaragi-hiu.com/"
            >
              Kisaragi Hiu
            </a>
          </p>
        </div>
        <main class="max-w-7xl mx-auto px-6 md:px-14">{...children}</main>
      </body>
    </html>,
  );
  return inline("<!DOCTYPE html>" + html);
}

function Invalid(id?: string) {
  return (
    <>
      <p>{id ? `${id} is not a valid project ID` : `Invalid project ID`}</p>
    </>
  );
}

function NotFound(id?: string) {
  return (
    <>
      <p>{id ? `ID "${id}" not found` : "ID not found"}</p>
    </>
  );
}

async function Home() {
  // Main
  return (
    <>
      <h2 class="font-bold text-xl mt-8 mb-4">Projects list</h2>
      {(groupedProjects as [string, Project[]][]).map(([groupId, projects]) => {
        const group = (groups as Record<string, Group>)[groupId];
        return (
          <>
            <h3
              id={`group-${group.identifier}`}
              class="flex text-neutral-11 space-x-2 items-center mb-1 mt-2"
            >
              <span class="font-bold">{group.name}</span>
              <span class="border-b border-neutral-10 flex-grow"></span>
            </h3>
            {/* <p>{group.description}</p> */}
            <ul class="flex flex-col">
              {projects.map((project) => (
                <li>
                  <BreezeButton href={inventUrl(project.repopath)}>
                    <div class="font-bold">{project.identifier}</div>
                    {project.description.length === 0 ? (
                      <div class="italic">No description</div>
                    ) : (
                      project.description
                    )}
                  </BreezeButton>
                </li>
              ))}
            </ul>
          </>
        );
      })}
    </>
  );
}

export const InvalidPage = (id?: string) =>
  Page("Invalid project ID", Invalid(id));
export const NotFoundPage = (id: string) =>
  Page("Project ID Not Found", NotFound(id));
export const HomePage = async () =>
  Page("Kisaragi's KDE Project Redirector", await Home());
