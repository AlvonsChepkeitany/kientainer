// Resolves /src/assets/foo.jpg paths from DB to imported asset URLs.
import waterTank from "@/assets/product-water-tank.jpg";
import septic from "@/assets/product-septic-tank.jpg";
import agri from "@/assets/product-agri.jpg";
import silage from "@/assets/product-silage.jpg";
import custom from "@/assets/product-custom.jpg";

const MAP: Record<string, string> = {
  "/src/assets/product-water-tank.jpg": waterTank,
  "/src/assets/product-septic-tank.jpg": septic,
  "/src/assets/product-agri.jpg": agri,
  "/src/assets/product-silage.jpg": silage,
  "/src/assets/product-custom.jpg": custom,
};

export const resolveAsset = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return MAP[path] ?? null;
};

export const resolveAssets = (paths: string[] | null | undefined): string[] => {
  if (!paths) return [];
  return paths.map(resolveAsset).filter((x): x is string => Boolean(x));
};
