import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const preloadDir = path.join(dist, "preload");

await fs.mkdir(preloadDir, { recursive: true });
const pluginConfig = JSON.parse(await fs.readFile(path.join(root, "plugin.json"), "utf8"));
delete pluginConfig.development;
await fs.writeFile(path.join(dist, "plugin.json"), `${JSON.stringify(pluginConfig, null, 2)}\n`);
await fs.copyFile(path.join(root, "logo.svg"), path.join(dist, "logo.svg"));
await fs.copyFile(path.join(root, "cover.png"), path.join(dist, "cover.png"));
await fs.writeFile(
  path.join(preloadDir, "package.json"),
  JSON.stringify(
    {
      type: "commonjs",
      dependencies: {
        gifenc: "1.0.3",
        "pdf-lib": "1.17.1",
        sharp: "0.34.5"
      }
    },
    null,
    2
  )
);

execFileSync("npm", ["install", "--omit=dev", "--prefix", preloadDir], {
  cwd: root,
  stdio: "inherit"
});
