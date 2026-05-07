import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Order = {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  company: string | null;
  email: string;
  phone: string;
  county: string | null;
  notes: string | null;
  item_count: number;
};

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

const Admin = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

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
      if (isAdmin) loadOrders();
    })();
  }, [navigate]);

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("id, created_at, status, customer_name, company, email, phone, county, notes")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    const { data: itemCounts, error: itemsError } = await supabase
      .from("quote_items")
      .select("quote_id, quantity");
    if (itemsError) toast.error(itemsError.message);

    const countMap = new Map<string, number>();
    (itemCounts ?? []).forEach((i: unknown) => {
      const prev = countMap.get(i.quote_id) ?? 0;
      countMap.set(i.quote_id, prev + (i.quantity ?? 0));
    });

    const mapped = (data as Omit<Order, "item_count">[]).map((o) => ({
      ...o,
      item_count: countMap.get(o.id) ?? 0,
    }));
    setOrders(mapped ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    loadOrders();
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

  return (
    <>
      <Seo title="Admin" />
      <div className="container-tight py-10">
        <h1 className="font-display font-extrabold text-3xl mb-6">Admin · Orders</h1>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Contact</th>
                <th className="p-3">County</th>
                <th className="p-3">Items</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border align-top">
                  <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link to={`/admin/orders/${o.id}`} className="font-semibold hover:text-accent">
                      {o.customer_name}
                    </Link>
                    {o.company && <div className="text-xs text-muted-foreground">{o.company}</div>}
                    {o.notes && <div className="text-xs text-muted-foreground mt-1 max-w-xs">{o.notes}</div>}
                  </td>
                  <td className="p-3 text-xs">
                    <div>{o.email}</div>
                    <div className="text-muted-foreground">{o.phone}</div>
                  </td>
                  <td className="p-3">{o.county}</td>
                  <td className="p-3">{o.item_count}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="Update order status"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admin;
