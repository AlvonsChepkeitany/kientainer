
-- Fix function search_path warnings
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY INVOKER
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Lock down EXECUTE on internal-only function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is used in RLS policies; keep authenticated execute, drop anon
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

-- Tighten quote_requests insert policy with basic validation
DROP POLICY "Anyone can submit a quote" ON public.quote_requests;
CREATE POLICY "Anyone can submit a valid quote" ON public.quote_requests
  FOR INSERT
  WITH CHECK (
    length(customer_name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 255
    AND email LIKE '%@%.%'
    AND length(phone) BETWEEN 5 AND 30
    AND (notes IS NULL OR length(notes) <= 2000)
    AND (address IS NULL OR length(address) <= 500)
    AND (company IS NULL OR length(company) <= 200)
    AND preferred_contact IN ('whatsapp','email','phone')
    AND status = 'new'
  );

DROP POLICY "Anyone can add quote items" ON public.quote_items;
CREATE POLICY "Anyone can add valid quote items" ON public.quote_items
  FOR INSERT
  WITH CHECK (
    quantity BETWEEN 1 AND 10000
    AND EXISTS (SELECT 1 FROM public.quote_requests qr WHERE qr.id = quote_id)
  );
