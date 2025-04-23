-- Create Startups table
CREATE TABLE IF NOT EXISTS "Startups" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL,
  industry TEXT[] NOT NULL,
  description TEXT NOT NULL,
  revenue NUMERIC NOT NULL DEFAULT 0,
  fundraising NUMERIC NOT NULL DEFAULT 0,
  "yearFounded" INTEGER NOT NULL,
  employees INTEGER NOT NULL DEFAULT 0,
  "analysisRating" INTEGER NOT NULL DEFAULT 0,
  "analysisContent" TEXT NOT NULL DEFAULT '',
  "fundingStage" TEXT NOT NULL,
  "productionDevelopmentStage" TEXT NOT NULL,
  "targetMarket" TEXT NOT NULL,
  customers TEXT NOT NULL,
  "ARR" NUMERIC NOT NULL DEFAULT 0,
  "grossMargin" NUMERIC NOT NULL DEFAULT 0,
  logo TEXT NOT NULL DEFAULT '/placeholder.svg?height=80&width=80',
  url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO "Startups" (
  name, country, category, industry, description, revenue, fundraising, 
  "yearFounded", employees, "analysisRating", "analysisContent", 
  "fundingStage", "productionDevelopmentStage", "targetMarket", 
  customers, "ARR", "grossMargin", logo, url
)
VALUES 
(
  'TechInnovate', 'USA', 'SaaS', ARRAY['Technology', 'AI'], 
  'AI-powered business intelligence platform', 2500000, 5000000, 
  2019, 45, 4, 'Strong growth trajectory with innovative product.', 
  'Series A', 'Growth', 'Enterprise', 
  'Fortune 500 companies', 2000000, 0.75, '/placeholder.svg?height=80&width=80', 'https://techinnovate.example.com'
),
(
  'GreenEnergy', 'Germany', 'CleanTech', ARRAY['Energy', 'Sustainability'], 
  'Renewable energy solutions for residential buildings', 1800000, 3500000, 
  2020, 32, 7, 'Promising technology with growing market demand.', 
  'Seed', 'Early Growth', 'Residential', 
  'Homeowners and property developers', 1500000, 0.65, '/placeholder.svg?height=80&width=80', 'https://greenenergy.example.com'
),
(
  'HealthTech', 'UK', 'HealthTech', ARRAY['Healthcare', 'Technology'], 
  'Digital health platform for remote patient monitoring', 3200000, 7500000, 
  2018, 60, 9, 'Market leader with strong product-market fit.', 
  'Series B', 'Scaling', 'Healthcare Providers', 
  'Hospitals and clinics', 3000000, 0.8, '/placeholder.svg?height=80&width=80', 'https://healthtech.example.com'
)
ON CONFLICT (id) DO NOTHING;
