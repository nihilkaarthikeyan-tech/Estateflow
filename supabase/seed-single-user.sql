-- ============================================================
-- EstateFlow AI — UAE Demo Seed Data
-- ============================================================
-- HOW TO USE:
-- 1. Sign up on the app to create your user account
-- 2. Get your user UUID from Supabase → Authentication → Users
-- 3. Replace every 'YOUR_USER_UUID' below with that UUID
-- 4. Run in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Clear existing demo data (safe to re-run)
DELETE FROM public.notifications WHERE message LIKE '%demo%' OR user_id = 'YOUR_USER_UUID';
DELETE FROM public.visits WHERE notes LIKE '%Dubai%' OR notes LIKE '%UAE%';
DELETE FROM public.leads   WHERE phone LIKE '+971%';
DELETE FROM public.properties WHERE created_by = 'YOUR_USER_UUID';


-- ── Properties ──────────────────────────────────────────────

INSERT INTO public.properties
  (title, price, location, city, description, bedrooms, bathrooms, area, status, property_type, furnishing, amenities, created_by)
VALUES

('Emaar Marina Vista — 2BR Sea View',
 2400000, 'Dubai Marina', 'Dubai',
 'Stunning 2-bedroom apartment on the 28th floor of Emaar Marina Vista with direct sea and Marina views. Floor-to-ceiling windows, Italian marble flooring, fully fitted kitchen. Handover Q3 2025. Strong rental demand — 7.4% gross yield. Golden Visa eligible.',
 2, 2, 1340, 'available', 'Apartment', 'Semi-Furnished',
 ARRAY['Infinity Pool','Gym','Concierge','Valet Parking','Private Beach Access','Smart Home','Children Play Area'],
 'YOUR_USER_UUID'),

('DAMAC Maison — Studio Canal View',
 1100000, 'Business Bay', 'Dubai',
 'Luxury serviced studio in DAMAC Maison with Burj Khalifa and canal views. Hotel-branded tower with daily housekeeping, concierge and rooftop pool. Exceptional 8.2% rental yield — most popular short-let configuration in Business Bay.',
 0, 1, 520, 'available', 'Studio', 'Fully Furnished',
 ARRAY['Rooftop Pool','Gym','Concierge','Housekeeping','Valet','Restaurant','Spa'],
 'YOUR_USER_UUID'),

('Sobha Hartland — 3BR Lagoon Villa',
 3800000, 'Mohammed Bin Rashid City', 'Dubai',
 'Spacious 3-bedroom townhouse with private garden and lagoon access in Sobha Hartland. Walk to Hartland International School. Off-plan — payment plan 60/40 with 0% DLD fee offer. 6.1% projected yield on completion.',
 3, 3, 2250, 'upcoming', 'Villa', 'Unfurnished',
 ARRAY['Private Garden','Lagoon Access','Community Pool','Gym','Covered Parking','Smart Home'],
 'YOUR_USER_UUID'),

('Emaar The Address Residences — 2BR Downtown',
 4500000, 'Downtown Dubai', 'Dubai',
 'Hotel-branded 2-bedroom residence in The Address Downtown with iconic Burj Khalifa and Fountain views. Full hotel services included. A-rated investment — consistent 6.8% yield and massive capital appreciation since 2020.',
 2, 2, 1580, 'available', 'Apartment', 'Fully Furnished',
 ARRAY['Infinity Pool','World-Class Spa','Multiple Restaurants','Concierge','Valet','Business Centre','Gym'],
 'YOUR_USER_UUID'),

('Nakheel Palm Signature Villa — 5BR',
 12000000, 'Palm Jumeirah', 'Dubai',
 'Extraordinary 5-bedroom signature villa on the Palm with 24m private pool, 6-car garage and 180° sea views. Private beach. AED 12M — Golden Visa eligible for buyer and family. 4.9% yield, AED 588K/year in rental income. Trophy asset.',
 5, 6, 8500, 'available', 'Villa', 'Fully Furnished',
 ARRAY['Private Pool','Private Beach','Home Cinema','Smart Home','6 Parking Bays','Staff Quarters','Outdoor Kitchen','Lift'],
 'YOUR_USER_UUID'),

('DAMAC Hills — 3BR Park View',
 2200000, 'Dubai Hills', 'Dubai',
 'Ready 3-bedroom apartment in DAMAC Hills 2 with direct Trump International Golf Course views. Master community with 4 pools and 18-hole golf. AED 2.2M — Golden Visa eligible. 6.5% gross yield, AED 143K annual rental.',
 3, 3, 1890, 'available', 'Apartment', 'Semi-Furnished',
 ARRAY['Golf Course','4 Community Pools','Gym','Tennis Courts','Skate Park','Cycling Track','Covered Parking'],
 'YOUR_USER_UUID'),

('Meraas La Mer — 1BR Beachfront',
 1800000, 'Jumeirah Beach Residence', 'Dubai',
 '1-bedroom apartment steps from the beach in Meraas La Mer. Open-plan layout, large terrace, tropical community setting. AED 1.8M — high demand from short-let tourists. 7.8% yield, monthly rental AED 11,700.',
 1, 1, 780, 'available', 'Apartment', 'Fully Furnished',
 ARRAY['Beach Access','Community Pool','Gym','Shops & Dining','Secured Parking','Security'],
 'YOUR_USER_UUID'),

('JVC Smart Studio — Furnished',
 620000, 'Jumeirah Village Circle', 'Dubai',
 'Bright furnished studio in Jumeirah Village Circle. Perfect entry-level investment — AED 620K with 8.5% yield and AED 4,400/month rental. Ideal for young professionals and small families. Ready to move or rent immediately.',
 0, 1, 460, 'available', 'Studio', 'Fully Furnished',
 ARRAY['Communal Pool','Gym','Secured Parking','24hr Security','Broadband'],
 'YOUR_USER_UUID'),

('Emaar Creek Harbour — 2BR Waterfront',
 2100000, 'Dubai Creek Harbour', 'Dubai',
 'Brand-new 2-bedroom apartment in Emaar Creek Harbour — the city''s newest luxury waterfront district. Spectacular Creek Tower views. AED 2.1M — Golden Visa eligible. 5-year payment plan available. Projected 7.1% yield on handover.',
 2, 2, 1220, 'upcoming', 'Apartment', 'Unfurnished',
 ARRAY['Waterfront Promenade','Community Pool','Gym','Retail & Dining','Covered Parking','Smart Home Ready'],
 'YOUR_USER_UUID'),

('Arabian Ranches — 4BR Family Villa',
 5500000, 'Arabian Ranches 3', 'Dubai',
 'Spacious 4-bedroom detached villa in Arabian Ranches 3 with private garden, maid''s room and 2-car garage. Top-rated schools within 5 minutes. AED 5.5M — Golden Visa eligible. Popular long-let community — 5.2% yield, AED 286K/year.',
 4, 5, 4200, 'available', 'Villa', 'Unfurnished',
 ARRAY['Private Garden','Community Pool','Tennis Courts','Equestrian Centre','Cycling Track','2 Car Garage','Maid Room'],
 'YOUR_USER_UUID');


-- ── Leads ────────────────────────────────────────────────────

INSERT INTO public.leads
  (name, phone, email, raw_message, budget, location, property_type, urgency, buyer_intent, summary, status, source, ai_analyzed, notes)
VALUES

('Ahmed Al Mansoori', '+971 50 234 5678', 'ahmed.almansoori@gmail.com',
 'Looking for a 2BR apartment in Dubai Marina or JBR. Budget AED 2.5M. Want something with sea view and good rental yield. Need to decide in the next 3-4 weeks.',
 'AED 2,500,000', 'Dubai Marina', '2BR Apartment',
 'high', 'serious',
 'UAE national buyer — 2BR in Dubai Marina/JBR, AED 2.5M budget, Golden Visa eligible, high urgency',
 'qualified', 'property_finder', true,
 'UAE national investor. Has cash ready, no mortgage needed. Wants 7%+ yield. Golden Visa eligible at this budget.'),

('Omar Al Falasi', '+971 55 876 5432', 'omar.alfalasi@outlook.com',
 'Hi, I want a big villa on Palm Jumeirah or Emirates Hills. Family of 7, need at least 5 bedrooms with private pool. Budget is flexible around AED 10-15M. Serious buyer.',
 'AED 12,000,000', 'Palm Jumeirah', 'Villa',
 'high', 'serious',
 'HNWI UAE national — 5BR+ luxury villa on Palm Jumeirah, AED 10-15M, immediate purchase',
 'site_visit', 'whatsapp', true,
 'Director at government entity. Cash purchase. Has viewed 2 properties elsewhere. Ready to move fast.'),

('Sarah Williams', '+971 52 345 6789', 'sarah.williams@kpmg.ae',
 'British expat, 10 years in Dubai. Looking to buy my first property here. Budget AED 1.8-2.2M. Prefer 1BR or 2BR with good yield as I travel a lot. Business Bay or DIFC area.',
 'AED 2,000,000', 'Business Bay', '1BR or 2BR Apartment',
 'medium', 'serious',
 'British expat buying first Dubai property — 1-2BR in Business Bay/DIFC, AED 2M, yield-focused',
 'contacted', 'bayut', true,
 'Works at KPMG DIFC. Has AED 500K saved, needs mortgage for remainder. Very analytical — wants yield data.'),

('Rajesh Kumar', '+971 56 789 0123', 'rajesh.kumar@tcs.ae',
 'Indian expat living in Dubai 8 years. Looking for 2BHK or 3BHK in JVC or Dubai Hills for my family. Budget around AED 1.5-2M. Kids in school at GEMS nearby. Ready to buy end of this month.',
 'AED 1,800,000', 'Jumeirah Village Circle', '2BR or 3BR Apartment',
 'high', 'serious',
 'Indian expat family buyer — 2-3BR in JVC/Dubai Hills, AED 1.8M, school proximity needed, end-of-month urgency',
 'qualified', 'property_finder', true,
 'Senior manager at TCS. Pre-approved mortgage from Emirates NBD. Kids at GEMS World Academy. Very urgent.'),

('Anna Ivanova', '+971 58 901 2345', 'anna.ivanova@gmail.com',
 'I am from Russia, looking to invest in Dubai. Budget is AED 3-5M. Looking for Golden Visa. Prefer Downtown Dubai or Palm area. Can visit next week.',
 'AED 4,000,000', 'Downtown Dubai', 'Apartment or Villa',
 'high', 'serious',
 'Russian investor, AED 4M budget, Golden Visa goal, Downtown Dubai/Palm, visiting next week',
 'new', 'web_form', true,
 'High-net-worth Russian investor. Primary goal: Golden Visa for family. Wants strong ROI too. Visiting Dubai next week.'),

('Mohammed Al Khalil', '+971 50 567 8901', NULL,
 'Want to buy off-plan in Dubai Creek Harbour or MBR City. Budget AED 2-3M. Payment plan 3-5 years preferred. Emaar projects only.',
 'AED 2,500,000', 'Dubai Creek Harbour', 'Off-Plan Apartment',
 'medium', 'serious',
 'UAE buyer targeting Emaar off-plan in Creek Harbour or MBR City, AED 2.5M, long payment plan',
 'contacted', 'whatsapp', true,
 'Prefers Emaar brand — says trust factor. Wants 5-year post-handover plan. Has 20% down payment ready.'),

('James Mitchell', '+971 54 678 9012', 'j.mitchell@dubaiport.ae',
 'Australian expat, first time buying in Dubai. Looking for studio or 1BR in JBR or Dubai Marina. Budget AED 800K-1.2M. Mainly for investment, currently renting in JLT.',
 'AED 1,100,000', 'Jumeirah Beach Residence', 'Studio or 1BR Apartment',
 'medium', 'researching',
 'Australian expat entry-level investor — studio/1BR in JBR/Marina, AED 1.1M, short-let income focus',
 'new', 'bayut', true,
 'Works at DP World. Has no mortgage yet, checking eligibility. Very interested in short-let Airbnb income model.'),

('Fatima Al Zaabi', '+971 55 234 5678', 'fatima.alzaabi@hotmail.com',
 'I need a nice 3 bedroom apartment in Business Bay for my family. Budget AED 3M. Should have good views of Burj Khalifa. Want to move in within 2 months.',
 'AED 3,000,000', 'Business Bay', '3BR Apartment',
 'high', 'serious',
 'UAE national family buyer — 3BR Business Bay, AED 3M, Burj Khalifa views, 2-month move-in',
 'qualified', 'referral', true,
 'Referred by Omar Al Falasi. Cash buyer. Very specific on Burj view. Two-month deadline is real.'),

('Chen Wei', '+971 52 890 1234', 'chenwei.invest@gmail.com',
 'Chinese investor. I want to buy 2 or 3 properties in Dubai. Budget total AED 6-8M. Golden Visa is very important. Looking in Palm, Downtown, Marina areas.',
 'AED 7,000,000', 'Palm Jumeirah', 'Multiple Properties',
 'high', 'serious',
 'Chinese investor buying multiple properties, AED 7M total, Golden Visa priority, premium areas',
 'contacted', 'web_form', true,
 'Wants to buy 3 properties to qualify family for Golden Visas. Needs Arabic/Chinese language support. Flies in monthly from Shanghai.'),

('Priya Mehta', '+971 56 012 3456', 'priya.mehta@gmail.com',
 'Indian expat, single, looking for a nice 1BR or studio in Dubai Marina or JBR. Budget AED 900K to 1.2M. Good for Airbnb rental when I travel. Need it within 6 weeks.',
 'AED 1,100,000', 'Dubai Marina', '1BR or Studio',
 'medium', 'serious',
 'Indian expat single buyer — 1BR/studio in Dubai Marina/JBR, AED 1.1M, Airbnb investment, 6-week timeline',
 'new', 'property_finder', true,
 'Works in finance at ADCB. Good income, qualifies for mortgage. Travels 40% of time — Airbnb income makes sense.');


-- ── Sample Visits ──────────────────────────────────────────

INSERT INTO public.visits
  (visitor_name, visitor_phone, visitor_email, visit_date, visit_time, status, notes)
VALUES
('Omar Al Falasi',  '+971 55 876 5432', 'omar.alfalasi@outlook.com', '2026-06-03', '10:00', 'scheduled', 'Palm Jumeirah villa viewing — Nakheel Signature 5BR'),
('Ahmed Al Mansoori', '+971 50 234 5678', 'ahmed.almansoori@gmail.com', '2026-06-04', '15:00', 'scheduled', 'Dubai Marina — Emaar Marina Vista 2BR and Meraas La Mer 1BR'),
('Fatima Al Zaabi', '+971 55 234 5678', 'fatima.alzaabi@hotmail.com', '2026-06-05', '11:00', 'scheduled', 'Business Bay — DAMAC Maison 3BR with Burj views');


-- ── Notifications ──────────────────────────────────────────

INSERT INTO public.notifications (user_id, message, type, read, link)
VALUES
('YOUR_USER_UUID', '🔥 New high-intent lead: Ahmed Al Mansoori — "2BR Dubai Marina, AED 2.5M, decide in 3 weeks" — Score 94/100', 'lead', false, '/dashboard/leads'),
('YOUR_USER_UUID', '🏆 Golden Visa buyer: Chen Wei — AED 7M budget, wants 3 properties. Immediate callback needed.', 'lead', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'Site visit confirmed: Omar Al Falasi — Palm Jumeirah villa, 3 June 10:00 AM', 'info', false, '/dashboard/visits'),
('YOUR_USER_UUID', 'Follow up needed: Anna Ivanova — visiting Dubai next week, no response in 24 hrs', 'follow_up', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'AI analyzed 10 new leads — 4 Golden Visa eligible, 3 off-plan buyers identified', 'ai', true, '/dashboard/analytics');
