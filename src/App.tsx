import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Compare from "./pages/Compare";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import QuoteSuccess from "./pages/QuoteSuccess";
import TrackOrder from "./pages/TrackOrder";
import AdminOrder from "./pages/AdminOrder";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<QuoteSuccess />} />
            <Route path="/quote-success" element={<QuoteSuccess />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/orders/:id" element={<AdminOrder />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
