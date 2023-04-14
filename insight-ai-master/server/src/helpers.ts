import { fileURLToPath } from "url";

export function isMain(url: string): boolean {
  return (
    fileURLToPath(url) === process.argv[1] ||
    fileURLToPath(url) === process.argv[1] + ".js"
  );
}
