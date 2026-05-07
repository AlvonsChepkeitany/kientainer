import { Link } from "react-router-dom";
import { ArrowRight, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { formatKES, formatLiters } from "@/lib/format";
import { getMarketValue, getSavePercent } from "@/stores/catalog";
import { toast } from "sonner";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  capacity_liters: number | null;
  price: number | null;
  currency: string;
  short_description: string | null;
  images: string[];
  discountPercent?: number;
};

export const ProductCard = ({ p }: { p: ProductCardData }) => {
  const add = useCart((s) => s.add);
  const compareIds = useCart((s) => s.compareIds);
  const toggleCompare = useCart((s) => s.toggleCompare);
  const inCompare = compareIds.includes(p.id);
  const image = p.images?.[0] ?? null;
  const price = p.price ?? null;
  const marketValue = price ? getMarketValue(price) : null;
  const savePercent = price ? getSavePercent(price) : null;

  const onAdd = () => {
    add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      image,
      capacityLiters: p.capacity_liters,
      unitPrice: p.price,
      currency: p.currency,
    });
    toast.success(`${p.name} added to WhatsApp order`);
  };

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow">
      {p.capacity_liters !== null && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-wider px-2.5 py-1">
          {formatLiters(p.capacity_liters)}
        </span>
      )}
      <Link to={`/product/${p.slug}`} className="relative block aspect-square bg-secondary overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={p.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs">No image</div>
        )}
      </Link>
      <div className="flex-1 p-4 flex flex-col gap-2">
        <Link to={`/product/${p.slug}`}>
          <h3 className="font-display font-bold text-base leading-snug line-clamp-2 hover:text-accent transition-colors">{p.name}</h3>
        </Link>
        {p.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{p.short_description}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="font-display font-extrabold text-lg text-primary">
              {formatKES(price)}
            </div>
            {marketValue && savePercent ? (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-muted-foreground line-through">Market Value {formatKES(marketValue)}</span>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                  Save {savePercent}%
                </span>
              </div>
            ) : null}
          </div>
          <button
            onClick={() => toggleCompare(p.id)}
            className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded border ${
              inCompare ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            <Plus className="h-3 w-3 inline -mt-0.5" /> {inCompare ? "Added" : "Compare"}
          </button>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={onAdd} className="flex-1 bg-primary hover:bg-primary-glow">
            <ShoppingCart className="h-4 w-4 mr-1.5" /> Add
          </Button>
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link to={`/product/${p.slug}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};
