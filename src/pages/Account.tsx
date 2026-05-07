import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/format";

type Quote = {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  email: string;
  public_ref: string | null;
};

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<unknown>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/auth");
      else setUser(data.session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("quote_requests")
      .select("id, created_at, status, customer_name, email, public_ref")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setQuotes((data as Quote[]) ?? []));
  }, [user]);

  return (
    <>
      <Seo title="My Account" />
      <div className="container-tight py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl">My Account</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
        <h2 className="font-display font-bold text-xl mb-3">Your orders</h2>
        {quotes.length === 0 ? (
          <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-accent">Browse products</Link>.</p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reference</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-t border-border">
                    <td className="p-3">{new Date(q.created_at).toLocaleDateString()}</td>
                    <td className="p-3 capitalize">{q.status}</td>
                    <td className="p-3 font-mono text-xs">{q.public_ref ?? q.id.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
