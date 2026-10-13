// Maps CDN asset pointers by name (e.g. "sp-maly" -> url)
const mods = import.meta.glob<{ url: string }>("./*.asset.json", { eager: true, import: "default" });
const map: Record<string, string> = {};
for (const [path, mod] of Object.entries(mods)) {
  const name = path.replace("./", "").replace(/\.(webp|png)\.asset\.json$/, "");
  map[name] = mod.url;
}
export default map;
