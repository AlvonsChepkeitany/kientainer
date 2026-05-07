type DiscountableProduct = {
  id: string;
  capacity_liters: number | null;
  price: number | null;
  category_id?: string | null;
};

export const buildDiscountMap = (products: DiscountableProduct[]) => {
  const grouped = new Map<string, DiscountableProduct[]>();

  products.forEach((p) => {
    const key = p.category_id ?? "all";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  });

  const discountMap: Record<string, number> = {};

  grouped.forEach((list) => {
    const sorted = list
      .filter((p) => (p.capacity_liters ?? 0) > 0 && (p.price ?? 0) > 0)
      .sort((a, b) => (a.capacity_liters ?? 0) - (b.capacity_liters ?? 0));

    let prevPerLiter: number | null = null;

    sorted.forEach((p) => {
      const capacity = p.capacity_liters ?? 0;
      const price = p.price ?? 0;
      const perLiter = price / capacity;

      if (prevPerLiter && perLiter < prevPerLiter) {
        const discount = Math.round(((prevPerLiter - perLiter) / prevPerLiter) * 100);
        if (discount > 0) discountMap[p.id] = discount;
      }

      prevPerLiter = perLiter;
    });
  });

  return discountMap;
};
