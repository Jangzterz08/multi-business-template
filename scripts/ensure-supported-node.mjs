const [major] = process.versions.node.split(".").map(Number);

if (major !== 22) {
  console.error(
    [
      "This template's Vite/Vitest toolchain is supported on Node 22 LTS.",
      `Current Node version: ${process.versions.node}`,
      "Use Node 22 before running dev, build, lint, or test commands.",
      "Example with nvm: nvm install 22 && nvm use 22",
    ].join("\n"),
  );

  process.exit(1);
}
