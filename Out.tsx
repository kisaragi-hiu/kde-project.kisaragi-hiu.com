import type { ComponentChildren } from "preact";
export function Out(props: { href: string; children?: ComponentChildren }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      class="text-link hover:underline"
    >
      {props.children || props.href}
    </a>
  );
}
