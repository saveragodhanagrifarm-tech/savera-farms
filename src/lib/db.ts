import {
  Product,
  MilkSubscription,
  Order,
  BatchItem,
  ProductionRecord,
  RawMaterial,
  Supplier,
  PurchaseOrder,
  DeliveryZone,
  Coupon,
  CustomerProfile,
  Review,
  SupportTicket,
  AuditLog,
  BlogPost,
} from '@/types';

// Mock Seed Data for Savera Farms D2C Platform

export const SEED_PRODUCTS: Product[] = [
  // --- SAVERA SIGNATURE ORGANIC & HERBAL RANGE ---
  {
    id: 'prod-rog-nasak-chai',
    name: 'Rog Nasak Chai',
    tagline: 'A comforting, traditional herbal tea blend.',
    category: 'Herbal & Wellness',
    subcategory: 'Herbal Tea',
    description: 'A comforting, traditional herbal tea blend crafted from hand-picked botanical herbs, sacred tulsi, mulethi, dry ginger, cinnamon, and whole spices. Soothing for the throat, supports healthy respiration, and promotes gentle daily detoxification.',
    ingredients: ['Holy Basil (Tulsi)', 'Mulethi (Licorice)', 'Dry Ginger (Sonth)', 'Cinnamon', 'Black Pepper', 'Green Cardamom', 'Clove'],
    nutritionalInfo: [
      { label: 'Serving Size', value: '1 Cup (2g blend)' },
      { label: 'Caffeine', value: '0 mg (Naturally Caffeine-Free)' },
      { label: 'Antioxidants', value: 'High Polyphenols' },
    ],
    storageInstructions: 'Store in an airtight jar in a cool, dry place away from moisture.',
    shelfLife: '12 Months from packaging.',
    manufacturingInfo: 'Savera Botanical Apothecary, Organic Estates.',
    origin: 'Himalayan Foothills & Organic Estates',
    benefits: [
      'Supports seasonal immunity & respiratory comfort',
      'Naturally caffeine-free & deeply warming',
      'Rich in botanical bio-actives & phytonutrients',
      'Aids healthy digestion after meals',
    ],
    howItIsMade: [
      '01. Ethically hand-harvested wild tulsi, roots, and spices',
      '02. Slow shade-drying to preserve volatile therapeutic oils',
      '03. Coarse stone-blending in small artisan batches',
      '04. Packed in aroma-seal containers to preserve freshness',
    ],
    faqs: [
      {
        question: 'How should I brew Rog Nasak Chai?',
        answer: 'Simmer 1 tsp of tea in 1.5 cups of fresh water for 3 to 5 minutes. Strain and enjoy warm. Sweeten with Savera Desi Khand or raw honey if desired.',
      },
    ],
    images: [
      '/images/rog-nasak-chai.png',
    ],
    variants: [
      { id: 'var-rnc-100g', name: '100g Pouch', price: 180, mrp: 210, discountPct: 14, stock: 150, sku: 'SAV-TEA-RNC-100G', weightVolume: '100 g' },
      { id: 'var-rnc-250g', name: '250g Glass Jar', price: 390, mrp: 460, discountPct: 15, stock: 80, sku: 'SAV-TEA-RNC-250G', weightVolume: '250 g' },
    ],
    rating: 4.9,
    reviewCount: 148,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-face-pack-powder',
    name: 'Face Pack Powder',
    tagline: 'A botanical powder for a simple skincare ritual.',
    category: 'Personal Care',
    subcategory: 'Skincare Rituals',
    description: 'A botanical powder for a simple skincare ritual. Sun-dried Multani Mitti, sandalwood, wild Kasturi turmeric, crushed neem, and fragrant rose petals finely ground into an ultra-smooth botanical dust. Gently lifts deep impurities and reveals a soft, luminous complexion.',
    ingredients: ["Fuller's Earth (Multani Mitti)", 'Sandalwood Powder (Chandan)', 'Kasturi Manjal (Wild Turmeric)', 'Dried Damask Rose Petals', 'Neem Leaf Powder'],
    nutritionalInfo: [
      { label: 'Composition', value: '100% Pure Herbs & Clays' },
      { label: 'Chemicals / Parabens', value: '0%' },
    ],
    storageInstructions: 'Keep lid tightly closed. Avoid contact with wet fingers or spoons.',
    shelfLife: '18 Months from packaging.',
    manufacturingInfo: 'Savera Natural Skincare Workshop.',
    origin: 'Savera Organic Estates',
    benefits: [
      'Draws out environmental impurities and excess sebum',
      'Soothes blemishes, sun tan, and redness naturally',
      'Tightens open pores and refines skin texture',
      'Zero synthetic fragrances, colors, or preservatives',
    ],
    howItIsMade: [
      '01. Sun-cured pure clay and shade-dried medicinal herbs',
      '02. Slow cold-pulverizing through traditional stone mills',
      '03. Triple-sifted for silk-smooth texture on delicate skin',
    ],
    faqs: [
      {
        question: 'How should I apply this Face Pack Powder?',
        answer: 'Mix 1 tablespoon with Savera Gulab Jal (for normal/oily skin) or raw A2 milk/curd (for dry skin). Apply evenly, allow to dry for 10-12 minutes, and rinse with cool water.',
      },
    ],
    images: [
      '/images/face-pack-powder.png',
    ],
    variants: [
      { id: 'var-fpp-100g', name: '100g Jar', price: 220, mrp: 260, discountPct: 15, stock: 110, sku: 'SAV-SKIN-FPP-100G', weightVolume: '100 g' },
      { id: 'var-fpp-200g', name: '200g Eco Refill', price: 380, mrp: 450, discountPct: 16, stock: 75, sku: 'SAV-SKIN-FPP-200G', weightVolume: '200 g' },
    ],
    rating: 4.88,
    reviewCount: 96,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-gud-chana',
    name: 'Gud Chana',
    tagline: 'Jaggery and roasted gram, a wholesome classic.',
    category: 'Traditional Staples',
    subcategory: 'Wholesome Snacks',
    description: 'Jaggery and roasted gram, a wholesome classic. Crunchy golden roasted chickpeas lovingly enrobed in mineral-rich, unrefined sugarcane jaggery. An age-old Indian post-meal crunch that naturally replenishes iron, fuels active stamina, and settles hunger pangs.',
    ingredients: ['Roasted Desi Bengal Gram (Chana)', 'Organic Desi Gur (Sugarcane Jaggery)', 'Pinch of Sendha Namak (Rock Salt)'],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '385 kcal' },
      { label: 'Plant Protein', value: '14.2 g' },
      { label: 'Dietary Fiber', value: '8.5 g' },
      { label: 'Iron', value: 'Natural High Source' },
    ],
    storageInstructions: 'Store in an airtight container to maintain crispness.',
    shelfLife: '6 Months from packaging.',
    manufacturingInfo: 'Savera Traditional Kitchens.',
    origin: 'Savera Partner Organic Farms',
    benefits: [
      'Excellent natural source of plant protein and dietary iron',
      'Naturally sweetened with organic jaggery without white sugar',
      'Wholesome, guilt-free snacking for kids and adults alike',
      'Helps maintain energy and supports healthy hemoglobin',
    ],
    howItIsMade: [
      '01. Selected premium indigenous Bengal gram slow-roasted in sand',
      '02. Molten pure organic jaggery gently enrobing every chickpea',
      '03. Naturally cooled and sealed in moisture-proof pouches',
    ],
    faqs: [
      {
        question: 'Is any refined sugar or oil used?',
        answer: 'None at all. It is made purely from dry roasted chickpeas and organic sugarcane jaggery.',
      },
    ],
    images: [
      '/images/gud-chana.png',
    ],
    variants: [
      { id: 'var-gc-250g', name: '250g Kraft Pouch', price: 110, mrp: 130, discountPct: 15, stock: 200, sku: 'SAV-SNK-GC-250G', weightVolume: '250 g' },
      { id: 'var-gc-500g', name: '500g Kraft Pouch', price: 210, mrp: 250, discountPct: 16, stock: 140, sku: 'SAV-SNK-GC-500G', weightVolume: '500 g' },
    ],
    rating: 4.92,
    reviewCount: 180,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-chawanprash',
    name: 'Chawanprash',
    tagline: 'A traditional herbal fruit preserve.',
    category: 'Herbal & Wellness',
    subcategory: 'Ayurvedic Rasayana',
    description: 'A traditional herbal fruit preserve made according to Charaka Samhita guidelines. Fresh forest Amla (Indian gooseberry) slow-cooked with pure A2 Bilona Cow Ghee, raw honey, and an infusion of over 40 revitalizing Ayurvedic roots, berries, and herbs. A daily spoon of deep cellular vigor.',
    ingredients: ['Fresh Organic Amla', 'A2 Desi Cow Bilona Ghee', 'Raw Unfiltered Honey', 'Ashwagandha', 'Shatavari', 'Pippali', 'Guduchi', 'Brahmi', 'Cardamom', 'Desi Khand'],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '310 kcal' },
      { label: 'Natural Vitamin C', value: 'High Bioavailable' },
      { label: 'Antioxidants', value: 'Rich Ayurvedic Polyphenols' },
    ],
    storageInstructions: 'Store in a cool, dry place. Use a clean dry spoon.',
    shelfLife: '24 Months from packaging.',
    manufacturingInfo: 'Savera Ayurvedic Apothecary.',
    origin: 'Savera Farms & Forest Gatherings',
    benefits: [
      'Fortifies immunity and seasonal resilience for all ages',
      'Enhances lung capacity, respiratory stamina, and energy',
      'Nourishes brain tissues, memory, and digestive agni',
      'Cooked in pure A2 Bilona Ghee and sweetened with Desi Khand',
    ],
    howItIsMade: [
      '01. Fresh amla steamed and seed-removed by hand',
      '02. Slow roasted in brass cauldrons with pure A2 cow ghee',
      '03. Infused with decoctions of 40+ wild-harvested herbs',
      '04. Finished with raw honey and aromatic forest spices',
    ],
    faqs: [
      {
        question: 'What is the recommended daily dosage?',
        answer: 'Take 1 teaspoon twice daily with warm A2 milk or lukewarm water, ideally morning and evening.',
      },
    ],
    images: [
      '/images/chawanprash.png',
    ],
    variants: [
      { id: 'var-chw-500g', name: '500g Glass Jar', price: 440, mrp: 520, discountPct: 15, stock: 90, sku: 'SAV-WELL-CHW-500G', weightVolume: '500 g' },
      { id: 'var-chw-1kg', name: '1 kg Glass Jar', price: 820, mrp: 980, discountPct: 16, stock: 60, sku: 'SAV-WELL-CHW-1KG', weightVolume: '1 kg' },
    ],
    rating: 4.95,
    reviewCount: 230,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-bamboo-toothbrush',
    name: 'Bamboo Toothbrush',
    tagline: 'A bamboo-handled brush for a more natural routine.',
    category: 'Personal Care',
    subcategory: 'Eco Oral Care',
    description: 'A bamboo-handled brush for a more natural routine. Ergonomically carved from fast-growing, pesticide-free wild bamboo with soft, BPA-free bristles infused with activated charcoal. Gently massages sensitive gums, sweeps away surface stains, and reduces single-use plastic waste.',
    ingredients: ['100% Biodegradable Moso Bamboo Handle', 'Soft Charcoal-Infused Nylon-4 Bristles'],
    nutritionalInfo: [
      { label: 'Material', value: '100% Biodegradable Bamboo' },
      { label: 'Bristles', value: 'Soft Charcoal Infused' },
    ],
    storageInstructions: 'Rinse thoroughly after use and store upright in an open, dry holder.',
    shelfLife: 'Recommended replacement every 2 to 3 months.',
    manufacturingInfo: 'Savera Sustainable Living Initiatives.',
    origin: 'Sustainably Managed Bamboo Forests',
    benefits: [
      '100% Compostable ergonomic handle helps eliminate plastic waste',
      'Charcoal-infused bristles gently whiten and absorb odor',
      'Soft bristles protect tooth enamel and delicate gums',
      'Naturally antimicrobial and water-repellent surface',
    ],
    howItIsMade: [
      '01. Ethically harvested wild bamboo poles precision carved',
      '02. Thermal heat-carbonized to resist moisture and mildew',
      '03. High-density bristle planting with non-toxic anchors',
    ],
    faqs: [
      {
        question: 'How do I dispose of the bamboo toothbrush?',
        answer: 'Pluck the bristles with pliers for plastic recycling, and place the 100% bamboo handle into your home garden compost or soil.',
      },
    ],
    images: [
      '/images/bamboo-toothbrush.png',
    ],
    variants: [
      { id: 'var-bt-1pc', name: 'Single Brush', price: 85, mrp: 110, discountPct: 23, stock: 350, sku: 'SAV-CARE-BT-1PC', weightVolume: '1 Piece' },
      { id: 'var-bt-pack4', name: 'Family Pack of 4', price: 290, mrp: 380, discountPct: 24, stock: 180, sku: 'SAV-CARE-BT-4PK', weightVolume: 'Pack of 4' },
    ],
    rating: 4.85,
    reviewCount: 88,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    id: 'prod-gau-gobar-diya',
    name: 'Gau Gobar Diya',
    tagline: 'A handcrafted diya for a mindful, natural glow.',
    category: 'Mindful Living',
    subcategory: 'Pooja & Rituals',
    description: 'A handcrafted diya for a mindful, natural glow. Meticulously shaped by rural artisans using sacred Desi cow dung (Gomaya), blended with natural clay and purifying herbs. As the diya burns down with Savera Ghee or oil, it releases a sacred, havan-like purifying fragrance that cleanses the ambient atmosphere.',
    ingredients: ['Pure Desi Cow Dung (Gomaya)', 'Natural Earthen Clay', 'Guggul', 'Camphor Botanicals', 'Neem Leaves'],
    nutritionalInfo: [
      { label: 'Nature', value: '100% Biodegradable & Organic' },
      { label: 'Ash', value: 'Acts as Organic Garden Fertilizer' },
    ],
    storageInstructions: 'Store in a dry box away from water until ready to light.',
    shelfLife: 'Indefinite when kept dry.',
    manufacturingInfo: 'Savera Goshala & Rural Women Self-Help Artisan Collective.',
    origin: 'Savera Gaushala & Rural Craft Centers',
    benefits: [
      'Empowers village women artisans with dignified fair-trade livelihoods',
      'Releases natural havan aroma and negative ions when illuminated',
      'Entirely zero-waste: burned ashes nourish potted garden plants',
      '100% free from chemical paints, synthetic binders, or plastics',
    ],
    howItIsMade: [
      '01. Pure Gomaya from indigenous Desi cows collected fresh',
      '02. Blended with sun-dried clay, crushed guggul, and neem',
      '03. Hand-pressed into traditional diya moulds and sun-baked for 5 days',
    ],
    faqs: [
      {
        question: 'Does the diya itself burn completely?',
        answer: 'Yes! Once the ghee or oil burns down, the organic herbal diya base slowly smolders like sacred dhoop, purifying the air without black smoke.',
      },
    ],
    images: [
      '/images/gau-gobar-diya.png',
    ],
    variants: [
      { id: 'var-ggd-12pc', name: 'Box of 12 Diyas', price: 120, mrp: 150, discountPct: 20, stock: 240, sku: 'SAV-POOJ-GGD-12', weightVolume: 'Pack of 12' },
      { id: 'var-ggd-31pc', name: 'Festive Box of 31 Diyas', price: 270, mrp: 350, discountPct: 23, stock: 130, sku: 'SAV-POOJ-GGD-31', weightVolume: 'Pack of 31' },
    ],
    rating: 4.96,
    reviewCount: 156,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-sea-buckthorn',
    name: 'Sea Buckthorn',
    tagline: 'A botanical oil for your everyday care ritual.',
    category: 'Herbal & Wellness',
    subcategory: 'Botanical Oils',
    description: 'A botanical oil for your everyday care ritual. Sourced from pristine wild berry bushes of Ladakh at high altitude. Cold-extracted to retain its vibrant amber hue, this miraculous berry oil provides a rare balance of Omega 3, 6, 9, and the elusive Omega-7 (Palmitoleic acid) for deep cellular barrier hydration and youthful radiance.',
    ingredients: ['100% Pure Cold-Pressed Wild Himalayan Sea Buckthorn Seed & Berry Oil'],
    nutritionalInfo: [
      { label: 'Omega Fatty Acids', value: 'Omega 3, 6, 7 & 9 Balanced' },
      { label: 'Vitamin E & Carotenoids', value: 'Potent Natural Antioxidants' },
    ],
    storageInstructions: 'Store in amber glass dropper bottle in a cool place away from direct sunlight.',
    shelfLife: '18 Months from packaging.',
    manufacturingInfo: 'Savera High-Altitude Botanical Laboratories.',
    origin: 'Ladakh High-Altitude Himalayan Region',
    benefits: [
      'Rare natural plant source of restorative Omega-7 fatty acids',
      'Protects against environmental stress, UV exposure, and free radicals',
      'Deeply nourishes parched skin, strengthening the lipid barrier',
      'Versatile: apply topically for glowing skin or take as a wellness drops',
    ],
    howItIsMade: [
      '01. Wild sea buckthorn berries hand-picked in Ladakh valleys',
      '02. Cold-centrifugal separation below 35°C without chemical solvents',
      '03. Filled in UV-protective amber glass droppers',
    ],
    faqs: [
      {
        question: 'Can I apply this on my face directly?',
        answer: 'Yes! Warm 2 to 3 drops between your palms and gently press onto clean face and neck before bedtime.',
      },
    ],
    images: [
      '/images/sea-buckthorn.png',
    ],
    variants: [
      { id: 'var-sbt-30ml', name: '30 ml Dropper Bottle', price: 590, mrp: 720, discountPct: 18, stock: 85, sku: 'SAV-WELL-SBT-30ML', weightVolume: '30 ml' },
      { id: 'var-sbt-100ml', name: '100 ml Glass Bottle', price: 1450, mrp: 1800, discountPct: 19, stock: 40, sku: 'SAV-WELL-SBT-100ML', weightVolume: '100 ml' },
    ],
    rating: 4.91,
    reviewCount: 72,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    id: 'prod-himalayan-shilajit',
    name: 'Himalayan Shilajit',
    tagline: 'A traditional mountain-sourced resin.',
    category: 'Herbal & Wellness',
    subcategory: 'Mountain Resins',
    description: 'A traditional mountain-sourced resin gathered from high-altitude Himalayan rock cliffs (above 16,000 feet). Slow-purified using traditional Shodhana (water and triphala decantation) to guarantee supreme grade, potency, and purity. Contains >75% Fulvic Acid and over 84 ionic trace minerals for sustained stamina, energy, and cognitive vitality.',
    ingredients: ['100% Pure Himalayan Shodhit Shilajit Resin (Gold Grade)'],
    nutritionalInfo: [
      { label: 'Fulvic Acid Content', value: '> 75% Lab Certified' },
      { label: 'Trace Minerals', value: '84+ Ionic Minerals' },
    ],
    storageInstructions: 'Store at room temperature with lid sealed. If resin hardens in winter, warm jar in warm water.',
    shelfLife: '36 Months from packaging.',
    manufacturingInfo: 'Savera Himalayan Wellness Division.',
    origin: 'High Himalayan Peaks (16,000+ ft)',
    benefits: [
      'Dramatically elevates cellular ATP energy and physical stamina',
      'Supports cognitive sharpness, mental focus, and stress adaptation',
      'High fulvic acid content enhances bioavailability of all daily nutrients',
      'Purified by traditional Shodhana and tested for zero heavy metals',
    ],
    howItIsMade: [
      '01. Raw rock exudate gathered by local tribes from Himalayan cliffs',
      '02. Multi-stage filtration with pure mountain spring water & Triphala',
      '03. Traditional sun-drying (Surya Tapi) until thick, pure resin forms',
    ],
    faqs: [
      {
        question: 'How do I take Himalayan Shilajit?',
        answer: 'Dissolve a pea-sized amount (300-500mg) using the included spatula in a cup of lukewarm A2 milk or water. Drink on an empty stomach in the morning.',
      },
    ],
    images: [
      '/images/himalayan-shilajit.png',
    ],
    variants: [
      { id: 'var-shl-20g', name: '20g Glass Jar + Spatula', price: 950, mrp: 1250, discountPct: 24, stock: 95, sku: 'SAV-WELL-SHL-20G', weightVolume: '20 g' },
      { id: 'var-shl-50g', name: '50g Glass Jar + Spatula', price: 1999, mrp: 2600, discountPct: 23, stock: 50, sku: 'SAV-WELL-SHL-50G', weightVolume: '50 g' },
    ],
    rating: 4.97,
    reviewCount: 310,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-kashmiri-kesar',
    name: 'Kashmiri Kesar',
    tagline: 'Aromatic saffron threads, cherished in every pinch.',
    category: 'Herbal & Wellness',
    subcategory: 'Exotic Spices',
    description: 'Aromatic saffron threads, cherished in every pinch. Pure Grade-A Mongra saffron hand-harvested from the purple crocus blooms of Pampore, Kashmir. Revered for its deep crimson color, potent crocin levels, intoxicating aroma, and culinary & medicinal purity.',
    ingredients: ['100% Pure Kashmiri Mongra Saffron Stigmas (Grade A)'],
    nutritionalInfo: [
      { label: 'Grade', value: 'Pure Mongra (Grade A1)' },
      { label: 'Crocin (Color Reading)', value: '> 220 (Premium Standard)' },
    ],
    storageInstructions: 'Store in an airtight glass vial away from heat and light.',
    shelfLife: '24 Months from packaging.',
    manufacturingInfo: 'Savera Heritage Spice Cellars.',
    origin: 'Pampore, Kashmir Valley',
    benefits: [
      'Imparts rich golden color and unforgettable aroma to sweets & milk',
      'High natural concentrations of crocin, safranal, and picrocrocin',
      'Supports vibrant skin radiance and positive emotional mood',
      'Time-honoured sacred botanical for daily morning milk rituals',
    ],
    howItIsMade: [
      '01. Crocus sativus flowers handpicked at sunrise in autumn',
      '02. Stigmas carefully separated by hand on the same morning',
      '03. Gently solar-dried to preserve deep crimson hue and potent volatile oils',
    ],
    faqs: [
      {
        question: 'How to test if Kashmiri Kesar is authentic?',
        answer: 'Real Kashmiri saffron takes 10 to 15 minutes to slowly release its golden yellow hue in warm milk/water without the threads losing their red color.',
      },
    ],
    images: [
      '/images/kashmiri-kesar.png',
    ],
    variants: [
      { id: 'var-ksr-1g', name: '1 Gram Glass Vial', price: 349, mrp: 420, discountPct: 17, stock: 120, sku: 'SAV-SPICE-KSR-1G', weightVolume: '1 g' },
      { id: 'var-ksr-5g', name: '5 Gram Wooden Gift Box', price: 1599, mrp: 1999, discountPct: 20, stock: 45, sku: 'SAV-SPICE-KSR-5G', weightVolume: '5 g' },
    ],
    rating: 4.98,
    reviewCount: 195,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-mouth-freshener',
    name: 'Mouth Freshener',
    tagline: 'A naturally inspired blend for a fresh finish.',
    category: 'Traditional Staples',
    subcategory: 'After-Meal Mukhwas',
    description: 'A naturally inspired blend for a fresh finish. Slow dry-roasted Lucknowi fennel seeds (saunf), sesame, coriander pulse (dhana dal), dried melon seeds, and crushed cooling herbs lightly kissed with unrefined desi mishri. An aromatic digestif for pure post-meal delight.',
    ingredients: ['Roasted Fennel Seeds (Saunf)', 'Coriander Seeds (Dhana Dal)', 'Sesame Seeds', 'Watermelon Seeds', 'Organic Desi Mishri', 'Pinch of Menthol & Green Cardamom'],
    nutritionalInfo: [
      { label: 'Digestion', value: '100% Herbal & Natural' },
      { label: 'Artificial Colors', value: '0%' },
    ],
    storageInstructions: 'Keep in an airtight jar in a cool, dry pantry.',
    shelfLife: '9 Months from packaging.',
    manufacturingInfo: 'Savera Traditional Confectionery.',
    origin: 'Savera Kitchens',
    benefits: [
      'Naturally cleanses palate and freshens breath after meals',
      'Stimulates salivation and healthy gastric digestive juices',
      'Sweetened only with unrefined natural mishri, no white sugar',
      'Free from artificial dyes, saccharin, or chemical preservatives',
    ],
    howItIsMade: [
      '01. Selected seeds sorted and washed with pure water',
      '02. Slow roasted on low flame to bring out natural crunch',
      '03. Tossed with crushed whole green cardamom and rock sugar crystals',
    ],
    faqs: [
      {
        question: 'Does this contain supari (areca nut)?',
        answer: 'No! It is 100% supari-free, tobacco-free, and safe for everyone in the family.',
      },
    ],
    images: [
      '/images/mouth-freshener.png',
    ],
    variants: [
      { id: 'var-mf-150g', name: '150g Glass Jar', price: 140, mrp: 170, discountPct: 18, stock: 160, sku: 'SAV-SNK-MF-150G', weightVolume: '150 g' },
      { id: 'var-mf-300g', name: '300g Refill Pack', price: 250, mrp: 310, discountPct: 19, stock: 90, sku: 'SAV-SNK-MF-300G', weightVolume: '300 g' },
    ],
    rating: 4.86,
    reviewCount: 110,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    id: 'prod-hard-ki-goliya',
    name: 'Hard Ki Goliya',
    tagline: 'A traditional herbal-inspired bite.',
    category: 'Traditional Staples',
    subcategory: 'Digestive Candies',
    description: 'A traditional herbal-inspired bite formulated with Ayurvedic Haritaki (chhoti harad), rock salt, amchur (dry green mango), and roasted digestive spices. Famous across Indian homes for swiftly settling heaviness, easing gas, and leaving an addictive sweet-tangy taste.',
    ingredients: ['Chhoti Harad (Terminalia Chebula)', 'Black Salt (Kala Namak)', 'Dry Mango Powder (Amchur)', 'Cumin', 'Organic Jaggery Extracts'],
    nutritionalInfo: [
      { label: 'Nature', value: 'Ayurvedic Digestif' },
      { label: 'Base', value: 'Pure Jaggery & Herbs' },
    ],
    storageInstructions: 'Store in an airtight glass jar.',
    shelfLife: '12 Months from packaging.',
    manufacturingInfo: 'Savera Traditional Confectionery.',
    origin: 'Savera Artisan Kitchens',
    benefits: [
      'Haritaki (Harad) provides fast relief from bloating and acidity',
      'Stimulates sluggish digestive fire after heavy meals',
      'Irresistible traditional sweet, sour, and salty flavour',
      'Zero synthetic syrups, artificial sweeteners, or preservatives',
    ],
    howItIsMade: [
      '01. Selected harad fruits roasted in pure cow ghee and ground',
      '02. Blended with rock salt, amchur, and molten jaggery',
      '03. Hand-rolled into bite-sized digestive pearls',
    ],
    faqs: [
      {
        question: 'When should I have Hard Ki Goliya?',
        answer: 'Pop 1 or 2 pearls after lunch or dinner, or whenever you feel sluggish or bloated.',
      },
    ],
    images: [
      '/images/hard-ki-goliya.png',
    ],
    variants: [
      { id: 'var-hkg-150g', name: '150g Glass Jar', price: 130, mrp: 160, discountPct: 19, stock: 140, sku: 'SAV-SNK-HKG-150G', weightVolume: '150 g' },
      { id: 'var-hkg-300g', name: '300g Pack', price: 230, mrp: 290, discountPct: 21, stock: 85, sku: 'SAV-SNK-HKG-300G', weightVolume: '300 g' },
    ],
    rating: 4.89,
    reviewCount: 142,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    id: 'prod-khand',
    name: 'Khand',
    tagline: 'Unrefined sweetness, rooted in tradition.',
    category: 'Traditional Staples',
    subcategory: 'Unrefined Sugars',
    description: 'Unrefined sweetness, rooted in tradition. Authentic Desi Khand made by evaporating fresh village sugarcane juice without chemical clarification, bleaching, or bone charcoal filters. Golden, delicate, and cooling in Ayurvedic nature, it sweetens tea, milk, and desserts wholesome and pure.',
    ingredients: ['100% Pure Unrefined Native Sugarcane Juice Crystals'],
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '388 kcal' },
      { label: 'Chemicals / Sulphur', value: '0% (Non-Sulfited)' },
      { label: 'Calcium & Iron', value: 'Natural Cane Minerals Intact' },
    ],
    storageInstructions: 'Store in a cool dry container away from humidity.',
    shelfLife: '12 Months from packaging.',
    manufacturingInfo: 'Savera Sugar Mills, Traditional Khandsari Unit.',
    origin: 'Savera Partner Sugarcane Fields, Uttar Pradesh / Haryana',
    benefits: [
      'Non-sulfited, unbleached, and naturally unrefined crystals',
      'Retains beneficial sugarcane trace minerals and molasses aroma',
      'Ayurvedically praised as cooling (Sheeta Virya) for the gut',
      'Ideal wholesome substitute for industrial refined white sugar',
    ],
    howItIsMade: [
      '01. Fresh sugarcane crushed to extract pure juice',
      '02. Clarified using natural wild okra (Bhindi) plant extracts',
      '03. Open-pan boiled and naturally crystallized without bone charcoal',
    ],
    faqs: [
      {
        question: 'How is Desi Khand different from white table sugar?',
        answer: 'White sugar is heavily bleached with sulphur dioxide and stripped of all nutrients. Desi Khand is unbleached, chemical-free, and retains natural trace minerals.',
      },
    ],
    images: [
      '/images/khand.png',
    ],
    variants: [
      { id: 'var-khd-1kg', name: '1 kg Eco Bag', price: 110, mrp: 135, discountPct: 19, stock: 260, sku: 'SAV-STP-KHD-1KG', weightVolume: '1 kg' },
      { id: 'var-khd-5kg', name: '5 kg Family Pack', price: 510, mrp: 625, discountPct: 18, stock: 100, sku: 'SAV-STP-KHD-5KG', weightVolume: '5 kg' },
    ],
    rating: 4.93,
    reviewCount: 220,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-natural-soap',
    name: 'Natural Soap',
    tagline: 'Plant-inspired care for everyday cleansing.',
    category: 'Personal Care',
    subcategory: 'Artisan Bathing',
    description: 'Plant-inspired care for everyday cleansing. Cold-process artisan soap bar cured over 6 weeks using virgin cold-pressed coconut oil, raw A2 cow milk, neem, tulsi, and therapeutic botanical oils. Cleanses gently with a rich, velvety lather without stripping away natural skin oils.',
    ingredients: ['Cold-Pressed Coconut Oil', 'Raw A2 Desi Cow Milk', 'Neem Leaf Extract', 'Tulsi Extract', 'Pure Vegetable Glycerin', 'Sandalwood Essential Oil'],
    nutritionalInfo: [
      { label: 'Sulphates (SLS/SLES)', value: '0%' },
      { label: 'Parabens & Animal Fat', value: '0%' },
      { label: 'Cure Time', value: '6-Week Slow Cold-Process Cure' },
    ],
    storageInstructions: 'Keep in a well-drained wooden soap dish between uses to prolong bar life.',
    shelfLife: '24 Months from packaging.',
    manufacturingInfo: 'Savera Artisan Soap Studio.',
    origin: 'Savera Botanical Workshop',
    benefits: [
      'Zero SLS, SLES, artificial colorants, or petroleum derivatives',
      'Cold-process curing preserves nourishing plant glycerin',
      'Soothes dry, itchy, or sensitive skin naturally',
      'Rich creamy lather from wholesome coconut and botanical oils',
    ],
    howItIsMade: [
      '01. Virgin oils and botanical decoctions hand-mixed at room temperature',
      '02. Poured into wooden moulds and cut by hand',
      '03. Cured in open air for 6 weeks to develop mildness and hard bar texture',
    ],
    faqs: [
      {
        question: 'Is this soap suitable for sensitive facial skin?',
        answer: 'Yes! It is crafted with mild botanical oils and A2 milk, making it exceptionally gentle for both face and body.',
      },
    ],
    images: [
      '/images/natural-soap.png',
    ],
    variants: [
      { id: 'var-ns-100g', name: 'Single Bar (100g)', price: 120, mrp: 150, discountPct: 20, stock: 190, sku: 'SAV-CARE-NS-100G', weightVolume: '100 g' },
      { id: 'var-ns-pack3', name: 'Pack of 3 Bars', price: 320, mrp: 420, discountPct: 24, stock: 110, sku: 'SAV-CARE-NS-3PK', weightVolume: '3 x 100 g' },
    ],
    rating: 4.87,
    reviewCount: 135,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    id: 'prod-dantmanjan',
    name: 'Dantmanjan',
    tagline: 'A traditional blend for your daily oral-care ritual.',
    category: 'Personal Care',
    subcategory: 'Ayurvedic Tooth Powder',
    description: 'A traditional blend for your daily oral-care ritual. Prepared with clove bud oil, babool bark, neem, rock salt, alum, and cinnamon. Gently massages sensitive gums, eliminates bad breath, strengthens loose teeth roots, and keeps teeth naturally bright and clean.',
    ingredients: ['Babool Bark (Acacia Arabica)', 'Clove (Laung)', 'Neem Bark', 'Saindhava Lavana (Rock Salt)', 'Sphatika (Alum)', 'Cinnamon & Spearmint'],
    nutritionalInfo: [
      { label: 'Fluoride', value: '0% (Naturally Safe)' },
      { label: 'Chemical Bleach & Chalk', value: '0%' },
    ],
    storageInstructions: 'Keep corked or capped in a dry bathroom cabinet.',
    shelfLife: '24 Months from packaging.',
    manufacturingInfo: 'Savera Traditional Care.',
    origin: 'Savera Herbal Apothecary',
    benefits: [
      'Ancient herbal recipe for gum strength & plaque prevention',
      'Clove and neem offer natural antibacterial defense',
      'Gentle non-abrasive mineral polishing action',
      'Long-lasting herbal breath freshness',
    ],
    howItIsMade: [
      '01. Medicinal tree barks shade-dried and finely powdered',
      '02. Mineral rock salts and botanical clove extracts infused',
      '03. Micro-sifted for gentle, gum-friendly daily use',
    ],
    faqs: [
      {
        question: 'Can I use this with my bamboo toothbrush?',
        answer: 'Yes! Wet your toothbrush bristles slightly, dip into the powder, and brush gently for 2 minutes.',
      },
    ],
    images: [
      '/images/dantmanjan.png',
    ],
    variants: [
      { id: 'var-dm-80g', name: '80g Glass Bottle', price: 110, mrp: 140, discountPct: 21, stock: 150, sku: 'SAV-CARE-DM-80G', weightVolume: '80 g' },
      { id: 'var-dm-160g', name: '160g Twin Pack', price: 195, mrp: 260, discountPct: 25, stock: 80, sku: 'SAV-CARE-DM-160G', weightVolume: '160 g' },
    ],
    rating: 4.84,
    reviewCount: 92,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    id: 'prod-face-body-ubtan',
    name: 'Face & Body Ubtan',
    tagline: 'A botanical blend for a time-honoured bathing ritual.',
    category: 'Personal Care',
    subcategory: 'Bathing Rituals',
    description: 'A botanical blend for a time-honoured bathing ritual. A regal Ayurvedic formulation combining freshly stone-ground chickpea flour, sweet almond meal, wild Kasturi turmeric, saffron filaments, and sandalwood. Gently buffs away dead cells, softens tan, and revives glowing skin tone.',
    ingredients: ['Besan (Chickpea Flour)', 'Almond Meal', 'Wild Kasturi Turmeric', 'Kashmiri Saffron Filaments', 'Sandalwood (Chandan)', 'Orange Peel Powder'],
    nutritionalInfo: [
      { label: 'Preservatives', value: '0%' },
      { label: 'Fragrance', value: '100% Natural Essential Botanicals' },
    ],
    storageInstructions: 'Keep in an airtight jar in a dry place.',
    shelfLife: '18 Months from packaging.',
    manufacturingInfo: 'Savera Natural Skincare Workshop.',
    origin: 'Savera Organic Estates',
    benefits: [
      'Natural soap-free botanical body cleanser & exfoliator',
      'Lightens stubborn sun tans and evens skin tone',
      'Imparts a royal bride-like glow to face and body',
      'Enriched with nourishing almond and saffron oils',
    ],
    howItIsMade: [
      '01. Organic pulses and nuts stone-ground to fine consistency',
      '02. Blended with fragrant botanical powders and pure saffron',
      '03. Packed dry to allow customizable freshness when mixing',
    ],
    faqs: [
      {
        question: 'How often should I use Face & Body Ubtan?',
        answer: 'Use 2 to 3 times a week in place of shower gel or soap. Mix with warm water, milk, or rose water to form a smooth paste and massage gently before bathing.',
      },
    ],
    images: [
      '/images/face-body-ubtan.png',
    ],
    variants: [
      { id: 'var-fbu-150g', name: '150g Tin Jar', price: 290, mrp: 350, discountPct: 17, stock: 120, sku: 'SAV-CARE-FBU-150G', weightVolume: '150 g' },
      { id: 'var-fbu-300g', name: '300g Value Pack', price: 520, mrp: 650, discountPct: 20, stock: 70, sku: 'SAV-CARE-FBU-300G', weightVolume: '300 g' },
    ],
    rating: 4.94,
    reviewCount: 168,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-herbal-shampoo',
    name: 'Herbal Shampoo',
    tagline: 'Herbal-inspired care for your hair routine.',
    category: 'Personal Care',
    subcategory: 'Hair Care',
    description: 'Herbal-inspired care for your hair routine. Infused with fresh decoctions of Shikakai, Reetha (Soapnut), Bhringraj, Amla, and Hibiscus flowers. Gently cleanses the scalp of grime without stripping essential sebum, reducing hair fall and leaving strands voluminous and glossy.',
    ingredients: ['Shikakai Extract', 'Reetha (Soapnut Extract)', 'Bhringraj', 'Amla Extract', 'Hibiscus Flowers', 'Aloe Vera Leaf Gel', 'Coconut Glucoside Cleansers'],
    nutritionalInfo: [
      { label: 'Sulphates & Silicones', value: '0%' },
      { label: 'pH Balanced', value: '5.5 (Gentle for Scalp)' },
    ],
    storageInstructions: 'Store in shower area away from direct heat.',
    shelfLife: '24 Months from packaging.',
    manufacturingInfo: 'Savera Botanical Hair Care.',
    origin: 'Savera Estates',
    benefits: [
      'Reetha & Shikakai create gentle natural cleansing lather',
      'Bhringraj and Amla strengthen roots against seasonal hair fall',
      'Free from silicones, sulphates, and synthetic thickeners',
      'Leaves hair silky, conditioned, and naturally bouncy',
    ],
    howItIsMade: [
      '01. Traditional slow herb simmering of shikakai, reetha, and amla',
      '02. Blended with organic aloe vera and coconut-derived foamers',
      '03. Filled into recyclable pump bottles',
    ],
    faqs: [
      {
        question: 'Does this shampoo foam like commercial shampoos?',
        answer: 'It produces a mild, rich herbal foam thanks to natural Reetha (soapnut) and coconut glucoside, without harsh synthetic sulphate chemicals.',
      },
    ],
    images: [
      '/images/herbal-shampoo.png',
    ],
    variants: [
      { id: 'var-hs-200ml', name: '200 ml Pump Bottle', price: 299, mrp: 375, discountPct: 20, stock: 140, sku: 'SAV-HAIR-HS-200ML', weightVolume: '200 ml' },
      { id: 'var-hs-500ml', name: '500 ml Family Bottle', price: 599, mrp: 750, discountPct: 20, stock: 65, sku: 'SAV-HAIR-HS-500ML', weightVolume: '500 ml' },
    ],
    rating: 4.88,
    reviewCount: 114,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    id: 'prod-gulab-jal',
    name: 'Gulab Jal',
    tagline: 'A floral touch for your daily skincare ritual.',
    category: 'Personal Care',
    subcategory: 'Floral Waters',
    description: 'A floral touch for your daily skincare ritual. 100% steam-distilled pure floral water extracted from Indian Desi Damask roses in traditional copper Deg-Bhapka stills. Tones, calms inflammation, balances skin pH, and refreshes tired eyes with authentic petal purity.',
    ingredients: ['100% Steam-Distilled Rosa Damascena (Damask Rose) Hydrosol'],
    nutritionalInfo: [
      { label: 'Distillation', value: 'Traditional Copper Still Steam-Distilled' },
      { label: 'Alcohol & Additives', value: '0%' },
    ],
    storageInstructions: 'Store in cool place. Refrigerate for an extra invigorating cooling mist.',
    shelfLife: '18 Months from packaging.',
    manufacturingInfo: 'Savera Rose Distilleries, Kannauj / Haryana.',
    origin: 'Damask Rose Farms',
    benefits: [
      '100% Pure steam distillate with intact essential rose oil',
      'Instantly revitalizes and tones tired, dehydrated skin',
      'Restores natural skin pH after face cleansing',
      'Gentle & therapeutic for all skin types including sensitive eyes',
    ],
    howItIsMade: [
      '01. Fresh Damask rose petals handpicked before dawn',
      '02. Slow steam distillation in traditional sealed copper stills',
      '03. Micro-filtered pure distillate bottled without alcohol',
    ],
    faqs: [
      {
        question: 'Can I use this Gulab Jal as a daily face mist?',
        answer: 'Yes! Spray directly over face and neck anytime during the day to hydrate, cool, and refresh skin.',
      },
    ],
    images: [
      '/images/gulab-jal.png',
    ],
    variants: [
      { id: 'var-gj-100ml', name: '100 ml Fine Mist Spray', price: 160, mrp: 199, discountPct: 20, stock: 180, sku: 'SAV-SKIN-GJ-100ML', weightVolume: '100 ml' },
      { id: 'var-gj-250ml', name: '250 ml Refill Bottle', price: 320, mrp: 420, discountPct: 24, stock: 95, sku: 'SAV-SKIN-GJ-250ML', weightVolume: '250 ml' },
    ],
    rating: 4.95,
    reviewCount: 245,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-coconut-oil',
    name: 'Coconut Oil',
    tagline: 'Everyday care with classic coconut goodness.',
    category: 'Traditional Staples',
    subcategory: 'Cold Pressed Oils',
    description: 'Everyday care with classic coconut goodness. Wood-pressed (Marachekku) at room temperature from mature, sun-dried copra coconuts. Crystal clear, wonderfully aromatic, and rich in medium-chain triglycerides (Lauric acid). Perfect for deep hair oiling, skin nourishment, or wholesome cooking.',
    ingredients: ['100% Cold-Pressed Unrefined Copra Coconut Oil'],
    nutritionalInfo: [
      { label: 'Energy (per 100ml)', value: '862 kcal' },
      { label: 'Lauric Acid', value: '52 g' },
      { label: 'Chemical Refining', value: '0%' },
    ],
    storageInstructions: 'Store at room temperature. Solidifies naturally into pure white butter below 24°C.',
    shelfLife: '12 Months from packaging.',
    manufacturingInfo: 'Savera Cold-Press Unit.',
    origin: 'Savera Organic Partner Groves',
    benefits: [
      'Cold-pressed in wooden mills below 40°C with zero heat damage',
      'Over 50% Lauric Acid for deep hair conditioning & nourishment',
      'Pure food-grade unrefined virgin oil with authentic fresh aroma',
      'Zero mineral oil, chemicals, or artificial fragrances',
    ],
    howItIsMade: [
      '01. Mature coconuts dried under clean sun to make golden copra',
      '02. Slow cold-pressed in traditional wooden Kolhu (Marachekku)',
      '03. Sediment-settled and cloth-filtered without chemical bleaches',
    ],
    faqs: [
      {
        question: 'Is this coconut oil suitable for both hair and cooking?',
        answer: 'Yes! It is 100% edible-grade pure virgin oil, making it exceptional for deep scalp massage, skin hydration, and healthy cooking.',
      },
    ],
    images: [
      '/images/coconut-oil.png',
    ],
    variants: [
      { id: 'var-cno-500ml', name: '500 ml Glass Jar', price: 240, mrp: 290, discountPct: 17, stock: 140, sku: 'SAV-OIL-CNO-500ML', weightVolume: '500 ml' },
      { id: 'var-cno-1l', name: '1 Litre Glass Bottle', price: 440, mrp: 540, discountPct: 19, stock: 95, sku: 'SAV-OIL-CNO-1L', weightVolume: '1 L' },
    ],
    rating: 4.91,
    reviewCount: 160,
    isSubscriptionEligible: false,
    isBestSeller: true,
    isFeatured: true,
  },

  // --- SAVERA CORE A2 DAIRY & TRADITIONAL FARM PRODUCE ---
  {
    id: 'prod-a2-milk',
    name: 'A2 Desi Cow Milk',
    tagline: 'Farm Fresh A2 Milk from Gir & Sahiwal Cows',
    category: 'Milk',
    subcategory: 'A2 Milk',
    description: '100% pure A2 milk collected fresh every morning from traditional Indian Desi cow breeds (Gir & Sahiwal). Untouched by human hands, non-homogenized, free from antibiotics, hormones, and adulterants. Delivered in chilled glass bottles within hours of milking.',
    ingredients: ['100% Pure Raw A2 Desi Cow Milk'],
    fatPercentage: '4.2% - 4.8%',
    nutritionalInfo: [
      { label: 'Energy (per 100ml)', value: '68 kcal' },
      { label: 'Fat', value: '4.2 g' },
      { label: 'Protein (A2 Beta Casein)', value: '3.4 g' },
      { label: 'Carbohydrates', value: '4.8 g' },
      { label: 'Calcium', value: '120 mg' },
    ],
    storageInstructions: 'Keep refrigerated between 2°C to 4°C. Boil before consumption.',
    shelfLife: '48 Hours from delivery when refrigerated.',
    manufacturingInfo: 'Milked and bottled at Savera Farms Dairy Estate, Panchkula – Morni Foothills Belt, Haryana.',
    origin: 'Savera Farms Organic Dairy Estate, Panchkula',
    benefits: [
      'Contains easy-to-digest A2 Beta-Casein protein',
      'Rich in natural Vitamin A, Calcium, and B-Complex vitamins',
      'Non-homogenized & free from synthetic oxytocin or preservatives',
      'Supports gut health and immune vitality',
    ],
    howItIsMade: [
      '01. Morning milking of free-grazing Desi Gir & Sahiwal cows',
      '02. Immediate inline chilling at 4°C to maintain microbial freshness',
      '03. Automated zero-touch glass bottle filling and vacuum capping',
      '04. Dispatched in cold-chain insulated vans directly to your doorstep',
    ],
    faqs: [
      {
        question: 'What makes A2 Desi Cow Milk different from regular milk?',
        answer: 'A2 milk is derived exclusively from indigenous Indian cow breeds (like Gir & Sahiwal) that naturally produce the A2 beta-casein protein, which is significantly easier to digest and gentler on the stomach compared to A1 milk from crossbred cows.',
      },
      {
        question: 'Is the milk raw or pasteurized?',
        answer: 'We deliver fresh chilled farm milk. We recommend boiling it once before consumption according to traditional Indian household practice.',
      },
    ],
    images: [
      '/images/milk-bottle.png',
      '/images/milk-pouring.png',
    ],
    variants: [
      { id: 'var-a2m-1l', name: '1 Litre Glass Bottle', price: 92, mrp: 100, discountPct: 8, stock: 450, sku: 'SAV-MILK-A2-1L', weightVolume: '1 L' },
      { id: 'var-a2m-500ml', name: '500 ml Glass Bottle', price: 48, mrp: 52, discountPct: 7, stock: 320, sku: 'SAV-MILK-A2-500ML', weightVolume: '500 ml' },
      { id: 'var-a2m-2l', name: '2 Litre Family Can', price: 178, mrp: 195, discountPct: 9, stock: 180, sku: 'SAV-MILK-A2-2L', weightVolume: '2 L' },
    ],
    rating: 4.9,
    reviewCount: 418,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-a2-ghee',
    name: 'A2 Vedic Bilona Cow Ghee',
    tagline: 'Hand-Churned Traditional Bilona Ghee from Curd',
    category: 'Ghee',
    subcategory: 'A2 Bilona Ghee',
    description: 'Crafted using the ancient Vedic Bilona method. Fresh A2 milk is boiled, cultured into curd, and hand-churned bi-directionally with a wooden bilona to extract makkhan (butter), which is slow-simmered over low flame into golden, aromatic, granular Ghee. Packed with nutrients and nostalgic aroma.',
    ingredients: ['100% Pure A2 Desi Cow Makkhan (Cultured Butter)'],
    fatPercentage: '99.8%',
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '898 kcal' },
      { label: 'Total Fat', value: '99.8 g' },
      { label: 'Saturated Fat', value: '65 g' },
      { label: 'Omega-3 & Omega-6 Fatty Acids', value: 'Balanced Ratio' },
      { label: 'Vitamin A & E', value: 'Natural High' },
    ],
    storageInstructions: 'Store in a cool, dry place away from direct sunlight. Use a clean dry spoon.',
    shelfLife: '12 Months from manufacturing date.',
    manufacturingInfo: 'Hand-churned at Savera Farms Vedic Dairy Workshop, Sector 9, Panchkula.',
    origin: 'Savera Farms Dairy Estate',
    benefits: [
      'Made purely from A2 curd makkhan, high in butyric acid for gut health',
      'Granular texture with authentic traditional aroma',
      'High smoke point ideal for Indian cooking, sautéing, and medicinal use',
      'Supports joint mobility, cognitive memory, and immunity',
    ],
    howItIsMade: [
      '01. Boil fresh A2 milk and culture into natural dahi (curd)',
      '02. Bi-directional wooden bilona churning to extract fresh makkhan',
      '03. Slow simmering of makkhan over low fire in brass vessels',
      '04. Golden ghee strained into glass jars without preservatives',
    ],
    faqs: [
      {
        question: 'Why is Bilona Ghee superior to commercial cream ghee?',
        answer: 'Commercial ghee is made directly from industrial milk cream using high heat and centrifuges. Bilona Ghee is made from cultured dahi (curd), which preserves enzymes, natural aroma, granular texture, and digestive health benefits.',
      },
    ],
    images: [
      '/images/bilona-ghee.png',
      '/images/bilona-ghee-texture.png',
    ],
    variants: [
      { id: 'var-ghee-500g', name: '500g Glass Jar', price: 949, mrp: 1099, discountPct: 14, stock: 120, sku: 'SAV-GHEE-BIL-500G', weightVolume: '500 g' },
      { id: 'var-ghee-1kg', name: '1 kg Glass Jar', price: 1849, mrp: 2199, discountPct: 16, stock: 85, sku: 'SAV-GHEE-BIL-1KG', weightVolume: '1 kg' },
      { id: 'var-ghee-250g', name: '250g Glass Jar', price: 499, mrp: 575, discountPct: 13, stock: 60, sku: 'SAV-GHEE-BIL-250G', weightVolume: '250 g' },
    ],
    rating: 4.95,
    reviewCount: 312,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-cold-mustard',
    name: 'Cold-Pressed Wood Pressed Mustard Oil (Kachi Ghani)',
    tagline: '100% Pure Virgin Mustard Oil Extracted in Wooden Kolhu',
    category: 'Oils',
    subcategory: 'Cold Pressed Oils',
    description: 'Extracted from premium black & yellow mustard seeds using traditional wooden mills (Wood Kolhu) at room temperature. Unrefined, unbleached, and chemical-free, retaining full aroma, natural pungency, and essential Omega-3 fatty acids.',
    ingredients: ['100% Cold Pressed Mustard Seeds'],
    nutritionalInfo: [
      { label: 'Energy (per 100ml)', value: '884 kcal' },
      { label: 'MUFA', value: '60 g' },
      { label: 'PUFA', value: '21 g' },
      { label: 'Omega-3', value: '10 g' },
    ],
    storageInstructions: 'Store in a cool dark place.',
    shelfLife: '9 Months from packaging.',
    manufacturingInfo: 'Savera Cold-Press Unit, Rajasthan / Haryana Border.',
    origin: 'Savera Farms Partner Estates',
    benefits: [
      'Zero heat extraction preserves antioxidants and natural pungency',
      'Rich in Monounsaturated Fatty Acids (MUFA) for heart health',
      'Free from argemone oil, hexanes, or chemical refining',
    ],
    howItIsMade: [
      '01. Sun-dried high-grade mustard seeds selection',
      '02. Slow cold extraction in Marachekku (wooden press) below 40°C',
      '03. Natural cloth filtration without chemical bleaching',
    ],
    faqs: [
      {
        question: 'What is Kachi Ghani Wood Pressing?',
        answer: 'Wood pressing uses slow wooden rotors that generate minimal heat (under 40°C), ensuring natural nutrients, aroma, and essential fatty acids are preserved.',
      },
    ],
    images: [
      '/images/mustard-oil.png',
    ],
    variants: [
      { id: 'var-must-1l', name: '1 Litre Glass Bottle', price: 240, mrp: 280, discountPct: 14, stock: 210, sku: 'SAV-OIL-MUST-1L', weightVolume: '1 L' },
      { id: 'var-must-5l', name: '5 Litre Can', price: 1150, mrp: 1350, discountPct: 15, stock: 65, sku: 'SAV-OIL-MUST-5L', weightVolume: '5 L' },
    ],
    rating: 4.8,
    reviewCount: 184,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    id: 'prod-fresh-paneer',
    name: 'Fresh Malai A2 Desi Cow Paneer',
    tagline: 'Soft, Melt-in-your-mouth Cottage Cheese made from A2 Milk',
    category: 'Dairy',
    subcategory: 'Paneer',
    description: 'Freshly prepared cottage cheese crafted from pure A2 Desi cow milk coagulated with natural lemon extract. Super soft, protein-rich, and free from starch, synthetic coagulants, or palm oil.',
    ingredients: ['Pure A2 Desi Cow Milk', 'Natural Lemon Juice Coagulants'],
    fatPercentage: '20% - 22%',
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '265 kcal' },
      { label: 'Protein', value: '18.5 g' },
      { label: 'Fat', value: '20.8 g' },
      { label: 'Calcium', value: '208 mg' },
    ],
    storageInstructions: 'Refrigerate immediately between 1°C to 4°C. Immerse in clean water to keep extra soft.',
    shelfLife: '5 Days from delivery.',
    manufacturingInfo: 'Made daily at Savera Farms Dairy Kitchen.',
    origin: 'Savera Farms',
    benefits: [
      'High bioavailable protein ideal for daily fitness & nourishment',
      'Ultra soft texture, naturally rich and creamy',
      'No added starch, preservatives, or synthetic additives',
    ],
    howItIsMade: [
      '01. Boiling pure A2 milk and coagulating with fresh lemon extract',
      '02. Gentle pressing in muslin cloth to retain natural moisture',
      '03. Vacuum packed fresh every morning for delivery',
    ],
    faqs: [
      {
        question: 'How long does the Paneer stay fresh?',
        answer: 'Our paneer is 100% natural without preservatives. It stays fresh for 5 days in the refrigerator. We recommend keeping it immersed in a bowl of fresh water.',
      },
    ],
    images: [
      '/images/fresh-paneer.png',
      '/images/fresh-paneer-slices.png',
    ],
    variants: [
      { id: 'var-pan-250g', name: '250g Pack', price: 130, mrp: 150, discountPct: 13, stock: 95, sku: 'SAV-PAN-250G', weightVolume: '250 g' },
      { id: 'var-pan-500g', name: '500g Pack', price: 250, mrp: 290, discountPct: 14, stock: 70, sku: 'SAV-PAN-500G', weightVolume: '500 g' },
    ],
    rating: 4.88,
    reviewCount: 210,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'prod-farm-curd',
    name: 'Farm Fresh A2 Desi Cow Curd (Dahi)',
    tagline: 'Thick, Creamy & Naturally Probiotic Dahi',
    category: 'Dairy',
    subcategory: 'Curd',
    description: 'Traditional earthen-pot set curd made from boiled A2 Desi cow milk inoculated with indigenous starter culture. Thick, sweet-aromatic, and packed with gut-friendly probiotics.',
    ingredients: ['A2 Desi Cow Milk', 'Active Lactic Starter Culture'],
    fatPercentage: '4.5%',
    nutritionalInfo: [
      { label: 'Energy (per 100g)', value: '62 kcal' },
      { label: 'Protein', value: '3.5 g' },
      { label: 'Probiotic Bacteria Count', value: '> 10^8 CFU/g' },
    ],
    storageInstructions: 'Refrigerate at 2°C to 5°C.',
    shelfLife: '7 Days when refrigerated.',
    manufacturingInfo: 'Set in clay matkas at Savera Dairy.',
    origin: 'Savera Farms',
    benefits: [
      'High probiotic density aids digestion and gut immunity',
      'Thick natural consistency without artificial thickeners or gelatin',
    ],
    howItIsMade: ['01. Milk boiled to 85°C and cooled', '02. Inoculated with traditional jamun', '03. Set in eco-friendly containers'],
    faqs: [],
    images: [
      '/images/farm-curd.png',
    ],
    variants: [
      { id: 'var-curd-500g', name: '500g Matka Container', price: 65, mrp: 75, discountPct: 13, stock: 140, sku: 'SAV-CURD-500G', weightVolume: '500 g' },
      { id: 'var-curd-1kg', name: '1 kg Family Bucket', price: 120, mrp: 140, discountPct: 14, stock: 90, sku: 'SAV-CURD-1KG', weightVolume: '1 kg' },
    ],
    rating: 4.9,
    reviewCount: 165,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: false,
  },
];

export const SEED_SUBSCRIPTIONS: MilkSubscription[] = [];

export const SEED_ORDERS: Order[] = [];

export const SEED_BATCHES: BatchItem[] = [
  {
    id: 'batch-1',
    batchId: 'BATCH-20260823-A2M',
    productId: 'prod-a2-milk',
    productName: 'A2 Desi Cow Milk',
    variantId: 'var-a2m-1l',
    variantName: '1 Litre Glass Bottle',
    productionDate: '2026-08-23',
    expiryDate: '2026-08-25',
    quantityProduced: 500,
    quantitySold: 280,
    wastage: 5,
    unitCost: 45,
    supplierSource: 'Savera Farm Estate Unit-1',
    status: 'Fresh'
  },
  {
    id: 'batch-2',
    batchId: 'BATCH-20260820-BIL',
    productId: 'prod-a2-ghee',
    productName: 'A2 Vedic Bilona Cow Ghee',
    variantId: 'var-ghee-500g',
    variantName: '500g Glass Jar',
    productionDate: '2026-08-20',
    expiryDate: '2027-08-20',
    quantityProduced: 200,
    quantitySold: 80,
    wastage: 2,
    unitCost: 520,
    supplierSource: 'Savera Dairy Kitchen',
    status: 'Fresh'
  },
  {
    id: 'batch-3',
    batchId: 'BATCH-20260819-PAN',
    productId: 'prod-fresh-paneer',
    productName: 'Fresh Malai A2 Desi Cow Paneer',
    variantId: 'var-pan-250g',
    variantName: '250g Pack',
    productionDate: '2026-08-20',
    expiryDate: '2026-08-25',
    quantityProduced: 150,
    quantitySold: 120,
    wastage: 4,
    unitCost: 65,
    supplierSource: 'Savera Dairy Unit',
    status: 'Expiring Soon'
  }
];

export const SEED_PRODUCTION: ProductionRecord[] = [
  {
    id: 'prod-rec-101',
    date: '2026-08-23',
    productName: 'A2 Desi Cow Milk (Processed & Chilled)',
    rawMaterialUsed: 'Raw A2 Cow Milk',
    inputQuantity: '850 Litres',
    outputQuantity: '835 Litres Bottled',
    wastage: '15 Litres (Spill/Testing)',
    batchNumber: 'BATCH-20260823-A2M',
    productionCost: 38250,
    operator: 'Rajesh Verma (Head Milk Processing)',
    efficiencyPct: 98.2,
    notes: 'Milk chilling temperature verified at 3.6°C. Fat content tested at 4.4%.'
  },
  {
    id: 'prod-rec-102',
    date: '2026-08-22',
    productName: 'Fresh A2 Malai Paneer',
    rawMaterialUsed: 'Pure A2 Raw Milk + Lemon Coagulants',
    inputQuantity: '400 Litres',
    outputQuantity: '68 KG Paneer',
    wastage: '3 Litres whey spillage',
    batchNumber: 'BATCH-20260822-PAN',
    productionCost: 18000,
    operator: 'Manoj Kumar',
    efficiencyPct: 97.0,
    notes: 'Natural whey separated cleanly. Moisture retained at optimal 54%.'
  }
];

export const SEED_RAW_MATERIALS: RawMaterial[] = [
  { id: 'raw-1', name: 'Raw A2 Milk (Farm Collection)', category: 'Milk', currentStock: 1250, unit: 'Litres', minStockLevel: 500, costPerUnit: 42, lastRestocked: '2026-08-23 05:30 AM', supplier: 'Savera Direct Herd' },
  { id: 'raw-2', name: '1L Ergonomic Glass Bottles', category: 'Containers', currentStock: 2400, unit: 'Units', minStockLevel: 1000, costPerUnit: 18, lastRestocked: '2026-08-18', supplier: 'Delhi Glass Packaging Co.' },
  { id: 'raw-3', name: '500ml Glass Jars with Brass Lids', category: 'Containers', currentStock: 850, unit: 'Units', minStockLevel: 300, costPerUnit: 24, lastRestocked: '2026-08-15', supplier: 'Apex Glassware' },
  { id: 'raw-4', name: 'Biodegradable Tamper Seals & Labels', category: 'Packaging', currentStock: 5000, unit: 'Labels', minStockLevel: 1500, costPerUnit: 1.5, lastRestocked: '2026-08-10', supplier: 'EcoPrint Solutions' }
];

export const SEED_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Delhi Glass Packaging Co.', contactPerson: 'Harish Agarwal', phone: '+91 98100 11223', email: 'sales@delhiglass.in', gstin: '07AAAAA0000A1Z5', paymentTerms: 'Net 30', productsSupplied: 'Glass Bottles, Milk Jars', outstandingBalance: 45000, rating: 4.8 },
  { id: 'sup-2', name: 'Rajasthan Seeds & Agro', contactPerson: 'Devendra Singh', phone: '+91 94140 55667', email: 'info@rajasthanagro.com', gstin: '08BBBBB1111B2Z8', paymentTerms: 'Advance 50%', productsSupplied: 'Organic Mustard Seeds & Groundnuts', outstandingBalance: 120000, rating: 4.7 }
];

export const SEED_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'po-1', poNumber: 'PO-2026-089', supplierId: 'sup-1', supplierName: 'Delhi Glass Packaging Co.', itemDescription: '1L Glass Bottles (3,000 units)', quantity: 3000, unitRate: 18, totalAmount: 54000, expectedDelivery: '2026-08-26', status: 'Confirmed', createdAt: '2026-08-22' }
];

export const SEED_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', pincode: '134109', areaName: 'Panchkula Sectors 1–15 & 20–21 (Main City Hub)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 160, eveningSlotCap: 80, isServiceable: true },
  { id: 'zone-2', pincode: '134113', areaName: 'MDC (Mansa Devi Complex) & Saketri, Panchkula', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 130, eveningSlotCap: 60, isServiceable: true },
  { id: 'zone-3', pincode: '134112', areaName: 'Panchkula Sector 19 & Industrial Area Phase 1-2', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 110, eveningSlotCap: 50, isServiceable: true },
  { id: 'zone-4', pincode: '134116', areaName: 'Panchkula Extension (Sectors 23 to 28)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 120, eveningSlotCap: 60, isServiceable: true },
  { id: 'zone-5', pincode: '134107', areaName: 'Pinjore & Surajpur Foothills Belt', deliveryFee: 35, freeThreshold: 349, morningSlotCap: 90, eveningSlotCap: 40, isServiceable: true },
  { id: 'zone-6', pincode: '160017', areaName: 'Chandigarh Sectors 17, 18, 19, 22 (City Centre)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 160, eveningSlotCap: 80, isServiceable: true },
  { id: 'zone-7', pincode: '160001', areaName: 'Chandigarh Sectors 1–10 (Sukhna Lake & North Hub)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 140, eveningSlotCap: 70, isServiceable: true },
  { id: 'zone-8', pincode: '160022', areaName: 'Chandigarh Sectors 22, 23, 35, 36 (Central Hub)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 150, eveningSlotCap: 75, isServiceable: true },
  { id: 'zone-9', pincode: '160019', areaName: 'Chandigarh Sectors 19, 20, 27, 28 (East Chandigarh)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 130, eveningSlotCap: 65, isServiceable: true },
  { id: 'zone-10', pincode: '160036', areaName: 'Chandigarh Sectors 36, 37, 38, 42', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 130, eveningSlotCap: 60, isServiceable: true },
  { id: 'zone-11', pincode: '160047', areaName: 'Chandigarh Sectors 43–50 (South Chandigarh)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 140, eveningSlotCap: 70, isServiceable: true },
  { id: 'zone-12', pincode: '160055', areaName: 'Mohali Phase 1–5 & Sector 53–59 Belt', deliveryFee: 35, freeThreshold: 349, morningSlotCap: 110, eveningSlotCap: 50, isServiceable: true },
  { id: 'zone-13', pincode: '160071', areaName: 'Mohali Sectors 70–80 & Aerocity Hub', deliveryFee: 35, freeThreshold: 349, morningSlotCap: 110, eveningSlotCap: 50, isServiceable: true },
];

export const SEED_COUPONS: Coupon[] = [
  { code: 'FIRST100', discountType: 'Flat Amount', discountValue: 100, minOrderAmount: 299, description: '₹100 Off on your first Savera order', validUntil: '2026-12-31' },
  { code: 'SUBSCRIPTION10', discountType: 'Percentage', discountValue: 10, minOrderAmount: 500, description: '10% Off on Milk Subscriptions', validUntil: '2026-12-31' },
  { code: 'PUREA2', discountType: 'Flat Amount', discountValue: 50, minOrderAmount: 350, description: '₹50 Instant Discount on A2 Dairy Products', validUntil: '2026-09-30' }
];

export const SEED_CUSTOMER: CustomerProfile = {
  id: 'cust-guest',
  fullName: 'Savera Guest',
  phone: '+91 98765 43210',
  email: 'guest@saverafarms.com',
  walletBalance: 0,
  rewardPoints: 50,
  referralCode: 'SAV-WELCOME100',
  totalOrders: 0,
  totalSpent: 0,
  addresses: []
};

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-a2-milk',
    customerName: 'Kavita Rastogi',
    rating: 5,
    title: 'Purest milk our family has tried in years!',
    comment: 'The thick natural cream layer on top after boiling reminds me of our ancestral home in Haryana. Very gentle on my kids’ digestion.',
    date: '2026-08-18',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-a2-ghee',
    customerName: 'Amitabh Sen',
    rating: 5,
    title: 'Authentic Bilona Granular Ghee',
    comment: 'Splendid aroma and grainy texture. Perfect for homemade parathas and sweets.',
    date: '2026-08-20',
    isVerified: true,
    isApproved: true
  }
];

export const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-9012',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 99887 76655',
    issueCategory: 'Subscription Issue',
    description: 'Would like to increase morning delivery quantity from 1L to 2L on weekends.',
    status: 'In Progress',
    createdAt: '2026-08-22 16:45',
    internalNotes: 'Contacted customer, updated subscription rule.'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-23 10:15:22', user: 'Rahul Sharma (Admin)', role: 'Super Admin', action: 'Update Price', entity: 'A2 Milk 1L', details: 'Changed price from ₹90 to ₹92.' },
  { id: 'log-2', timestamp: '2026-08-23 06:00:00', user: 'Manoj Kumar', role: 'Production Manager', action: 'Batch Created', entity: 'BATCH-20260823-A2M', details: 'Added 500L bottled A2 milk batch.' }
];

export const SEED_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'benefits-of-a2-desi-cow-milk',
    title: 'Why A2 Desi Cow Milk is Superior for Family Digestive Health',
    excerpt: 'Discover the scientific difference between A1 and A2 beta-casein proteins and why indigenous Indian cow breeds provide naturally nourishing milk.',
    content: `Milk has been a cornerstone of Indian nutrition for millennia. However, modern industrial dairy practices introduced crossbred cows producing A1 beta-casein milk, which often causes bloating, digestive discomfort, and inflammation for many individuals.

### The A2 Protein Advantage
Desi Indian cow breeds such as Gir, Sahiwal, and Red Sindhi naturally produce milk containing 100% A2 beta-casein protein. The molecular structure of A2 protein breaks down smoothly in the human digestive system without releasing BCM-7 (beta-casomorphin-7), making it exceptionally gentle on the stomach.

### Rich in Natural Micronutrients
Our A2 Desi Cow Milk is non-homogenized and naturally contains:
- **Vitamin A & B-Complex**: Supports eyesight and metabolic vitality
- **Bioavailable Calcium & Phosphorus**: Essential for bone density in growing children
- **Natural Immunity Boosters**: Free from synthetic oxytocin, antibiotics, or hormone injections.

At **Savera Farms**, we ensure that our cows graze on organic green fodder and are milked in clean, stress-free environments, bringing pure farm-fresh goodness to your doorstep every morning.`,
    author: 'Dr. R. K. Varma (Dairy Technologist)',
    publishDate: '2026-08-15',
    category: 'Nutrition & Wellness',
    image: '/images/milk-pouring.png',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    slug: 'bilona-ghee-making-process',
    title: 'The Lost Art of Vedic Bilona Ghee: Curd to Makkhan to Golden Liquid',
    excerpt: 'Step inside Savera Farms to witness how ancient bi-directional churning produces authentic granular ghee filled with nostalgic aroma.',
    content: `Unlike commercial ghee made by rapidly heating industrial cream, authentic Vedic Ghee follows a sacred 5-step process.

1. **Boiling Pure A2 Milk**: Fresh milk is boiled over controlled heat.
2. **Culturing into Dahi**: Milk is inoculated with natural starter culture in earthen vessels to form rich dahi.
3. **Bi-directional Bilona Churning**: The dahi is churned using a wooden bilona clockwise and counter-clockwise to isolate pure Makkhan.
4. **Slow Simmering**: The Makkhan is melted gently over low flame until golden Ghee separates from milk solids.
5. **Straining & Aging**: The ghee is poured into glass jars to form its signature granular texture.`,
    author: 'Savera Culinary Team',
    publishDate: '2026-08-10',
    category: 'Farm Traditions',
    image: '/images/bilona-churning-process.png',
    readTime: '5 min read'
  }
];

// Helper functions for Database persistence using localStorage with fallback
const STORAGE_KEYS = {
  PRODUCTS: 'savera_products_v2',
  SUBSCRIPTIONS: 'savera_subscriptions_v2',
  ORDERS: 'savera_orders_v2',
  BATCHES: 'savera_batches_v2',
  PRODUCTION: 'savera_production_v2',
  RAW: 'savera_raw_v2',
  SUPPLIERS: 'savera_suppliers_v2',
  ZONES: 'savera_zones_v2',
  COUPONS: 'savera_coupons_v2',
  CUSTOMER: 'savera_customer_v2',
  AUDIT: 'savera_audit_v2',
  TICKETS: 'savera_tickets_v2',
};

export const getStoredData = <T>(key: string, seed: T): T => {
  if (typeof window === 'undefined') return seed;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : seed;
  } catch (e) {
    return seed;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};
