import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Phone, Search, ShoppingCart, User, X, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/stores/cart";
import { COMPANY_EMAIL, COMPANY_PHONE, WHATSAPP_NUMBER, buildWhatsappLink } from "@/lib/format";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/category/water-tanks", label: "Water Tanks" },
  { to: "/category/septic-tanks", label: "Septic Tanks" },
  { to: "/category/agricultural", label: "Agricultural" },
  { to: "/category/silage", label: "Silage" },
  { to: "/category/custom-solutions", label: "Custom Solutions" },
];

export const Header = () => {
  const navigate = useNavigate();
  const totalItems = useCart((s) => s.totalItems());
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Utility top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="container-tight flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="h-3.5 w-3.5" /> {COMPANY_PHONE}
            </a>
            <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="h-3.5 w-3.5" /> {COMPANY_EMAIL}
            </a>
            <span className="flex items-center gap-1.5 text-primary-foreground/80">
              <MapPin className="h-3.5 w-3.5" /> Nairobi · Mombasa · Kisumu
            </span>
          </div>
          <a
            href={buildWhatsappLink("")}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:text-accent-glow"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`bg-background/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[var(--shadow-card)]" : ""
        } border-b border-border`}
      >
        <div className="container-tight flex h-16 items-center gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] sm:w-80 p-0">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img src={logo} alt="Kentainers" className="h-9 w-auto" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="p-2">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-3 text-sm font-semibold ${
                        isActive ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
                <div className="mt-2 border-t border-border pt-2">
                  <NavLink to="/shop" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">All Products</NavLink>
                  <NavLink to="/compare" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">Compare</NavLink>
                  <NavLink to="/cart" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">Cart</NavLink>
                  <NavLink to="/auth" onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">Sign in</NavLink>
                </div>
                <div className="mt-3 px-3">
                  <a href={buildWhatsappLink("")} target="_blank" rel="noreferrer">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent-glow">WhatsApp Us</Button>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Kentainers" className="h-9 sm:h-10 w-auto" width={200} height={50} />
          </Link>

          {/* Search */}
          <form onSubmit={submitSearch} className="flex-1 hidden md:flex items-center max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tanks, capacity (e.g. 5000L), septic..."
                className="pl-9 h-10 rounded-full"
              />
            </div>
          </form>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">
            <Link to="/auth" aria-label="Account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="relative" aria-label="Cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] rounded-full bg-accent text-accent-foreground text-[11px] font-bold grid place-items-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Categories row */}
        <nav className="hidden lg:block border-t border-border">
          <div className="container-tight flex items-center gap-1 h-11 text-sm">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md font-semibold uppercase tracking-wide text-[12px] transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-foreground/80 hover:text-primary"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="ml-auto">
              <Link to="/shop" className="px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary">All Products</Link>
              <Link to="/compare" className="px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary">Compare</Link>
            </div>
          </div>
        </nav>

        {/* Mobile search */}
        <form onSubmit={submitSearch} className="md:hidden container-tight pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="pl-9 h-10 rounded-full"
            />
          </div>
        </form>
      </div>
    </header>
  );
};
