-- Add public order reference and tracking RPC
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS public_ref TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS quote_requests_public_ref_key
  ON public.quote_requests (public_ref);

CREATE OR REPLACE FUNCTION public.generate_order_ref()
RETURNS TEXT
LANGUAGE SQL
VOLATILE
AS $$
  SELECT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
$$;

CREATE OR REPLACE FUNCTION public.set_order_public_ref()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.public_ref IS NULL OR NEW.public_ref = '' THEN
    NEW.public_ref := public.generate_order_ref();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_requests_public_ref ON public.quote_requests;
CREATE TRIGGER trg_quote_requests_public_ref
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_order_public_ref();

CREATE OR REPLACE FUNCTION public.get_order_status(_public_ref TEXT)
RETURNS TABLE (
  id UUID,
  public_ref TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  items JSONB
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    qr.id,
    qr.public_ref,
    qr.status,
    qr.created_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'name', qi.snapshot->>'name',
          'quantity', qi.quantity,
          'unit_price', qi.snapshot->>'unit_price',
          'capacity_liters', qi.snapshot->>'capacity_liters'
        )
      ) FILTER (WHERE qi.id IS NOT NULL),
      '[]'::jsonb
    ) AS items
  FROM public.quote_requests qr
  LEFT JOIN public.quote_items qi ON qi.quote_id = qr.id
  WHERE qr.public_ref = _public_ref
  GROUP BY qr.id, qr.public_ref, qr.status, qr.created_at
$$;

REVOKE EXECUTE ON FUNCTION public.get_order_status(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_status(TEXT) TO anon, authenticated;
