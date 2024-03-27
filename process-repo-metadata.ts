/**
 * Build-time script to convert repo-metadata to an easy-to-read JSON file.
 */

import { readdirSync } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

import type { Project, ProjectMetadata, Group, GroupMetadata } from "./helpers";

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
const groups: Group[] = [];

for (const metafile of metafiles) {
  const repopath = path.dirname(metafile);
  const group = repopath.split(path.sep)[0];
  const metadata = yaml.load(
    await Bun.file(path.join(projectsDir, metafile)).text(),
  ) as ProjectMetadata;

  const { name, description, identifier } = metadata;

  idToRepo[identifier] = repopath;
  projects.push({ name, description, identifier, repopath, group });
}

for (const groupfile of groupfiles) {
  const identifier = path.basename(path.dirname(groupfile));
  const metadata = yaml.load(
    await Bun.file(path.join(groupsDir, groupfile)).text(),
  ) as GroupMetadata;
  const { name, description } = metadata;
  groups.push({ name, description, identifier });
}

console.log(JSON.stringify({ idToRepo, projects, groups }));
