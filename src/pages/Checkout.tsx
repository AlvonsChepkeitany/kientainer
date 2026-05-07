import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/stores/cart";
import { buildWhatsappLink, buildWhatsappOrderMessage, formatKES } from "@/lib/format";
import { toast } from "sonner";

const KE_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret/Uasin Gishu", "Kiambu",
  "Machakos", "Kajiado", "Kakamega", "Meru", "Nyeri", "Other",
];

const schema = z.object({
  customer_name: z.string().trim().min(1, "Required").max(200),
  company: z.string().trim().max(200).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Required").max(30),
  county: z.string().trim().min(1, "Required").max(80),
  address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="container-tight py-20 text-center">
        <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
        <Button asChild><Link to="/shop">Browse products</Link></Button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(fd.get("customer_name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      county: String(fd.get("county") ?? ""),
      address: String(fd.get("address") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join(".")] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: quote, error } = await supabase
        .from("quote_requests")
        .insert({
          user_id: user?.id ?? null,
          customer_name: parsed.data.customer_name,
          company: parsed.data.company || null,
          email: parsed.data.email,
          phone: parsed.data.phone,
          county: parsed.data.county,
          address: parsed.data.address || null,
          notes: parsed.data.notes || null,
          preferred_contact: "whatsapp",
        })
        .select("id, public_ref")
        .single();
      if (error) throw error;
      const itemRows = items.map((i) => ({
        quote_id: quote.id,
        product_id: i.productId,
        quantity: i.quantity,
        snapshot: {
          name: i.name,
          slug: i.slug,
          unit_price: i.unitPrice,
          capacity_liters: i.capacityLiters,
          currency: i.currency,
        },
      }));
      const { error: itemsError } = await supabase.from("quote_items").insert(itemRows);
      if (itemsError) throw itemsError;

      const summary = buildWhatsappOrderMessage(items, subtotal, {
        name: parsed.data.customer_name,
        phone: parsed.data.phone,
        county: parsed.data.county,
        address: parsed.data.address,
        notes: parsed.data.notes,
      });
      clear();
      toast.success("Order saved. Opening WhatsApp…");
      window.open(buildWhatsappLink(summary), "_blank", "noopener,noreferrer");
      const ref = (quote as unknown)?.public_ref ?? null;
      navigate(`/order-success?id=${quote.id}${ref ? `&ref=${ref}` : ""}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit quote");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Order Details" />
      <div className="container-tight py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={onSubmit} noValidate>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">Order Details</h1>
          <p className="text-muted-foreground mb-8">Share delivery details so we can confirm totals and availability on WhatsApp.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Full name *</Label>
              <Input id="customer_name" name="customer_name" required maxLength={200} />
              {errors.customer_name && <p className="text-xs text-destructive mt-1">{errors.customer_name}</p>}
            </div>
            <div>
              <Label htmlFor="company">Company (optional)</Label>
              <Input id="company" name="company" maxLength={200} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" required maxLength={30} placeholder="+254..." />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="county">County *</Label>
              <select
                id="county"
                name="county"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
                aria-label="Select county"
              >
                <option value="" disabled>Select county</option>
                {KE_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="address">Delivery address</Label>
              <Input id="address" name="address" maxLength={500} />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={4} maxLength={2000} placeholder="Specific requirements, install date, accessories…" />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-8 bg-accent text-accent-foreground hover:bg-accent-glow font-bold uppercase"
          >
            {submitting ? "Saving…" : "Save Order & Open WhatsApp"}
          </Button>
        </form>

        <aside className="rounded-xl border border-border p-5 h-fit lg:sticky lg:top-28">
          <h3 className="font-display font-bold text-lg mb-4">Your items</h3>
          <ul className="space-y-3 mb-4">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between text-sm gap-3">
                <span className="line-clamp-2">{i.name} <span className="text-muted-foreground">×{i.quantity}</span></span>
                <span className="font-semibold whitespace-nowrap">{formatKES((i.unitPrice ?? 0) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 flex justify-between font-display font-bold">
            <span>Estimated subtotal</span>
            <span>{formatKES(subtotal)}</span>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Checkout;
