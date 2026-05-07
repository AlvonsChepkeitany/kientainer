import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatKES, formatLiters } from "@/lib/format";

type OrderStatus = {
  id: string;
  public_ref: string;
  status: string;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_price?: string | null;
    capacity_liters?: string | null;
  }>;
};

const TrackOrder = () => {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ref.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: rpcError } = await supabase.rpc("get_order_status", {
        _public_ref: trimmed,
      });
      if (rpcError) throw rpcError;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        setError("No order found for that reference.");
      } else {
        setResult(row as OrderStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Track Order" />
      <div className="container-tight py-12 max-w-2xl">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">Track your order</h1>
        <p className="text-muted-foreground mb-6">Enter your reference code to see status and items.</p>

        <form onSubmit={onSubmit} className="flex gap-3 mb-6">
          <Input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="e.g. A1B2C3D4"
            aria-label="Order reference"
          />
          <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent-glow">
            {loading ? "Checking…" : "Track"}
          </Button>
        </form>

        {error && <div className="text-sm text-destructive mb-4">{error}</div>}

        {result && (
          <div className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Reference</div>
                <div className="font-display font-bold text-lg">{result.public_ref}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="font-semibold capitalize">{result.status}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-semibold">{new Date(result.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="font-display font-bold mb-2">Items</div>
              <ul className="space-y-2 text-sm">
                {result.items.map((i, idx) => {
                  const capacity = i.capacity_liters ? formatLiters(Number(i.capacity_liters)) : "";
                  const unit = i.unit_price ? formatKES(Number(i.unit_price)) : "Contact for price";
                  return (
                    <li key={`${i.name}-${idx}`} className="flex justify-between gap-3">
                      <span>{i.name}{capacity ? ` (${capacity})` : ""} ×{i.quantity}</span>
                      <span className="text-muted-foreground">{unit}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackOrder;
