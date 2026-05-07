import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { ProductCard } from "@/components/ProductCard";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { buildDiscountMap } from "@/lib/pricing";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading } = useProducts({ categorySlug: slug });
  const { data: categories } = useCategories();
  const cat = categories?.find((c) => c.slug === slug);
  const discountMap = useMemo(() => buildDiscountMap(products ?? []), [products]);

  return (
    <>
      <Seo title={cat?.name ?? "Category"} description={cat?.description ?? undefined} />
      <div className="relative bg-primary text-primary-foreground overflow-hidden">
        {cat?.image_url && (
          <img src={cat.image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="relative container-tight py-14">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.25em] mb-2">Category</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl">{cat?.name ?? slug}</h1>
          {cat?.description && <p className="text-primary-foreground/85 max-w-2xl mt-3">{cat.description}</p>}
        </div>
      </div>
      <div className="container-tight py-10">
        {isLoading ? (
          <p>Loading…</p>
        ) : !products?.length ? (
          <p className="text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} p={{ ...p, discountPercent: discountMap[p.id] }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
