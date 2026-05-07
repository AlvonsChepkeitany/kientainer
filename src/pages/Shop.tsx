import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { buildDiscountMap } from "@/lib/pricing";

const APPLICATIONS = ["residential", "commercial", "industrial", "agricultural"];

const Shop = () => {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { data: products, isLoading } = useProducts({ q: q || undefined });
  const { data: categories } = useCategories();
  const discountMap = useMemo(() => buildDiscountMap(products ?? []), [products]);

  const [capacity, setCapacity] = useState<[number, number]>([0, 24000]);
  const [price, setPrice] = useState<[number, number]>([0, 350000]);
  const [apps, setApps] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "capacity">("featured");

  const filtered = useMemo(() => {
    let list = products ?? [];
    list = list.filter((p) => {
      if (p.capacity_liters !== null && (p.capacity_liters < capacity[0] || p.capacity_liters > capacity[1])) return false;
      if (p.price !== null && (p.price < price[0] || p.price > price[1])) return false;
      if (apps.length && p.application && !apps.includes(p.application)) return false;
      if (cats.length && p.category_id && !cats.includes(p.category_id)) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "price-desc") sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === "capacity") sorted.sort((a, b) => (b.capacity_liters ?? 0) - (a.capacity_liters ?? 0));
    else sorted.sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0));
    return sorted;
  }, [products, capacity, price, apps, cats, sort]);

  return (
    <>
      <Seo title="All Products" description="Browse all Kentainers tanks and industrial storage products." />
      <div className="bg-primary text-primary-foreground">
        <div className="container-tight py-10">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">All Products</h1>
          {q && <p className="text-primary-foreground/80 mt-2">Showing results for "{q}"</p>}
        </div>
      </div>

      <div className="container-tight py-10 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-7">
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-3">Capacity (L)</h3>
            <Slider value={capacity} min={0} max={24000} step={500} onValueChange={(v) => setCapacity(v as [number, number])} />
            <div className="text-xs text-muted-foreground mt-2">{capacity[0]}L – {capacity[1]}L</div>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-3">Price (KES)</h3>
            <Slider value={price} min={0} max={350000} step={5000} onValueChange={(v) => setPrice(v as [number, number])} />
            <div className="text-xs text-muted-foreground mt-2">KES {price[0].toLocaleString()} – {price[1].toLocaleString()}</div>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-3">Application</h3>
            <div className="space-y-2">
              {APPLICATIONS.map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                  <Checkbox
                    checked={apps.includes(a)}
                    onCheckedChange={(v) => setApps((cur) => (v ? [...cur, a] : cur.filter((x) => x !== a)))}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-2">
              {categories?.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={cats.includes(c.id)}
                    onCheckedChange={(v) => setCats((cur) => (v ? [...cur, c.id] : cur.filter((x) => x !== c.id)))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5 gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
          {isLoading ? (
            <p>Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={{ ...p, discountPercent: discountMap[p.id] }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
