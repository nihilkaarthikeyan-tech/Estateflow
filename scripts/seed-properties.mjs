import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Run: node scripts/seed-properties.mjs
// Set env vars first, or paste values directly for a one-off demo seed.

const properties = [
  {
    title: "Emaar Marina Vista — 2BR Sea View",
    price: 2400000,
    location: "Dubai Marina",
    city: "Dubai",
    description: "Stunning 2-bedroom apartment on the 28th floor with direct sea and Marina views. Floor-to-ceiling windows, Italian marble, fully fitted kitchen. 7.4% gross yield. Golden Visa eligible.",
    bedrooms: 2, bathrooms: 2, area: 1340,
    amenities: ["Infinity Pool","Gym","Concierge","Valet Parking","Private Beach Access","Smart Home"],
    images: ["https://images.unsplash.com/photo-1611577810610-642f8ac05c32?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "semi_furnished",
  },
  {
    title: "DAMAC Maison — Studio Canal View",
    price: 1100000,
    location: "Business Bay",
    city: "Dubai",
    description: "Luxury serviced studio with Burj Khalifa and canal views. Hotel-branded with daily housekeeping, concierge, rooftop pool. 8.2% rental yield — ideal short-let asset.",
    bedrooms: 0, bathrooms: 1, area: 520,
    amenities: ["Rooftop Pool","Gym","Concierge","Housekeeping","Valet","Restaurant","Spa"],
    images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "studio", furnishing: "fully_furnished",
  },
  {
    title: "Sobha Hartland — 3BR Lagoon Villa",
    price: 3800000,
    location: "Mohammed Bin Rashid City",
    city: "Dubai",
    description: "Spacious 3-bedroom townhouse with private garden and lagoon access. Walk to Hartland International School. Off-plan — 60/40 payment plan, 0% DLD fee. 6.1% projected yield.",
    bedrooms: 3, bathrooms: 3, area: 2250,
    amenities: ["Private Garden","Lagoon Access","Community Pool","Gym","Covered Parking","Smart Home"],
    images: ["https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80"],
    status: "upcoming", property_type: "villa", furnishing: "unfurnished",
  },
  {
    title: "Emaar The Address — 2BR Downtown",
    price: 4500000,
    location: "Downtown Dubai",
    city: "Dubai",
    description: "Hotel-branded 2BR residence with iconic Burj Khalifa and Fountain views. Full hotel services. Consistent 6.8% yield, major capital appreciation since 2020. Golden Visa eligible.",
    bedrooms: 2, bathrooms: 2, area: 1580,
    amenities: ["Infinity Pool","World-Class Spa","Multiple Restaurants","Concierge","Valet","Business Centre","Gym"],
    images: ["https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "fully_furnished",
  },
  {
    title: "Nakheel Palm Signature Villa — 5BR",
    price: 12000000,
    location: "Palm Jumeirah",
    city: "Dubai",
    description: "Trophy 5BR villa on the Palm with 24m private pool and 180° sea views. Private beach. 4.9% yield — AED 588K/year rental income. Golden Visa eligible for buyer and entire family.",
    bedrooms: 5, bathrooms: 6, area: 8500,
    amenities: ["Private Pool","Private Beach","Home Cinema","Smart Home","6 Parking Bays","Staff Quarters","Outdoor Kitchen"],
    images: ["https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "villa", furnishing: "fully_furnished",
  },
  {
    title: "Meraas La Mer — 1BR Beachfront",
    price: 1800000,
    location: "Jumeirah Beach Residence",
    city: "Dubai",
    description: "1BR apartment steps from the beach. Open-plan layout, large terrace, tropical community. High short-let demand — 7.8% yield, AED 11,700/month rental. Golden Visa eligible.",
    bedrooms: 1, bathrooms: 1, area: 780,
    amenities: ["Beach Access","Community Pool","Gym","Shops & Dining","Secured Parking","Security"],
    images: ["https://images.unsplash.com/photo-1624317938116-5050f2b0965c?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "fully_furnished",
  },
  {
    title: "Arabian Ranches — 4BR Family Villa",
    price: 5500000,
    location: "Arabian Ranches 3",
    city: "Dubai",
    description: "Spacious 4BR detached villa with private garden, maid's room and 2-car garage. Top schools within 5 mins. Golden Visa eligible. 5.2% yield — AED 286K annual rental.",
    bedrooms: 4, bathrooms: 5, area: 4200,
    amenities: ["Private Garden","Community Pool","Tennis Courts","Equestrian Centre","Cycling Track","2 Car Garage","Maid Room"],
    images: ["https://images.unsplash.com/photo-1543579596-2c11997c7706?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "villa", furnishing: "unfurnished",
  },
];

const { data, error } = await supabase.from("properties").insert(properties).select();
if (error) console.error("Error:", error.message);
else console.log(`✅ Inserted ${data.length} UAE demo properties`);
