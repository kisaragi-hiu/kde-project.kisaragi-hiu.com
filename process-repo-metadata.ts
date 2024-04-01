/**
 * Build-time script to convert repo-metadata to an easy-to-read JSON file.
 */

import { readdirSync } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

import type { Group, GroupMetadata, Project, ProjectMetadata } from "./helpers";

const projectsDir = "repo-metadata/projects-invent";
const groupsDir = "repo-metadata/group-metadata";
const metafiles = readdirSync(projectsDir, {
  recursive: true,
  encoding: "utf-8",
}).filter((p) => path.basename(p) === "metadata.yaml");
const groupfiles = readdirSync(groupsDir, {
  recursive: true,
  encoding: "utf-8",
}).filter((p) => path.basename(p) === "group.yaml");

const idToRepo: Record<string, string> = {};
const projects: Project[] = [];
const groupIds: Set<string> = new Set();
const groups: Record<string, Group> = {};

for (const metafile of metafiles) {
  const repopath = path.dirname(metafile);
  const group = repopath.split(path.sep)[0];
  const metadata = yaml.load(
    await Bun.file(path.join(projectsDir, metafile)).text(),
  ) as ProjectMetadata;

  const morphedGroup =
    group === "documentation" || group === "websites"
      ? "docs-and-websites"
      : group;

  const { name, description, identifier } = metadata;

  idToRepo[identifier] = repopath;
  projects.push({
    name,
    description,
    identifier,
    repopath,
    group: morphedGroup,
  });
}

projects.sort((a, b) => (a.identifier < b.identifier ? -1 : 1));

const groupedProjects = Object.groupBy(projects, (p) => p.group);

for (const groupfile of groupfiles) {
  const identifier = path.basename(path.dirname(groupfile));
  const metadata = yaml.load(
    await Bun.file(path.join(groupsDir, groupfile)).text(),
  ) as GroupMetadata;
  const { name, description } = metadata;
  const morphedGroup =
    identifier === "documentation" || identifier === "websites"
      ? {
          name: "Documentation and Websites",
          description: "(unofficial group) KDE software docs and websites",
          identifier: "docs-and-websites",
        }
      : { name, description, identifier };
  groupIds.add(morphedGroup.identifier);
  groups[morphedGroup.identifier] = morphedGroup;
}

console.log(
  JSON.stringify({
    idToRepo,
    groupedProjects,
    groupIds: [...groupIds].sort((a, b) => {
      if (a === "unmaintained") return 1;
      if (b === "unmaintained") return -1;
      return a < b ? -1 : 1;
    }),
    groups,
  }),
);
