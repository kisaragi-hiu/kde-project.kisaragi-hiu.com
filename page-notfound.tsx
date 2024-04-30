import { closest, distance } from "fastest-levenshtein";
import { Out } from "./Out.tsx";
import { idToRepo } from "./built/projects.json";
import { inventUrl } from "./helpers";

export function NotFound(id?: string) {
  if (typeof id !== "string") return <p>ID not found</p>;

  const candidate = closest(id, Object.keys(idToRepo)) as keyof typeof idToRepo;

  return (
    <>
      <p>Did not found a project whose ID is {id}.</p>
      {distance(candidate, id) < 5 && (
        <p>
          Did you mean{" "}
          <Out href={inventUrl(idToRepo[candidate])}>{candidate}</Out>?
        </p>
      )}
      <p class="mt-8">
        <a class="text-link hover:underline" href="/">
          Back to project list
        </a>
      </p>
    </>
  );
}
