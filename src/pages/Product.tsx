import { Link, useParams } from "react-router-dom";
import { ChevronRight, Download, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import { ProductCard } from "@/components/ProductCard";
import { useProduct, useProducts } from "@/hooks/useCatalog";
import { useCart } from "@/stores/cart";
import { formatKES, formatLiters } from "@/lib/format";
import { buildDiscountMap } from "@/lib/pricing";
import { getMarketValue, getSavePercent } from "@/stores/catalog";
import { toast } from "sonner";
import { useMemo, useState } from "react";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useProducts({ featured: true });
  const { data: allProducts } = useProducts();
  const add = useCart((s) => s.add);
  const toggleCompare = useCart((s) => s.toggleCompare);
  const compareIds = useCart((s) => s.compareIds);
  const [qty, setQty] = useState(1);
  const discountMap = useMemo(() => buildDiscountMap(allProducts ?? []), [allProducts]);

  if (isLoading) return <div className="container-tight py-20">Loading…</div>;
  if (!product) return <div className="container-tight py-20">Product not found.</div>;

  const inCompare = compareIds.includes(product.id);
  const image = product.images?.[0];
  const discountPercent = discountMap[product.id];
  const price = product.price ?? null;
  const marketValue = price ? getMarketValue(price) : null;
  const savePercent = price ? getSavePercent(price) : null;

  const onAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: image ?? null,
        capacityLiters: product.capacity_liters,
        unitPrice: product.price,
        currency: product.currency,
      },
      qty
    );
    toast.success(`${product.name} (×${qty}) added to WhatsApp order`);
  };

  const downloadBrochure = () => {
    const text = `KENTAINERS — ${product.name}\n\n${product.description ?? ""}\n\nSpecifications:\n${Object.entries(product.specs || {}).map(([k, v]) => `- ${k}: ${v}`).join("\n")}\n\nPrice: ${formatKES(product.price)}\nContact: sales@kentainers.co.ke`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.slug}-brochure.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Seo
        title={product.name}
        description={product.short_description ?? undefined}
        image={image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: image ? [image] : undefined,
          sku: product.slug,
          brand: { "@type": "Brand", name: "Kentainers" },
          offers: product.price
            ? {
                "@type": "Offer",
                priceCurrency: product.currency,
                price: product.price,
                availability: product.in_stock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              }
            : undefined,
        }}
      />
      <div className="container-tight py-6 text-xs text-muted-foreground flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="container-tight grid lg:grid-cols-2 gap-10 pb-12">
        <div>
          <div className="aspect-square bg-secondary rounded-xl overflow-hidden border border-border">
            {image && (
              <img src={image} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div>
          {product.capacity_liters !== null && (
            <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 mb-3">
              {formatLiters(product.capacity_liters)}
            </span>
          )}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">{product.name}</h1>
          <p className="text-muted-foreground mb-5">{product.short_description}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="font-display font-extrabold text-3xl text-primary">
              {formatKES(price)}
            </div>
            {marketValue && savePercent ? (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground line-through">Market Value {formatKES(marketValue)}</span>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                  Save {savePercent}%
                </span>
              </div>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            We confirm delivery details and final pricing before any payment.
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center border border-border rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 font-bold">−</button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 font-bold">+</button>
            </div>
            <Button onClick={onAdd} size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent-glow font-bold uppercase">
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to WhatsApp Order
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant="outline" onClick={() => toggleCompare(product.id)}>
              <Plus className="h-4 w-4 mr-1" /> {inCompare ? "Added to compare" : "Compare"}
            </Button>
            <Button variant="outline" onClick={downloadBrochure}>
              <Download className="h-4 w-4 mr-1" /> Download brochure
            </Button>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="install">Installation</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </TabsContent>
            <TabsContent value="specs">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <tr key={k} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 capitalize font-semibold w-1/3">{k.replace(/_/g, " ")}</td>
                      <td className="py-2 text-muted-foreground">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="install" className="text-sm leading-relaxed text-muted-foreground">
              Professional installation is available across Kenya. Contact our team via WhatsApp and we'll arrange site survey, foundation prep, and plumbing connections.
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section className="bg-secondary/50 py-14">
        <div className="container-tight">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related?.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} p={{ ...p, discountPercent: discountMap[p.id] }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
