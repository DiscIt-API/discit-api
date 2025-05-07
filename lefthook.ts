import { chmod, exists, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const HOOKS_DIR = ".git/hooks";

if (!(await exists(".git"))) {
	console.error("Error: lefthook.ts script must be run from the root folder of git repo");
	process.exit(1);
}

await mkdir(HOOKS_DIR, { recursive: true });

const preCommit = `#!/bin/sh
export PATH="$PWD/node_modules/.bin:$PATH"
lefthook run pre-commit`;

await writeFile(join(HOOKS_DIR, "pre-commit"), preCommit);

await chmod(join(HOOKS_DIR, "pre-commit"), 0o755);

console.log("lefthook hooks installed ✅");

process.exit(0);
