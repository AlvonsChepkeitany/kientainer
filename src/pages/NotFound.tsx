import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="container-tight py-24 text-center">
    <p className="text-accent font-bold text-xs uppercase tracking-[0.25em] mb-3">404</p>
    <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-4">Page not found</h1>
    <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
    <Button asChild><Link to="/">Back to home</Link></Button>
  </div>
);

export default NotFound;
