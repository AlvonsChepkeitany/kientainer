import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { COMPANY_EMAIL, COMPANY_PHONE, buildWhatsappLink } from "@/lib/format";
import logo from "@/assets/logo.png";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container-tight py-14 grid gap-10 md:grid-cols-4">
      <div>
        <img src={logo} alt="Kentainers" className="h-10 w-auto bg-background rounded-md p-1 mb-4" />
        <p className="text-sm text-primary-foreground/80 max-w-xs">
          Kenya's trusted industrial storage solutions partner. Built tough, built to last.
        </p>
      </div>
      <div>
        <h3 className="font-display font-bold uppercase tracking-wider text-accent mb-4 text-sm">Shop</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/category/water-tanks" className="hover:text-accent">Water Tanks</Link></li>
          <li><Link to="/category/septic-tanks" className="hover:text-accent">Septic Tanks</Link></li>
          <li><Link to="/category/agricultural" className="hover:text-accent">Agricultural</Link></li>
          <li><Link to="/category/silage" className="hover:text-accent">Silage</Link></li>
          <li><Link to="/category/custom-solutions" className="hover:text-accent">Custom Solutions</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-display font-bold uppercase tracking-wider text-accent mb-4 text-sm">Company</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/shop" className="hover:text-accent">All Products</Link></li>
          <li><Link to="/compare" className="hover:text-accent">Compare</Link></li>
          <li><Link to="/cart" className="hover:text-accent">WhatsApp Order</Link></li>
          <li><Link to="/track" className="hover:text-accent">Track Order</Link></li>
          <li><Link to="/auth" className="hover:text-accent">Sign in</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-display font-bold uppercase tracking-wider text-accent mb-4 text-sm">Contact</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" /><a href={`tel:${COMPANY_PHONE}`}>{COMPANY_PHONE}</a></li>
          <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent" /><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></li>
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /><span>Industrial Area, Nairobi, Kenya</span></li>
        </ul>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-5 w-5" /></a>
          <a href="#" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-5 w-5" /></a>
          <a href="#" aria-label="Twitter" className="hover:text-accent"><Twitter className="h-5 w-5" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/15">
      <div className="container-tight py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-foreground/70 gap-2">
        <p>© {new Date().getFullYear()} Kentainers. All rights reserved.</p>
        <p>Built tough in Kenya · WhatsApp <a className="text-accent hover:underline" href={buildWhatsappLink("")}>{COMPANY_PHONE}</a></p>
      </div>
    </div>
  </footer>
);
