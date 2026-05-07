import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveAssets } from "@/lib/assets";
import { getCatalogPrice } from "@/stores/catalog";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  capacity_liters: number | null;
  price: number | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  specs: Record<string, string>;
  images: string[];
  application: string | null;
  color: string | null;
  featured: boolean;
  in_stock: boolean;
};

const mapProduct = (row: unknown): Product => {
  const record = row as Product;
  const overridePrice = getCatalogPrice(record.capacity_liters);

  return {
    ...record,
    images: resolveAssets(record.images ?? []),
    specs: (record.specs ?? {}) as Record<string, string>,
    price: overridePrice ?? record.price,
  };
};

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((c) => ({
        ...c,
        image_url: c.image_url ? resolveAssets([c.image_url])[0] ?? null : null,
      })) as Category[];
    },
  });

export const useProducts = (filters?: {
  categorySlug?: string;
  featured?: boolean;
  q?: string;
}) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase.from("products").select("*, categories!inner(slug)");
      if (filters?.categorySlug) query = query.eq("categories.slug", filters.categorySlug);
      if (filters?.featured) query = query.eq("featured", true);
      if (filters?.q) query = query.ilike("name", `%${filters.q}%`);
      const { data, error } = await query.order("price", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data) : null;
    },
  });

export const useProductsByIds = (ids: string[]) =>
  useQuery({
    queryKey: ["products-by-ids", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
