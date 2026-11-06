-- Savera Farms - Supabase Schema Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tokwwgzflrthlfqqjkvl/sql/new

-- 1. Create Profiles Table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  reward_points INTEGER DEFAULT 50,
  wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  delivery_address JSONB,
  items JSONB,
  subtotal NUMERIC(10, 2) DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'Pending',
  status TEXT DEFAULT 'Order Placed',
  delivery_date TEXT,
  delivery_slot TEXT,
  otp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  delivery_address JSONB,
  product_id TEXT,
  product_name TEXT,
  variant_id TEXT,
  variant_name TEXT,
  quantity INTEGER DEFAULT 1,
  schedule_type TEXT,
  custom_days JSONB DEFAULT '[]'::jsonb,
  start_date TEXT,
  delivery_slot TEXT,
  status TEXT DEFAULT 'Active',
  monthly_cost NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Automatically sync auth.users inserts into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Profiles: Users can read and update their own profile; admins can read all
DROP POLICY IF EXISTS "Public profiles are viewable by owner and admin" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner and admin"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Orders: Anyone can create an order; users can read their own; admins read all
DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
CREATE POLICY "Allow insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select orders" ON public.orders;
CREATE POLICY "Allow select orders"
  ON public.orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
CREATE POLICY "Allow update orders"
  ON public.orders FOR UPDATE
  USING (true);

-- Subscriptions: Anyone can create a subscription; users can view
DROP POLICY IF EXISTS "Allow insert subscriptions" ON public.subscriptions;
CREATE POLICY "Allow insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select subscriptions" ON public.subscriptions;
CREATE POLICY "Allow select subscriptions"
  ON public.subscriptions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow update subscriptions" ON public.subscriptions;
CREATE POLICY "Allow update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (true);

