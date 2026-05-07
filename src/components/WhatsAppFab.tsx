import { MessageCircle } from "lucide-react";
import { buildWhatsappLink, buildWhatsappOrderMessage } from "@/lib/format";
import { useCart } from "@/stores/cart";

export const WhatsAppFab = () => {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const message = buildWhatsappOrderMessage(items, subtotal);

  return (
    <a
      href={buildWhatsappLink(message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      title="We confirm delivery details and final pricing before any payment."
      className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full shadow-[var(--shadow-elevated)] bg-[#25D366] text-white hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
};
