import { readFile, writeFile } from "node:fs/promises";
import { build, createServer } from "vite";

await build();

let server;

try {
  server = await createServer({
    mode: "production",
    appType: "custom",
    server: {
      middlewareMode: true,
      watch: null,
    },
    ssr: {
      noExternal: ["gsap", "@gsap/react"],
    },
  });

  const { render } = await server.ssrLoadModule(
    "/src/entry-server.jsx"
  );

  const markup = render();

  if (!markup.includes("<h1") || !markup.includes('id="contact"')) {
    throw new Error("Prerender output is missing required page content.");
  }

  const outputPath = new URL("../dist/index.html", import.meta.url);
  const template = await readFile(outputPath, "utf8");
  const marker = '<div id="root"></div>';

  if (!template.includes(marker)) {
    throw new Error("The empty root element was not found.");
  }

  const html = template.replace(
    marker,
    () => `<div id="root">${markup}</div>`
  );

  await writeFile(outputPath, html, "utf8");

  console.log("Prerender complete: homepage HTML contains page content.");
} finally {
  await server?.close();
}