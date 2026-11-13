export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  saveraProductId?: string;
  saveraProductName?: string;
  saveraProductPrice?: number;
  saveraProductImage?: string;
}

export interface RecipeStep {
  number: number;
  title: string;
  description: string;
  proTip?: string;
}

export interface RecipeItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  readTime: string;
  prepTime: string;
  cookTime: string;
  baseServings: number;
  difficulty: 'Easy' | 'Intermediate' | 'Traditional';
  dosha: {
    vata: 'Balances' | 'Neutral' | 'Increases';
    pitta: 'Balances' | 'Neutral' | 'Increases';
    kapha: 'Balances' | 'Neutral' | 'Increases';
    bestTime: string;
  };
  summary: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  ayurvedicWisdom: string;
  healthBenefits: string[];
  faqs: { question: string; answer: string }[];
}

export const AYURVEDIC_RECIPES: RecipeItem[] = [
  {
    id: 'recipe-1',
    slug: 'vedic-golden-turmeric-milk-ghee-shilajit',
    title: 'Vedic Golden Turmeric Milk with A2 Ghee & Himalayan Shilajit',
    subtitle: 'Suvarna Haridra Ksheeram: The ancient restorative bedtime elixir for deep sleep, joint lubrication & cellular vitality',
    category: 'Ayurvedic Elixirs',
    image: '/images/recipe-golden-milk.jpg',
    readTime: '4 min read',
    prepTime: '5 mins',
    cookTime: '7 mins',
    baseServings: 1,
    difficulty: 'Easy',
    dosha: {
      vata: 'Balances',
      pitta: 'Balances',
      kapha: 'Balances',
      bestTime: 'Bedtime (9:00 PM – 10:00 PM)'
    },
    summary:
      'In traditional Charaka Samhita pharmacology, milk (Ksheeram) is the supreme Anupana (delivery vehicle) for fat-soluble Ayurvedic rasayanas. When paired with golden A2 Bilona Ghee and pure Himalayan Shilajit, the bio-actives easily permeate cell walls to rejuvenate tissues (Ojas) and induce deep restorative sleep.',
    ingredients: [
      {
        name: 'Savera Farm Fresh A2 Desi Cow Milk',
        amount: 250,
        unit: 'ml',
        notes: 'Cold-chain chilled, unhomogenized A2 beta-casein milk',
        saveraProductId: 'prod-a2-milk',
        saveraProductName: 'A2 Desi Cow Milk (1 Litre)',
        saveraProductPrice: 92,
        saveraProductImage: '/images/milk-bottle.png'
      },
      {
        name: 'Savera A2 Vedic Bilona Cow Ghee',
        amount: 1,
        unit: 'tsp',
        notes: 'Curd-churned golden bilona ghee rich in butyric acid',
        saveraProductId: 'prod-a2-ghee',
        saveraProductName: 'A2 Vedic Bilona Cow Ghee (500g)',
        saveraProductPrice: 1250,
        saveraProductImage: '/images/bilona-ghee.png'
      },
      {
        name: 'Savera Himalayan Shilajit Resin',
        amount: 1,
        unit: 'pea-sized dab (~100mg)',
        notes: 'Purified mineral pitch rich in fulvic acid',
        saveraProductId: 'prod-himalayan-shilajit',
        saveraProductName: 'Himalayan Shilajit Resin (20g)',
        saveraProductPrice: 950,
        saveraProductImage: '/images/himalayan-shilajit.png'
      },
      {
        name: 'Fresh Raw Turmeric Root (Grated) or Vedic Haldi',
        amount: 0.5,
        unit: 'tsp',
        notes: 'Unpolished organic turmeric rich in curcumin'
      },
      {
        name: 'Freshly Ground Black Peppercorn',
        amount: 1,
        unit: 'pinch',
        notes: 'Critical: Piperine enhances curcumin absorption by up to 2000%'
      },
      {
        name: 'Green Cardamom (Chhoti Elaichi)',
        amount: 2,
        unit: 'pods (crushed)',
        notes: 'Aromatic digestive stimulant'
      },
      {
        name: 'Kashmiri Kesar (Saffron Strands)',
        amount: 3,
        unit: 'strands',
        notes: 'Optional luxury garnish for golden hue & mood balance'
      },
      {
        name: 'Desi Khand or Raw Honey',
        amount: 1,
        unit: 'tsp',
        notes: 'Add raw honey only after milk cools to lukewarm; never heat honey!'
      }
    ],
    steps: [
      {
        number: 1,
        title: 'Gentle Simmer of A2 Milk',
        description:
          'Pour 250ml of Savera A2 Desi Cow Milk into a small brass or stainless steel saucepan. Turn heat to medium-low and bring to a gentle bubble.',
        proTip: 'Never rush milk on high flame; slow warming allows milk fats and proteins to stay harmoniously emulsified.'
      },
      {
        number: 2,
        title: 'Infuse Turmeric & Warming Aromatics',
        description:
          'Add the freshly grated turmeric (or organic haldi powder), crushed green cardamom pods, and a pinch of black pepper. Whisk gently and simmer for 4 minutes until the milk transforms into a rich, fragrant amber-gold.',
        proTip: 'Black pepper is non-negotiable: without piperine, the human gut excretes up to 95% of turmeric’s curcumin.'
      },
      {
        number: 3,
        title: 'Melt the A2 Bilona Ghee',
        description:
          'Turn off the flame. Stir in 1 teaspoon of Savera A2 Vedic Bilona Ghee. Watch it melt into a shimmering golden pool on the surface foam.',
        proTip: 'Ghee provides healthy medium-chain fats that coat the throat, lubricate dry joints, and ferry phytonutrients across the intestinal barrier.'
      },
      {
        number: 4,
        title: 'Dissolve the Himalayan Shilajit',
        description:
          'Using the back of a spoon or a wooden toothpick, take a small rice-to-pea sized dab of Savera Himalayan Shilajit Resin. Swirl it directly into the warm golden milk for 20-30 seconds until fully dissolved. Add saffron strands.',
        proTip: 'Shilajit dissolves completely in warm liquids without residue. If using honey instead of Desi Khand, wait until the cup is warm to touch (~45°C).'
      },
      {
        number: 5,
        title: 'Aeration & Sip Warm',
        description:
          'Pour the golden elixir between two cups from a 10-inch height twice to create a luscious velvet froth. Sip slowly 30 to 45 minutes before sleep.',
        proTip: 'Avoid looking at phone screens while sipping; let the warm, grounding aroma ease your nervous system into restorative parasympathetic rest.'
      }
    ],
    ayurvedicWisdom:
      'In Vedic Rasayana therapy, milk + ghee + shilajit creates a synergistic triad known as "Tri-Dhatukaran". The warm sweet nature of A2 milk grounds hyperactive Vata (anxiety, restless thoughts, insomnia), the cooling yet digestive quality of Bilona ghee soothes aggravated Pitta (acidity, inflammation), and the mineral density of Shilajit rebuilds depleted Ojas (vital vigor).',
    healthBenefits: [
      'Deep, restful REM sleep without grogginess',
      'Joint mobility and synovial fluid lubrication',
      'Enhanced cellular nutrient absorption via natural fulvic acid',
      'Reduced post-workout muscle soreness & joint inflammation',
      'Strengthened respiratory mucosal immunity'
    ],
    faqs: [
      {
        question: 'Can I drink this every night?',
        answer: 'Yes! This traditional golden milk formulation is formulated for daily nocturnal consumption, particularly during seasonal transitions and cooler months.'
      },
      {
        question: 'Why is A2 Desi cow milk better than standard dairy for this recipe?',
        answer: 'A2 milk contains 100% A2 beta-casein protein without the inflammatory BCM-7 peptide found in regular A1 milk, ensuring complete nighttime digestive lightness without bloating.'
      }
    ]
  },
  {
    id: 'recipe-2',
    slug: 'clay-pot-dahi-setting-savera-a2-milk',
    title: 'Clay-Pot Dahi Setting with Savera A2 Milk',
    subtitle: 'Mitti Ki Handi Curd: The traditional porous-clay method for thick, sweet, naturally probiotic-dense A2 curd',
    category: 'Dairy Craftsmanship',
    image: '/images/recipe-claypot-dahi.jpg',
    readTime: '5 min read',
    prepTime: '15 mins',
    cookTime: '6-8 hrs incubation',
    baseServings: 4,
    difficulty: 'Traditional',
    dosha: {
      vata: 'Balances',
      pitta: 'Balances',
      kapha: 'Neutral',
      bestTime: 'Lunch & Midday (12:00 PM – 2:30 PM)'
    },
    summary:
      'Authentic Indian Dahi is not just cultured milk — it is a living probiotic ecosystem. When set in an unglazed earthen clay pot (mitti ki handi), the porous walls breathe and absorb excess whey moisture, leaving behind a thick, custard-like curd with a rich golden malai crown and natural sweet undertones.',
    ingredients: [
      {
        name: 'Savera Farm Fresh A2 Desi Cow Milk',
        amount: 1,
        unit: 'Litre',
        notes: 'Full-cream unhomogenized A2 milk (4.2% - 4.8% natural fat)',
        saveraProductId: 'prod-a2-milk',
        saveraProductName: 'A2 Desi Cow Milk (1 Litre)',
        saveraProductPrice: 92,
        saveraProductImage: '/images/milk-bottle.png'
      },
      {
        name: 'Savera Farm Fresh Dahi (Live Starter / Jamun)',
        amount: 1.5,
        unit: 'tbsp',
        notes: 'Room temperature live indigenous lactic culture',
        saveraProductId: 'prod-farm-curd',
        saveraProductName: 'Farm Fresh Curd (Dahi) (400g)',
        saveraProductPrice: 65,
        saveraProductImage: '/images/farm-curd.png'
      },
      {
        name: 'Unglazed Terracotta Clay Pot (Mitti Ki Handi)',
        amount: 1,
        unit: 'pot (1 to 1.5L capacity)',
        notes: 'Natural porous clay absorbs excess water vapor'
      }
    ],
    steps: [
      {
        number: 1,
        title: 'Clay Pot Preparation & Sun-Drying',
        description:
          'Rinse your unglazed terracotta handi with warm water (never use dish soap, as clay absorbs chemicals). Let it dry completely in sunlight or warm air. Optional: rub a tiny drop of A2 ghee inside the clay rim.',
        proTip: 'A properly seasoned earthen pot infuses the curd with a nostalgic earthy petrichor aroma (saundhi khushboo).'
      },
      {
        number: 2,
        title: 'Slow Boiling & Aeration (Dhaar Maarna)',
        description:
          'Boil 1 Litre of Savera A2 milk on medium flame. Once it rises, reduce heat and simmer for 3-5 minutes. Take the pan off the heat and pour the milk between two vessels from a 12-inch height 4-5 times to aerate and build a thick frothy head.',
        proTip: 'This traditional step (*Dhaar Maarna*) cools the milk evenly while distributing the rich milk fat to form that coveted golden malai layer.'
      },
      {
        number: 3,
        title: 'The Luke-Warm Finger Test (40°C - 42°C)',
        description:
          'Pour the warm milk into the clay handi. Test the temperature with a clean pinky finger: you should be able to hold your finger inside comfortably for 10 seconds without discomfort.',
        proTip: 'If the milk is too hot, the friendly lactic acid bacteria die and curd splits into sour water. If too cold, fermentation stalls.'
      },
      {
        number: 4,
        title: 'Inoculating with Live Starter (Jamun)',
        description:
          'Whisk 1.5 tablespoons of room temperature starter dahi in a small cup until completely silky. Gently slide the starter along the inside walls of the handi and give ONE gentle circular stir in the center. Avoid over-stirring to keep the froth intact.',
        proTip: 'Always bring the starter dahi to room temperature 30 minutes prior. Chilled starter shocks the warm milk.'
      },
      {
        number: 5,
        title: 'Undisturbed Earthen Incubation',
        description:
          'Cover the clay pot with its terracotta lid or a porous cotton cloth. Place the pot in a warm, dark, completely draft-free corner (inside a switched-off oven or kitchen cabinet) for 6 to 8 hours (or 8-10 hours during Tricity winters wrapped in a warm shawl).',
        proTip: 'Never shake, move, or peek into the handi during setting; vibrations disturb the delicate lactic casein matrix.'
      },
      {
        number: 6,
        title: 'The 1-Hour Firming Chill',
        description:
          'Once set solid like a soft pudding, transfer the handi to the refrigerator for at least 1 hour before serving. This halts fermentation at optimal sweetness and firms the curd into thick, spoonable slices.',
        proTip: 'Serve chilled at lunchtime with a pinch of roasted cumin (bhuna jeera) and black salt.'
      }
    ],
    ayurvedicWisdom:
      'According to Ayurveda, Dahi is Grahi (absorbent, binds loose stools) and Deepana (ignites digestive Agni). Unlike industrial store-bought curd laden with stabilizers and pectin, earthen pot A2 dahi contains billions of wild live colony-forming units (CFUs) of Lactobacillus that re-inoculate the human gut microbiome.',
    healthBenefits: [
      'Natural probiotic support for gut dysbiosis and IBS',
      'Easily digested protein for lactose-sensitive individuals',
      'High bioavailable calcium and natural B12 synthesis in gut',
      'Natural cooling post-lunch effect against hyperacidity',
      'Promotes radiant skin health via gut-skin axis harmony'
    ],
    faqs: [
      {
        question: 'Why shouldn’t Dahi be eaten at night in Ayurveda?',
        answer: 'Ayurveda advises avoiding curd at night because its heavy (Guru) and channel-clogging (Abhishyandi) properties can aggravate Kapha, leading to mucus accumulation and sluggish morning metabolism.'
      },
      {
        question: 'Why does clay-pot curd taste sweeter than stainless steel set curd?',
        answer: 'Unglazed clay absorbs excess whey (water) through its microscopic pores, which concentrates the natural milk sugars (lactose) and fats into a richer, less acidic curd.'
      }
    ]
  },
  {
    id: 'recipe-3',
    slug: 'cold-pressed-mustard-oil-tadka-secrets',
    title: 'Cold-Pressed Mustard Oil Tadka Secrets',
    subtitle: 'Kachi Ghani Sarson Ka Tel: How to tame the pungency and unlock aromatic, heart-healthy golden tempering',
    category: 'Traditional Cooking',
    image: '/images/recipe-mustard-oil-tadka.jpg',
    readTime: '4 min read',
    prepTime: '5 mins',
    cookTime: '4 mins',
    baseServings: 4,
    difficulty: 'Easy',
    dosha: {
      vata: 'Balances',
      pitta: 'Neutral',
      kapha: 'Balances',
      bestTime: 'Lunch & Dinner'
    },
    summary:
      'Pure Kachi Ghani (cold-pressed) mustard oil is revered across Northern and Eastern India for its pungent kick and high smoke point. However, many modern cooks avoid it because raw pungency (jhaanjh) can overwhelm a dish. Master the 3-step ancient smoke-point temper to transform raw mustard oil into an aromatic, golden, sweet-nutty elixir.',
    ingredients: [
      {
        name: 'Savera Cold-Pressed Kachi Ghani Mustard Oil',
        amount: 2,
        unit: 'tbsp',
        notes: 'First-press virgin mustard oil pressed below 45°C',
        saveraProductId: 'prod-cold-mustard',
        saveraProductName: 'Cold Pressed Mustard Oil (1 Litre)',
        saveraProductPrice: 245,
        saveraProductImage: '/images/mustard-oil.png'
      },
      {
        name: 'Brown Mustard Seeds (Rai / Sarson ke Dane)',
        amount: 1,
        unit: 'tsp',
        notes: 'Whole spice for nutty crackle'
      },
      {
        name: 'Cumin Seeds (Jeera)',
        amount: 1,
        unit: 'tsp',
        notes: 'Digestive carminative'
      },
      {
        name: 'Asafoetida (Hing)',
        amount: 0.25,
        unit: 'tsp',
        notes: 'Anti-bloating Ayurvedic resin'
      },
      {
        name: 'Curry Leaves (Kadi Patta)',
        amount: 8,
        unit: 'leaves',
        notes: 'Fresh & dry; pat completely dry to avoid hot oil splatters'
      },
      {
        name: 'Whole Dried Kashmiri Red Chillies',
        amount: 2,
        unit: 'chillies',
        notes: 'Smoky warmth without burning spice'
      },
      {
        name: 'Garlic Cloves (Crushed)',
        amount: 3,
        unit: 'cloves',
        notes: 'Optional: creates a heavenly roasted aroma'
      }
    ],
    steps: [
      {
        number: 1,
        title: 'Use Cast-Iron or Heavy Brass Pan',
        description:
          'Place a heavy iron tadka pan or small kadai over medium heat. Pour in 2 tablespoons of Savera Cold-Pressed Mustard Oil. Heavy metal distributes heat evenly without burning delicate oil bonds.',
        proTip: 'Never use non-stick Teflon for mustard oil tadka; high heat degrades chemical coatings.'
      },
      {
        number: 2,
        title: 'The Smoke Point Milestone (Dhuan Nikalna)',
        description:
          'Heat the oil patiently until you see thin, translucent wisps of white smoke rising from the surface and the oil lightens from dark amber to radiant pale gold.',
        proTip: 'This flash point (*Dhuan Nikalna*) breaks down the sharp volatile compound allyl isothiocyanate, stripping away harsh eye-watering fumes while leaving behind pure nutty rich flavor.'
      },
      {
        number: 3,
        title: 'The 30-Second Cool-Down Window',
        description:
          'Crucial step: Remove the pan from direct flame or turn heat to lowest for 20-30 seconds. Allow the oil to cool slightly to around 160°C before introducing whole spices.',
        proTip: 'If you throw spices into smoking hot oil immediately, the jeera and hing will instantly burn black and turn bitter.'
      },
      {
        number: 4,
        title: 'Sequential Spice Infusion',
        description:
          'Return pan to low heat. Add brown mustard seeds first — wait 5 seconds until they vigorously crackle and pop. Immediately add cumin seeds, hing, crushed garlic, and whole dried red chillies. Finish with curry leaves.',
        proTip: 'Adding spices in order of density ensures hard seeds pop fully without burning tender leaves.'
      },
      {
        number: 5,
        title: 'The Covered Sizzle Pour (Chhownk)',
        description:
          'Immediately pour the sizzling fragrant tadka over your freshly cooked yellow dal, kadhi, paneer sabzi, or raita. Trap the aromatic steam by covering the pot with a tight lid for 2 full minutes.',
        proTip: 'Keeping the lid closed traps the essential aromatic oils (*Vashpa*) directly inside the curry rather than letting them escape into the kitchen air.'
      }
    ],
    ayurvedicWisdom:
      'Sarshapa Taila (Mustard Oil) is Ushna (heating) and Tikta-Katu (bitter-pungent) in Vipaka. It is the premier oil for dispelling stagnant Kapha, reducing lymphatic sluggishness, and igniting low digestive fire (Mandagni). Its rich monounsaturated fatty acid (MUFA) and balanced Omega-3 to Omega-6 ratio make it exceptionally heart-friendly.',
    healthBenefits: [
      'Heart health support: rich in cardioprotective MUFA and alpha-linolenic acid (ALA)',
      'Natural antimicrobial and antifungal properties from natural glucosinolates',
      'Stimulates digestive gastric juices and bile secretion',
      'Clear sinuses and bronchial passages during cold seasons',
      'Zero trans-fats, zero mineral oil, zero chemical argemone adulteration'
    ],
    faqs: [
      {
        question: 'What is the difference between Kachi Ghani and refined mustard oil?',
        answer: 'Kachi Ghani uses a traditional slow wooden press (*Kohlu*) below 45°C without solvent chemicals, preserving natural vitamins, tocopherols, and authentic mustard aroma. Refined oil uses petroleum solvents and high heat, stripping all nutritional value.'
      },
      {
        question: 'Can mustard oil be used for deep frying?',
        answer: 'Yes! Pure cold-pressed mustard oil has an exceptionally high smoke point of approximately 250°C (480°F), making it one of the safest, most stable traditional cooking mediums for frying without rancidity.'
      }
    ]
  }
];

