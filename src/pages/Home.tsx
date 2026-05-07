import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Wrench, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { ProductCard } from "@/components/ProductCard";
import { useCategories, useProducts } from "@/hooks/useCatalog";
import { buildDiscountMap } from "@/lib/pricing";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const SLIDES = [
  {
    img: hero1,
    eyebrow: "Built tough · Built to last",
    title: "Industrial-grade water tanks for every Kenyan home",
    sub: "10-year warranty. UV-stabilized food-grade plastic. Delivered nationwide.",
  },
  {
    img: hero2,
    eyebrow: "Agriculture",
    title: "Power your farm with reliable storage",
    sub: "Bulk irrigation, dosing and silage solutions engineered for productivity.",
  },
  {
    img: hero3,
    eyebrow: "Septic & Industrial",
    title: "Hygienic septic tanks engineered for Kenyan soils",
    sub: "Sealed, leak-proof, easy to install. Ready for residential or commercial.",
  },
];

const Home = () => {
  const { data: categories } = useCategories();
  const { data: featured } = useProducts({ featured: true });
  const { data: allProducts } = useProducts();
  const [idx, setIdx] = useState(0);
  const discountMap = useMemo(() => buildDiscountMap(allProducts ?? []), [allProducts]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Seo
        canonical={typeof window !== "undefined" ? window.location.origin + "/" : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Kentainers",
          url: typeof window !== "undefined" ? window.location.origin : "",
          logo: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "",
          sameAs: [],
        }}
      />

      {/* HERO */}
      <section className="relative h-[68vh] min-h-[480px] max-h-[720px] overflow-hidden bg-primary text-primary-foreground">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={s.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
        ))}
        <div className="relative z-10 container-tight h-full flex flex-col justify-center max-w-3xl">
          <span key={`eb-${idx}`} className="animate-fade-up text-accent text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-4">
            {SLIDES[idx].eyebrow}
          </span>
          <h1 key={`tt-${idx}`} className="animate-fade-up font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5">
            {SLIDES[idx].title}
          </h1>
          <p key={`sb-${idx}`} className="animate-fade-up text-base sm:text-lg text-primary-foreground/85 max-w-xl mb-7">
            {SLIDES[idx].sub}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-glow font-bold uppercase tracking-wide">
              <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold uppercase tracking-wide">
              <Link to="/cart">Order via WhatsApp</Link>
            </Button>
          </div>
        </div>
        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-4 bg-primary-foreground/40"}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
        <div className="container-tight grid grid-cols-2 md:grid-cols-4 gap-px">
          {[
            { icon: ShieldCheck, t: "10-Year Warranty", s: "On all water tanks" },
            { icon: Truck, t: "Free Delivery", s: "Countrywide" },
            { icon: Wrench, t: "Pro Installation", s: "Available nationwide" },
            { icon: Award, t: "KEBS Certified", s: "Quality you can trust" },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3 p-5">
              <span className="grid place-items-center h-10 w-10 rounded-md bg-accent text-accent-foreground shrink-0">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display font-bold text-sm">{t}</div>
                <div className="text-xs text-primary-foreground/70">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-tight py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">Shop by Category</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl">Industrial storage, every shape and size.</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories?.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary hover:shadow-[var(--shadow-elevated)] transition-shadow"
            >
              {c.image_url && (
                <img
                  src={c.image_url}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <h3 className="font-display font-bold text-base sm:text-lg leading-tight">{c.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold mt-1">
                  Browse <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="container-tight">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">Best Sellers</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl">Featured products</h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
              All products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured?.slice(0, 8).map((p) => (
              <ProductCard key={p.id} p={{ ...p, discountPercent: discountMap[p.id] }} />
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE CTA */}
      <section className="container-tight py-16 sm:py-20">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-accent font-bold text-xs uppercase tracking-[0.25em] mb-3">Bulk & Industrial Orders</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">Need a custom industrial solution?</h2>
            <p className="text-primary-foreground/85 mb-7">
              From contractor-grade water reserves to bespoke stainless steel tanks, our engineering team designs storage systems built around your operation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-glow font-bold uppercase">
                <Link to="/cart">Order via WhatsApp</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold uppercase">
                <Link to="/category/custom-solutions">Custom Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWROOMS / MAP */}
      <section className="container-tight pb-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">Visit Us</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4">Showrooms across Kenya</h2>
            <p className="text-muted-foreground mb-6">
              Drop into our nearest showroom in Nairobi, Mombasa or Kisumu to see our products in person and speak to a specialist.
            </p>
            <ul className="space-y-3 text-sm">
              <li><strong>Nairobi (HQ):</strong> Industrial Area, Enterprise Road</li>
              <li><strong>Mombasa:</strong> Mombasa Road, Changamwe</li>
              <li><strong>Kisumu:</strong> Kisumu-Kakamega Road</li>
            </ul>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden border border-border">
            <iframe
              title="Kentainers Nairobi showroom"
              src="https://www.google.com/maps?q=Industrial+Area+Nairobi&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
