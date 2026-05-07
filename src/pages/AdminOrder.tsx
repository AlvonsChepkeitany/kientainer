import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { formatKES, formatLiters } from "@/lib/format";
import { toast } from "sonner";

type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  company: string | null;
  email: string;
  phone: string;
  county: string | null;
  address: string | null;
  notes: string | null;
  public_ref: string | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  snapshot: {
    name?: string;
    unit_price?: number | null;
    capacity_liters?: number | null;
  };
};

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

const AdminOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const isAdmin = (data ?? []).some((r) => r.role === "admin");
      setAuthorized(isAdmin);
      if (isAdmin && id) loadOrder(id);
    })();
  }, [id, navigate]);

  const loadOrder = async (orderId: string) => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("id, created_at, status, customer_name, company, email, phone, county, address, notes, public_ref")
      .eq("id", orderId)
      .maybeSingle();
    if (error) return toast.error(error.message);
    setOrder(data as OrderRow | null);
    const { data: itemRows, error: itemsError } = await supabase
      .from("quote_items")
      .select("id, quantity, snapshot")
      .eq("quote_id", orderId);
    if (itemsError) return toast.error(itemsError.message);
    setItems((itemRows as OrderItem[]) ?? []);
  };

  const updateStatus = async (status: string) => {
    if (!order) return;
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", order.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setOrder({ ...order, status });
  };

  if (authorized === null) return <div className="container-tight py-20">Checking access…</div>;
  if (!authorized) {
    return (
      <div className="container-tight py-20 max-w-lg">
        <h1 className="font-display font-bold text-2xl mb-2">Admin access required</h1>
        <p className="text-muted-foreground mb-4">
          Your account doesn't have admin privileges. To grant yourself admin access, sign in and add a row in the user_roles table with role=admin for your user id.
        </p>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </div>
    );
  }

  if (!order) return <div className="container-tight py-20">Order not found.</div>;

  return (
    <>
      <Seo title={`Order ${order.public_ref ?? order.id.slice(0, 8)}`} />
      <div className="container-tight py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">Order</p>
            <h1 className="font-display font-extrabold text-3xl">
              {order.public_ref ?? order.id.slice(0, 8)}
            </h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin">Back to orders</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="rounded-xl border border-border p-5">
            <h2 className="font-display font-bold text-lg mb-4">Items</h2>
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3 text-sm">
                  <div>
                    <div className="font-semibold">{i.snapshot?.name ?? "Item"}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.snapshot?.capacity_liters ? formatLiters(i.snapshot.capacity_liters) : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>×{i.quantity}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.snapshot?.unit_price !== undefined && i.snapshot?.unit_price !== null
                        ? formatKES(i.snapshot.unit_price)
                        : "Contact for price"}
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-sm text-muted-foreground">No items found.</div>
              )}
            </div>
          </div>

          <aside className="rounded-xl border border-border p-5 h-fit">
            <h2 className="font-display font-bold text-lg mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Name:</span> {order.customer_name}</div>
              {order.company && <div><span className="text-muted-foreground">Company:</span> {order.company}</div>}
              <div><span className="text-muted-foreground">Email:</span> {order.email}</div>
              <div><span className="text-muted-foreground">Phone:</span> {order.phone}</div>
              {order.county && <div><span className="text-muted-foreground">County:</span> {order.county}</div>}
              {order.address && <div><span className="text-muted-foreground">Address:</span> {order.address}</div>}
              {order.notes && <div><span className="text-muted-foreground">Notes:</span> {order.notes}</div>}
            </div>

            <div className="mt-5">
              <label className="text-xs text-muted-foreground">Status</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Update order status"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default AdminOrder;
