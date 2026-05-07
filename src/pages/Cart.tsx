import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { useCart } from "@/stores/cart";
import { buildWhatsappLink, buildWhatsappOrderMessage, formatKES } from "@/lib/format";

const Cart = () => {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());

  return (
    <>
      <Seo title="WhatsApp Order" />
      <div className="container-tight py-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">Your WhatsApp Order</h1>
        <p className="text-muted-foreground mb-8">Review items, then place the order directly on WhatsApp.</p>

        {items.length === 0 ? (
          <div className="rounded-lg border border-border p-10 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild><Link to="/shop">Continue shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="rounded-xl border border-border overflow-hidden">
              {items.map((i) => (
                <div key={i.productId} className="flex gap-4 p-4 border-b border-border last:border-0 items-center">
                  <Link to={`/product/${i.slug}`} className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-md overflow-hidden bg-secondary">
                    {i.image && <img src={i.image} alt={i.name} className="w-full h-full object-cover" />}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${i.slug}`} className="font-display font-bold leading-tight hover:text-accent line-clamp-2">{i.name}</Link>
                    <div className="text-xs text-muted-foreground mt-1">{formatKES(i.unitPrice)} each</div>
                    <div className="mt-2 inline-flex items-center border border-border rounded-md">
                      <button
                        onClick={() => setQty(i.productId, i.quantity - 1)}
                        className="px-2 py-1"
                        aria-label={`Decrease ${i.name} quantity`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm min-w-[2.5rem] text-center">{i.quantity}</span>
                      <button
                        onClick={() => setQty(i.productId, i.quantity + 1)}
                        className="px-2 py-1"
                        aria-label={`Increase ${i.name} quantity`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold">{formatKES((i.unitPrice ?? 0) * i.quantity)}</div>
                    <button onClick={() => remove(i.productId)} className="mt-2 text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                      <Trash2 className="h-3.5 w-3.5" /> remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-secondary/40">
                <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">Clear cart</button>
              </div>
            </div>

            <aside className="rounded-xl border border-border p-5 h-fit sticky top-28">
              <h3 className="font-display font-bold text-lg mb-4">Order summary</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Items</span>
                <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Estimated subtotal</span>
                <span className="font-bold">{formatKES(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Final pricing including delivery, installation and bulk discounts will be confirmed on WhatsApp.
              </p>
              <div className="mb-4 rounded-md border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
                We confirm delivery details and final pricing before any payment.
              </div>
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#1faa55] text-white font-bold uppercase">
                <a href={buildWhatsappLink(buildWhatsappOrderMessage(items, subtotal))} target="_blank" rel="noreferrer">
                  Order via WhatsApp →
                </a>
              </Button>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                Prefer to share delivery details first? <Link to="/checkout" className="text-accent hover:underline">Add delivery details</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
