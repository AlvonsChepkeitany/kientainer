import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/account");
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const fullName = String(fd.get("full_name") ?? "");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account.");
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/account");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Seo title="Sign in" />
      <div className="container-tight py-16 max-w-md">
        <h1 className="font-display font-extrabold text-3xl mb-2">Account access</h1>
        <p className="text-muted-foreground mb-6">Sign in to track your orders.</p>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="si-pw">Password</Label>
                <Input id="si-pw" name="password" type="password" required minLength={6} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-glow">Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="su-name">Full name</Label>
                <Input id="su-name" name="full_name" required />
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="su-pw">Password</Label>
                <Input id="su-pw" name="password" type="password" required minLength={6} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-glow">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>
        <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full">
          Continue with Google
        </Button>
      </div>
    </>
  );
};

export default Auth;
