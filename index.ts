import type {
  Loader,
  OnLoadArgs,
  OnResolveArgs,
  PluginBuild,
} from "https://deno.land/x/esbuild@v0.12.15/mod.d.ts";

const name = "http-fetch";

const setup = ({ onResolve, onLoad }: PluginBuild) => {
  onResolve({ filter: /^https:\/\// }, resolveFile);
  onResolve({ filter: /.*/, namespace: "http-fetch" }, resolveUrl);
  onLoad({ filter: /.*/, namespace: "http-fetch" }, loadSource);
};

const resolveFile = ({ path }: OnResolveArgs) => ({
  path: path,
  namespace: "http-fetch",
});

const resolveUrl = ({ path, importer }: OnResolveArgs) => ({
  path: new URL(path, importer).href,
  namespace: "http-fetch",
});

const loadSource = async ({ path }: OnLoadArgs) => {
  const source = await fetch(path);

  if (!source.ok) {
    const message = `GET ${path} failed: status ${source.status}`;
    throw new Error(message);
  }

  let contents = await source.text();
  const pattern = /\/\/# sourceMappingURL=(\S+)/;
  const match = contents.match(pattern);
  if (match) {
    const url = new URL(match[1], source.url);
    const dataurl = await loadMap(url);
    const comment = `//# sourceMappingURL=${dataurl}`;
    contents = contents.replace(pattern, comment);
  }

  const { pathname } = new URL(source.url);
  const loader = (pathname.match(/[^.]+$/)?.[0]) as (Loader | undefined);

  return { contents, loader };
};

const loadMap = async (url: URL) => {
  const map = await fetch(url);
  const type = map.headers.get("content-type")?.replace(/\s/g, "");
  const buffer = await map.arrayBuffer();
  const blob = new Blob([buffer], { type });
  const reader = new FileReader();
  return new Promise((cb) => {
    reader.onload = (e) => cb(e.target?.result);
    reader.readAsDataURL(blob);
  });
};

export default { name, setup };
