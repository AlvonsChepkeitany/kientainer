export const formatKES = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "Contact for price";
  return `Ksh ${value.toLocaleString("en-KE")}`;
};

export const formatLiters = (l: number | null | undefined) => {
  if (l === null || l === undefined) return "";
  if (l >= 1000) return `${(l / 1000).toLocaleString()},000L`.replace(",000,000L", "M L");
  return `${l}L`;
};

// WhatsApp number for Kentainers (local format for display)
export const WHATSAPP_NUMBER = "0785152927";
export const COMPANY_PHONE = "0785 152 927";
export const COMPANY_EMAIL = "sales@kentainers.co.ke";

const normalizeKenyanNumber = (value: string) =>
  value.startsWith("0") ? `254${value.slice(1)}` : value;

export const buildWhatsappLink = (text: string) =>
  `https://wa.me/${normalizeKenyanNumber(WHATSAPP_NUMBER)}?text=${encodeURIComponent(text)}`;

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number | null;
  capacityLiters: number | null;
};

type OrderDetails = {
  name?: string;
  phone?: string;
  county?: string;
  address?: string;
  notes?: string;
};

export const buildWhatsappOrderMessage = (
  items: OrderItem[],
  subtotal: number,
  details?: OrderDetails
) => {
  if (items.length === 0) return "Hi Kentainers, I'd like to place an order.";
  const lines = items.map((i) => {
    const capacity = i.capacityLiters ? ` (${formatLiters(i.capacityLiters)})` : "";
    const lineTotal = formatKES((i.unitPrice ?? 0) * i.quantity);
    return `• ${i.name}${capacity} ×${i.quantity} — ${lineTotal}`;
  });
  const detailLines = [] as string[];
  if (details?.name) detailLines.push(`Name: ${details.name}`);
  if (details?.phone) detailLines.push(`Phone: ${details.phone}`);
  if (details?.county) detailLines.push(`County: ${details.county}`);
  if (details?.address) detailLines.push(`Address: ${details.address}`);
  if (details?.notes) detailLines.push(`Notes: ${details.notes}`);

  return [
    "Hi Kentainers, I'd like to order:",
    ...lines,
    `Subtotal: ${formatKES(subtotal)}`,
    ...(detailLines.length ? ["", ...detailLines] : []),
    "Please confirm total with delivery.",
    "We confirm delivery details and final pricing before any payment.",
  ].join("\n");
};
