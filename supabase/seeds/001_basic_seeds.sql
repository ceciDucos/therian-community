
-- Seed Data for TherianCommunity

-- =====================================================
-- PRODUCTS
-- =====================================================
INSERT INTO public.products (name, description, category, price, stock, image_url, is_active)
VALUES 
('Máscara Base Gato', 'Máscara de fieltro y papel maché lista para pintar. Ideal para theriotypes felinos.', 'mascaras', 15.00, 50, 'https://wjoxqfgpqlojgehjzxyp.supabase.co/storage/v1/object/public/products/mask_cat_base.jpg', true),
('Cola de Zorro Sintética', 'Cola de zorro realista hecha de piel sintética de alta calidad. 40cm de largo.', 'colas_orejas', 25.00, 30, 'https://wjoxqfgpqlojgehjzxyp.supabase.co/storage/v1/object/public/products/tail_fox_red.jpg', true),
('Orejas de Lobo', 'Orejas de lobo grises con clip metálico. Hipoalergénicas.', 'colas_orejas', 12.00, 45, 'https://wjoxqfgpqlojgehjzxyp.supabase.co/storage/v1/object/public/products/ears_wolf_grey.jpg', true),
('Cuadernillo de Journaling', 'PDF imprimible para registrar tus shifts, sueños y meditaciones.', 'digitales', 5.00, 999, 'https://wjoxqfgpqlojgehjzxyp.supabase.co/storage/v1/object/public/products/journal_pdf.jpg', true),
('Rodilleras de Práctica', 'Rodilleras acolchadas para practicar quadrobics con seguridad.', 'rodilleras_quadrobics', 18.00, 20, 'https://wjoxqfgpqlojgehjzxyp.supabase.co/storage/v1/object/public/products/kneepads_black.jpg', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- EMBEDDED VIDEOS
-- =====================================================
INSERT INTO public.embedded_videos (platform, video_id, embed_url, title, description)
VALUES
('youtube', 'dQw4w9WgXcQ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Introducción al Therianthropy', 'Un video explicativo sobre los conceptos básicos.'),
('youtube', 'jNQXAC9IVRw', 'https://www.youtube.com/embed/jNQXAC9IVRw', 'Documental: El despertar', 'Historia de la comunidad en los 2000s.')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MODERATION CONFIG (Updates)
-- =====================================================
INSERT INTO public.moderation_config (key, value)
VALUES 
('welcome_message', '"Bienvenido a la comunidad Therian. Por favor respeta a todos."'::jsonb),
('max_reports_threshold', '5'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
