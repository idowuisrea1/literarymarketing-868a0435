DROP POLICY IF EXISTS "anyone can order" ON public.orders;
CREATE POLICY "anyone can order" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (length(trim(name)) BETWEEN 1 AND 120 AND length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(package) BETWEEN 1 AND 100 AND coalesce(length(book_title),0) <= 200 AND coalesce(length(genre),0) <= 100 AND coalesce(length(message),0) <= 3000);
DROP POLICY IF EXISTS "anyone can submit lead" ON public.leads;
CREATE POLICY "anyone can submit lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (length(trim(name)) BETWEEN 1 AND 120 AND length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND coalesce(length(genre),0) <= 100 AND coalesce(length(service),0) <= 100 AND coalesce(length(details),0) <= 3000);
DROP POLICY IF EXISTS "anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');