-- =======================================================
-- RECEITA NA MÃO - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- =======================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  dietary_restrictions TEXT[] DEFAULT '{}',
  favorite_categories TEXT[] DEFAULT '{}',
  cooking_time_pref TEXT DEFAULT '30 min',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Utensils',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public readable" ON public.categories FOR SELECT USING (true);

-- 4. RECIPES TABLE
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  source_type TEXT DEFAULT 'manual', -- 'instagram', 'tiktok', 'youtube', 'web', 'manual'
  category TEXT NOT NULL DEFAULT 'Geral',
  difficulty TEXT DEFAULT 'Fácil',   -- 'Fácil', 'Médio', 'Difícil'
  prep_time INT DEFAULT 15,          -- minutes
  cook_time INT DEFAULT 20,          -- minutes
  servings INT DEFAULT 4,
  calories INT DEFAULT 0,
  protein NUMERIC(5,2) DEFAULT 0,
  carbohydrates NUMERIC(5,2) DEFAULT 0,
  fat NUMERIC(5,2) DEFAULT 0,
  fiber NUMERIC(5,2) DEFAULT 0,
  is_estimated_nutrition BOOLEAN DEFAULT TRUE,
  is_imported BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own or public recipes" 
  ON public.recipes FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own recipes" 
  ON public.recipes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" 
  ON public.recipes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" 
  ON public.recipes FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. RECIPE INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  item TEXT NOT NULL,
  amount TEXT DEFAULT '',
  unit TEXT DEFAULT '',
  category TEXT DEFAULT 'Outros', -- 'Hortifruti', 'Carnes', 'Laticínios', 'Mercearia', 'Bebidas', 'Temperos', 'Outros'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read recipe ingredients" 
  ON public.recipe_ingredients FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND (r.user_id = auth.uid() OR r.is_public = true)));

CREATE POLICY "Users can insert recipe ingredients" 
  ON public.recipe_ingredients FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

CREATE POLICY "Users can delete recipe ingredients" 
  ON public.recipe_ingredients FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

-- 6. RECIPE STEPS TABLE
CREATE TABLE IF NOT EXISTS public.recipe_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  duration_minutes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read recipe steps" 
  ON public.recipe_steps FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND (r.user_id = auth.uid() OR r.is_public = true)));

CREATE POLICY "Users can insert recipe steps" 
  ON public.recipe_steps FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));

-- 7. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 8. SHOPPING LIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  recipe_title TEXT DEFAULT '',
  item TEXT NOT NULL,
  amount TEXT DEFAULT '',
  unit TEXT DEFAULT '',
  category TEXT DEFAULT 'Outros',
  bought BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own shopping items" ON public.shopping_list_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shopping items" ON public.shopping_list_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shopping items" ON public.shopping_list_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shopping items" ON public.shopping_list_items FOR DELETE USING (auth.uid() = user_id);

-- 9. MEAL PLANS TABLE
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL, -- 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  custom_title TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meal plans" ON public.meal_plans FOR ALL USING (auth.uid() = user_id);
