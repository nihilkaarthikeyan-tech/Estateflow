import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ptupnaujygyvifnaqqqz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dXBuYXVqeWd5dmlmbmFxcXF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE1NTU1MiwiZXhwIjoyMDk0NzMxNTUyfQ.FJ3F56_PwvFK5FhScXsPTwRktnJ5d_tvnwtqiu8EieM"
);

const ORG_ID = "5b10ad98-26a0-4f4c-80be-93394f5f60a1";

const properties = [
  {
    organization_id: ORG_ID,
    title: "Luxury 3BHK Apartment — Adyar",
    price: 8500000,
    location: "Adyar",
    city: "Chennai",
    description: "Spacious 3BHK apartment in the heart of Adyar with stunning sea view. Modern kitchen, Italian marble flooring, and premium fittings throughout. Located near Adyar Beach and top schools.",
    bedrooms: 3, bathrooms: 2, area: 1650,
    amenities: ["Swimming Pool","Gym","Parking","Security","Power Backup","Lift","CCTV"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "semi_furnished",
  },
  {
    organization_id: ORG_ID,
    title: "Premium 2BHK Flat — Koramangala",
    price: 6500000,
    location: "Koramangala",
    city: "Bangalore",
    description: "Modern 2BHK flat in Koramangala prime location. Walking distance to tech parks and metro station. Fully fitted modular kitchen, wide balcony with city view.",
    bedrooms: 2, bathrooms: 2, area: 1100,
    amenities: ["Gym","Parking","Security","Power Backup","Lift","Club House"],
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "fully_furnished",
  },
  {
    organization_id: ORG_ID,
    title: "4BHK Independent Villa — Jubilee Hills",
    price: 25000000,
    location: "Jubilee Hills",
    city: "Hyderabad",
    description: "Exquisite 4BHK independent villa in Jubilee Hills — Hyderabad's most prestigious address. Private garden, private pool, 3-car parking, fully automated smart home system. Ready to move in.",
    bedrooms: 4, bathrooms: 4, area: 4200,
    amenities: ["Swimming Pool","Gym","Parking","Security","Power Backup","Garden","CCTV"],
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "villa", furnishing: "fully_furnished",
  },
  {
    organization_id: ORG_ID,
    title: "Studio Apartment — Bandra West",
    price: 4500000,
    location: "Bandra West",
    city: "Mumbai",
    description: "Stylish studio apartment in iconic Bandra West. Perfect for working professionals. Fully furnished with designer furniture, high-speed internet, and concierge service.",
    bedrooms: 1, bathrooms: 1, area: 480,
    amenities: ["Parking","Security","Power Backup","Lift","CCTV","Intercom"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "studio", furnishing: "fully_furnished",
  },
  {
    organization_id: ORG_ID,
    title: "2BHK Apartment — Hinjewadi Phase 2",
    price: 5500000,
    location: "Hinjewadi Phase 2",
    city: "Pune",
    description: "Ready-to-move 2BHK apartment opposite major IT parks in Hinjewadi. Vastu-compliant east-facing layout with excellent natural light. Society with all amenities and 24-hour security.",
    bedrooms: 2, bathrooms: 2, area: 920,
    amenities: ["Parking","Security","Power Backup","Lift","Play Area","Jogging Track"],
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "unfurnished",
  },
  {
    organization_id: ORG_ID,
    title: "3BHK Penthouse — Anna Nagar",
    price: 12000000,
    location: "Anna Nagar",
    city: "Chennai",
    description: "Stunning top-floor penthouse in Anna Nagar with 360-degree city views. Private terrace of 800 sq ft, imported flooring, modular kitchen. One-of-a-kind unit.",
    bedrooms: 3, bathrooms: 3, area: 2200,
    amenities: ["Swimming Pool","Gym","Parking","Security","Power Backup","Lift","Club House","Garden","CCTV"],
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "apartment", furnishing: "semi_furnished",
  },
];

const { data, error } = await supabase.from("properties").insert(properties).select();
if (error) console.error("Error:", error.message);
else console.log(`✅ Inserted ${data.length} properties successfully`);
