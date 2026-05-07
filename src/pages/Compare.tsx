import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { useCart } from "@/stores/cart";
import { useProductsByIds } from "@/hooks/useCatalog";
import { formatKES, formatLiters } from "@/lib/format";
import { getMarketValue, getSavePercent } from "@/stores/catalog";

const Compare = () => {
  const ids = useCart((s) => s.compareIds);
  const remove = useCart((s) => s.toggleCompare);
  const { data: products } = useProductsByIds(ids);

  const rows = [
    { key: "capacity_liters", label: "Capacity", fmt: (p: Product) => formatLiters(p.capacity_liters) },
    { key: "price", label: "Price", fmt: (p: Product) => formatKES(p.price) },
    { key: "application", label: "Application" },
    { key: "color", label: "Color" },
    { key: "material", label: "Material", fmt: (p: Product) => p.specs?.material },
    { key: "dimensions", label: "Dimensions", fmt: (p: Product) => p.specs?.dimensions },
    { key: "warranty", label: "Warranty", fmt: (p: Product) => p.specs?.warranty },
    { key: "weight", label: "Weight", fmt: (p: Product) => p.specs?.weight },
  ];

  return (
    <>
      <Seo title="Compare Products" />
      <div className="container-tight py-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">Compare Products</h1>
        <p className="text-muted-foreground mb-6">Up to 4 products side-by-side.</p>
        {!products?.length ? (
          <div className="rounded-lg border border-border p-10 text-center">
            <p className="text-muted-foreground mb-4">No products selected for comparison yet.</p>
            <Button asChild><Link to="/shop">Browse products</Link></Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-4 w-40"></th>
                  {products.map((p) => (
                    <th key={p.id} className="p-4 text-left min-w-[220px]">
                      <div className="aspect-square w-32 bg-background rounded-md overflow-hidden mb-2">
                        {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <Link to={`/product/${p.slug}`} className="font-display font-bold hover:text-accent">{p.name}</Link>
                      {p.price ? (
                        <div className="mt-2 text-xs">
                          <div className="font-semibold text-primary">{formatKES(p.price)}</div>
                          <div className="text-muted-foreground line-through">Market Value {formatKES(getMarketValue(p.price))}</div>
                          <span className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                            Save {getSavePercent(p.price)}%
                          </span>
                        </div>
                      ) : null}
                      <button onClick={() => remove(p.id)} className="block mt-1 text-xs text-muted-foreground hover:text-destructive">
                        <X className="h-3 w-3 inline" /> remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <td className="p-4 font-semibold">{r.label}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-muted-foreground">
                        {(r.fmt ? r.fmt(p) : (p as Product)[r.key as keyof Product]) || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Compare;
