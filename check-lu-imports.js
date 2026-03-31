const fs = require("fs");
const path = require("path");
const root = path.join(process.cwd(), "src");
const imported = {};
function walk(dir) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      walk(p);
    } else if (p.endsWith(".jsx") || p.endsWith(".js")) {
      const text = fs.readFileSync(p, "utf8");
      const re = /import\s*\{([^}]+)\}\s*from\s*['\"]react-icons\/lu['\"]/g;
      let m;
      while ((m = re.exec(text))) {
        const names = m[1]
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);
        imported[p] = [...(imported[p] || []), ...names];
      }
    }
  }
}
walk(root);
const exported = new Set();
const dts = fs.readFileSync(
  path.join(process.cwd(), "node_modules/react-icons/lu/index.d.ts"),
  "utf8",
);
for (const line of dts.split(/\r?\n/)) {
  const m = line.match(/export declare const\s+(Lu\w+):/);
  if (m) exported.add(m[1]);
}
console.log("INVALID IMPORTS:");
for (const [p, names] of Object.entries(imported)) {
  for (const name of names) {
    if (!exported.has(name)) {
      console.log(`${p} -> ${name}`);
    }
  }
}
console.log("DONE");
