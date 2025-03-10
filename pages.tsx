import { cx, inline, install } from "@twind/core";
import render from "preact-render-to-string";
import { Out } from "./Out.tsx";
import { groupIds, groupedProjects, groups } from "./built/projects.json";
import { inventUrl } from "./helpers";
import { NotFound } from "./page-notfound.tsx";
import twindConfig from "./twind.config";

import type { ComponentChild, ComponentChildren } from "preact";
import type { Group, Project } from "./helpers";

function Chip(props: {
  title?: string;
  href: string;
  children: ComponentChildren;
}) {
  return (
    <a
      class={cx("rounded-sm bg-neutral-3 py-1.5 px-2.5", "hover:bg-brand-8")}
      href={props.href}
      title={props.title}
    >
      {props.children}
    </a>
  );
}

function BreezeButton(props: { href: string; children: ComponentChildren }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      class={cx(
        "border border-solid border-background",
        "hover:border-brand-9 hover:bg-brand-3",
        "focus-visible:outline-none",
        "focus-visible:border-brand-9 focus-visible:bg-brand-3",
        "text-inherit rounded-sm",
        "-ml-2 px-2 py-1.5",
        "flex flex-col items-start justify-start"
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
  const cBrand1 = tw.theme("colors.brand.1") as string;
  const html = render(
    <html lang="en-US">
      <head>
        <meta name="viewport" content="width=device-width" />
        {/* We don't need meta charset because we've set it in the headers. */}
        <title>{title}</title>
        <meta name="theme-color" content={cBrand1} />
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
            "pt-10 pb-2 mb-4",
            "scroll-mt-24 bg-[#31363B]",
            "border-b border-neutral-9"
          )}
        >
          <div class="max-w-7xl mx-auto px-6 md:px-14">
            <h1 class="font-bold text-2xl">
              Quick redirector for KDE Projects
            </h1>
            <p>
              © 2025 <Out href="https://kisaragi-hiu.com/">Kisaragi Hiu</Out> @{" "}
              <Out href="https://github.com/kisaragi-hiu/kde-project.kisaragi-hiu.com">
                GitHub
              </Out>
            </p>
          </div>
        </div>
        <main class="max-w-7xl mx-auto px-6 md:px-14 pb-8">{...children}</main>
      </body>
    </html>
  );
  return inline("<!DOCTYPE html>" + html);
}

function GitLabRejected(url: string | URL) {
  return (
    <>
      <p>
        Invent would redirect if navigated to {url}. Perhaps there's a typo?
      </p>
      <p>
        <a href={url} rel="noreferrer" class="text-link hover:underline">
          Open {url} anyways
        </a>
      </p>
    </>
  );
}

function Invalid(id?: string) {
  return (
    <>
      <p>{id ? `${id} is not a valid project ID` : "Invalid project ID"}</p>
    </>
  );
}

async function Home() {
  // Main
  return (
    <>
      <p>
        Uses data from{" "}
        <Out href="https://invent.kde.org/sysadmin/repo-metadata/">
          sysadmin/repo-metadata
        </Out>
        .
      </p>
      <h2 class="font-bold text-xl mt-8 mb-4">Usage</h2>
      <p class="mb-2">
        <code class="">
          https://kde-project.kisaragi-hiu.com/{"<projectId>"}
        </code>{" "}
        will resolve the repo path for you and redirect to the KDE Invent page
        for that project.
        <br />
        <code>
          https://kde-project.kisaragi-hiu.com/{"<projectId>"}/{"<path>"}[:
          {"<line>"}]
        </code>{" "}
        will go to {"<path>"} within the project's repository; if {"<line>"} is
        given it'll also try to jump to that line.
        <br />
      </p>
      <p>
        For example,{" "}
        <Out href="https://kde-project.kisaragi-hiu.com/krita/.kde-ci.yml" />{" "}
        <br />
        redirects to{" "}
        <Out href="https://invent.kde.org/graphics/krita/-/blob/HEAD/.kde-ci.yml" />
        .
      </p>
      <h2 id="groups" class="font-bold text-xl mt-8 mb-4">
        Groups
      </h2>
      <ul class="flex flex-wrap gap-x-2.5 gap-y-5">
        {groupIds.map((id) => {
          const group = (groups as Record<string, Group>)[id];
          return (
            <li>
              <Chip title={group.description} href={`#group-${id}`}>
                {group.name}
              </Chip>
            </li>
          );
        })}
      </ul>
      <h2 class="font-bold text-xl mt-8 mb-4">Projects list</h2>
      {groupIds.map((groupId) => {
        const group = (groups as Record<string, Group>)[groupId];
        const projects = (groupedProjects as Record<string, Project[]>)[
          groupId
        ];
        return (
          <>
            <h3
              id={`group-${group.identifier}`}
              class="flex text-neutral-11 space-x-2 items-center mb-1 mt-2"
            >
              <a href="#groups" class="font-bold hover:underline">
                {group.name}
              </a>
              <span class="border-b border-neutral-10 flex-grow" />
            </h3>
            {/* <p>{group.description}</p> */}
            <ul class="flex flex-col">
              {projects.map((project) => (
                <li>
                  <BreezeButton href={inventUrl(project.repopath)}>
                    <div>
                      <span class="font-bold">{project.identifier}</span>
                      <span>・{project.name}</span>
                    </div>
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

export const RejectedPage = (url: string | URL) =>
  Page("Invalid path | Kisaragi's KDE Project Redirector", GitLabRejected(url));
export const InvalidPage = (id?: string) =>
  Page("Invalid project ID | Kisaragi's KDE Project Redirector", Invalid(id));
export const NotFoundPage = (id: string) =>
  Page(
    "Project ID Not Found | Kisaragi's KDE Project Redirector",
    NotFound(id)
  );
export const HomePage = async () =>
  Page("Kisaragi's KDE Project Redirector", await Home());
