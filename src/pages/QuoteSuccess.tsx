import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { buildWhatsappLink } from "@/lib/format";

const QuoteSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("id");
  const ref = params.get("ref");
  const wa = "Hi Kentainers, I just placed an order and would like to continue on WhatsApp.";
  return (
    <>
      <Seo title="Order saved" />
      <div className="container-tight py-20 max-w-xl text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-accent mb-5" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">Order saved!</h1>
        <p className="text-muted-foreground mb-8">
          Thanks for choosing Kentainers. We'll confirm delivery details and final pricing on WhatsApp before any payment.
        </p>
        {(ref || orderId) && (
          <p className="text-xs text-muted-foreground mb-6">
            Reference: {ref ?? orderId?.slice(0, 8)} · Track anytime at <Link to="/track" className="text-accent hover:underline">/track</Link>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <a href={buildWhatsappLink(wa)} target="_blank" rel="noreferrer">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#1faa55] text-white font-bold uppercase">
              <MessageCircle className="h-4 w-4 mr-2" /> Continue on WhatsApp
            </Button>
          </a>
          <Button asChild size="lg" variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuoteSuccess;
