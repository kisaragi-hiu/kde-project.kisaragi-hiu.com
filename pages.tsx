import render from "preact-render-to-string";
import type { VNode } from "preact";

function Page(title: string, ...children: VNode[]) {
  return (
    "<!DOCTYPE html>" +
    render(
      <html lang="en-US">
        <head>
          <title>{title}</title>
        </head>
        <body>{...children}</body>
      </html>,
    )
  );
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
