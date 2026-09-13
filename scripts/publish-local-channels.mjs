import { cp, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const channels = ["canary", "v1"];
await rm(resolve(root, "deploy"), { recursive: true, force: true });
for (const channel of channels) {
  execFileSync("npm", ["run", `build:${channel}`], { cwd: root, stdio: "inherit", env: { ...process.env, REMOTE_CHANNEL: channel } });
  await mkdir(resolve(root, "deploy", channel), { recursive: true });
  await cp(resolve(root, "dist"), resolve(root, "deploy", channel), { recursive: true });
}
console.log("Published local channels: deploy/canary and deploy/v1");
