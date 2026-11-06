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
    manufacturingInfo: 'Milked and bottled at Savera Farms Unit-1, Chhattarpur / Gurugram belt.',
    origin: 'Savera Farms Organic Dairy Estate, Haryana',
    benefits: [
      'Contains easy-to-digest A2 Beta-Casein protein',
      'Rich in natural Vitamin A, Calcium, and B-Complex vitamins',
      'Non-homogenized & free from synthetic oxytocin or preservatives',
      'Supports gut health and immune vitality'
    ],
    howItIsMade: [
      '01. Morning milking of free-grazing Desi Gir & Sahiwal cows',
      '02. Immediate inline chilling at 4°C to maintain microbial freshness',
      '03. Automated zero-touch glass bottle filling and vacuum capping',
      '04. Dispatched in cold-chain insulated vans directly to your doorstep'
    ],
    faqs: [
      {
        question: 'What makes A2 Desi Cow Milk different from regular milk?',
        answer: 'A2 milk is derived exclusively from indigenous Indian cow breeds (like Gir & Sahiwal) that naturally produce the A2 beta-casein protein, which is significantly easier to digest and gentler on the stomach compared to A1 milk from crossbred cows.'
      },
      {
        question: 'Is the milk raw or pasteurized?',
        answer: 'We deliver fresh chilled farm milk. We recommend boiling it once before consumption according to traditional Indian household practice.'
      }
    ],
    images: [
      '/images/milk-bottle.png',
      '/images/milk-pouring.png'
    ],
    variants: [
      { id: 'var-a2m-1l', name: '1 Litre Glass Bottle', price: 92, mrp: 100, discountPct: 8, stock: 450, sku: 'SAV-MILK-A2-1L', weightVolume: '1 L' },
      { id: 'var-a2m-500ml', name: '500 ml Glass Bottle', price: 48, mrp: 52, discountPct: 7, stock: 320, sku: 'SAV-MILK-A2-500ML', weightVolume: '500 ml' },
      { id: 'var-a2m-2l', name: '2 Litre Family Can', price: 178, mrp: 195, discountPct: 9, stock: 180, sku: 'SAV-MILK-A2-2L', weightVolume: '2 L' }
    ],
    rating: 4.9,
    reviewCount: 418,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true
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
    manufacturingInfo: 'Hand-churned at Savera Farms Vedic Dairy Workshop, Gurugram.',
    origin: 'Savera Farms Dairy Estate',
    benefits: [
      'Made purely from A2 curd makkhan, high in butyric acid for gut health',
      'Granular texture with authentic traditional aroma',
      'High smoke point ideal for Indian cooking, sautéing, and medicinal use',
      'Supports joint mobility, cognitive memory, and immunity'
    ],
    howItIsMade: [
      '01. Boil fresh A2 milk and culture into natural dahi (curd)',
      '02. Bi-directional wooden bilona churning to extract fresh makkhan',
      '03. Slow simmering of makkhan over low fire in brass vessels',
      '04. Golden ghee strained into glass jars without preservatives'
    ],
    faqs: [
      {
        question: 'Why is Bilona Ghee superior to commercial cream ghee?',
        answer: 'Commercial ghee is made directly from industrial milk cream using high heat and centrifuges. Bilona Ghee is made from cultured dahi (curd), which preserves enzymes, natural aroma, granular texture, and digestive health benefits.'
      }
    ],
    images: [
      '/images/bilona-ghee.png',
      '/images/bilona-ghee-texture.png'
    ],
    variants: [
      { id: 'var-ghee-500g', name: '500g Glass Jar', price: 949, mrp: 1099, discountPct: 14, stock: 120, sku: 'SAV-GHEE-BIL-500G', weightVolume: '500 g' },
      { id: 'var-ghee-1kg', name: '1 kg Glass Jar', price: 1849, mrp: 2199, discountPct: 16, stock: 85, sku: 'SAV-GHEE-BIL-1KG', weightVolume: '1 kg' },
      { id: 'var-ghee-250g', name: '250g Glass Jar', price: 499, mrp: 575, discountPct: 13, stock: 60, sku: 'SAV-GHEE-BIL-250G', weightVolume: '250 g' }
    ],
    rating: 4.95,
    reviewCount: 312,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true
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
      'Free from argemone oil, hexanes, or chemical refining'
    ],
    howItIsMade: [
      '01. Sun-dried high-grade mustard seeds selection',
      '02. Slow cold extraction in Marachekku (wooden press) below 40°C',
      '03. Natural cloth filtration without chemical bleaching'
    ],
    faqs: [
      {
        question: 'What is Kachi Ghani Wood Pressing?',
        answer: 'Wood pressing uses slow wooden rotors that generate minimal heat (under 40°C), ensuring natural nutrients, aroma, and essential fatty acids are preserved.'
      }
    ],
    images: [
      '/images/mustard-oil.png'
    ],
    variants: [
      { id: 'var-must-1l', name: '1 Litre Glass Bottle', price: 240, mrp: 280, discountPct: 14, stock: 210, sku: 'SAV-OIL-MUST-1L', weightVolume: '1 L' },
      { id: 'var-must-5l', name: '5 Litre Can', price: 1150, mrp: 1350, discountPct: 15, stock: 65, sku: 'SAV-OIL-MUST-5L', weightVolume: '5 L' }
    ],
    rating: 4.8,
    reviewCount: 184,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: true
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
      { label: 'Calcium', value: '208 mg' }
    ],
    storageInstructions: 'Refrigerate immediately between 1°C to 4°C. Immerse in clean water to keep extra soft.',
    shelfLife: '5 Days from delivery.',
    manufacturingInfo: 'Made daily at Savera Farms Dairy Kitchen.',
    origin: 'Savera Farms',
    benefits: [
      'High bioavailable protein ideal for daily fitness & nourishment',
      'Ultra soft texture, naturally rich and creamy',
      'No added starch, preservatives, or synthetic additives'
    ],
    howItIsMade: [
      '01. Boiling pure A2 milk and coagulating with fresh lemon extract',
      '02. Gentle pressing in muslin cloth to retain natural moisture',
      '03. Vacuum packed fresh every morning for delivery'
    ],
    faqs: [
      {
        question: 'How long does the Paneer stay fresh?',
        answer: 'Our paneer is 100% natural without preservatives. It stays fresh for 5 days in the refrigerator. We recommend keeping it immersed in a bowl of fresh water.'
      }
    ],
    images: [
      '/images/fresh-paneer.png',
      '/images/fresh-paneer-slices.png'
    ],
    variants: [
      { id: 'var-pan-250g', name: '250g Pack', price: 130, mrp: 150, discountPct: 13, stock: 95, sku: 'SAV-PAN-250G', weightVolume: '250 g' },
      { id: 'var-pan-500g', name: '500g Pack', price: 250, mrp: 290, discountPct: 14, stock: 70, sku: 'SAV-PAN-500G', weightVolume: '500 g' }
    ],
    rating: 4.88,
    reviewCount: 210,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: true
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
      { label: 'Probiotic Bacteria Count', value: '> 10^8 CFU/g' }
    ],
    storageInstructions: 'Refrigerate at 2°C to 5°C.',
    shelfLife: '7 Days when refrigerated.',
    manufacturingInfo: 'Set in clay matkas at Savera Dairy.',
    origin: 'Savera Farms',
    benefits: [
      'High probiotic density aids digestion and gut immunity',
      'Thick natural consistency without artificial thickeners or gelatin'
    ],
    howItIsMade: ['01. Milk boiled to 85°C and cooled', '02. Inoculated with traditional jamun', '03. Set in eco-friendly containers'],
    faqs: [],
    images: [
      '/images/farm-curd.png'
    ],
    variants: [
      { id: 'var-curd-500g', name: '500g Matka Container', price: 65, mrp: 75, discountPct: 13, stock: 140, sku: 'SAV-CURD-500G', weightVolume: '500 g' },
      { id: 'var-curd-1kg', name: '1 kg Family Bucket', price: 120, mrp: 140, discountPct: 14, stock: 90, sku: 'SAV-CURD-1KG', weightVolume: '1 kg' }
    ],
    rating: 4.9,
    reviewCount: 165,
    isSubscriptionEligible: true,
    isBestSeller: true,
    isFeatured: false
  },
  {
    id: 'prod-cold-groundnut',
    name: 'Cold-Pressed Groundnut Oil (Wood Kolhu)',
    tagline: 'Aromatic & Healthy Unrefined Peanut Oil',
    category: 'Oils',
    subcategory: 'Cold Pressed Oils',
    description: 'Pressed from sun-dried Saurashtra groundnuts. High smoke point oil with a sweet nut aroma, ideal for daily frying, baking, and traditional Indian curries.',
    ingredients: ['100% Cold Pressed Groundnut Seeds'],
    nutritionalInfo: [{ label: 'Energy', value: '884 kcal' }, { label: 'MUFA', value: '48 g' }],
    storageInstructions: 'Store in cool place.',
    shelfLife: '9 Months.',
    manufacturingInfo: 'Savera Cold Press Mill.',
    origin: 'Savera Farms',
    benefits: ['Cholesterol free', 'Rich in natural Vitamin E'],
    howItIsMade: ['Slow wood press extraction'],
    faqs: [],
    images: [
      '/images/groundnut-oil.png'
    ],
    variants: [
      { id: 'var-gnut-1l', name: '1 Litre Glass Bottle', price: 260, mrp: 300, discountPct: 13, stock: 110, sku: 'SAV-OIL-GNUT-1L', weightVolume: '1 L' }
    ],
    rating: 4.75,
    reviewCount: 94,
    isSubscriptionEligible: false,
    isBestSeller: false,
    isFeatured: false
  }
];

export const SEED_SUBSCRIPTIONS: MilkSubscription[] = [
  {
    id: 'SUB-1001',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    productId: 'prod-a2-milk',
    productName: 'A2 Desi Cow Milk',
    variantId: 'var-a2m-1l',
    variantName: '1 Litre Glass Bottle',
    quantityPerDelivery: 1,
    pricePerUnit: 92,
    frequency: 'Daily',
    deliverySlot: '5:00 AM - 7:00 AM',
    deliveryAddress: {
      id: 'addr-1',
      fullName: 'Priya Sharma',
      mobileNumber: '9876543210',
      houseFlat: 'B-402, Sunshine Apartments',
      street: 'Golf Course Road, Sector 54',
      area: 'DLF Phase 5',
      landmark: 'Near One Horizon Center',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      type: 'Home'
    },
    startDate: '2026-08-01',
    status: 'Active',
    skippedDates: ['2026-08-25', '2026-08-29'],
    nextDeliveryDate: '2026-08-24',
    monthlyEstimate: 2576
  },
  {
    id: 'SUB-1002',
    customerId: 'cust-102',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 99887 76655',
    productId: 'prod-a2-milk',
    productName: 'A2 Desi Cow Milk',
    variantId: 'var-a2m-2l',
    variantName: '2 Litre Family Can',
    quantityPerDelivery: 1,
    pricePerUnit: 178,
    frequency: 'Alternate Days',
    deliverySlot: '7:00 AM - 9:00 AM',
    deliveryAddress: {
      id: 'addr-2',
      fullName: 'Vikram Mehta',
      mobileNumber: '9988776655',
      houseFlat: 'Villa 12, Green Meadows',
      street: 'Sohna Road',
      area: 'Sector 48',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122018',
      type: 'Home'
    },
    startDate: '2026-08-10',
    status: 'Active',
    skippedDates: [],
    nextDeliveryDate: '2026-08-24',
    monthlyEstimate: 2670
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    orderNumber: 'SAV-9821',
    customerId: 'cust-101',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    items: [
      { productId: 'prod-a2-milk', productName: 'A2 Desi Cow Milk', variantId: 'var-a2m-1l', variantName: '1 Litre Glass Bottle', price: 92, quantity: 1, isSubscription: true, image: '/images/milk-bottle.png' },
      { productId: 'prod-fresh-paneer', productName: 'Fresh Malai A2 Desi Cow Paneer', variantId: 'var-pan-250g', variantName: '250g Pack', price: 130, quantity: 1, isSubscription: false, image: '/images/fresh-paneer.png' }
    ],
    subtotal: 222,
    deliveryFee: 0,
    discount: 22,
    couponCode: 'FIRST100',
    tax: 0,
    totalAmount: 200,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    deliveryAddress: {
      id: 'addr-1',
      fullName: 'Priya Sharma',
      mobileNumber: '9876543210',
      houseFlat: 'B-402, Sunshine Apartments',
      street: 'Golf Course Road, Sector 54',
      area: 'DLF Phase 5',
      landmark: 'Near One Horizon Center',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      type: 'Home'
    },
    deliveryDate: '2026-08-24',
    deliverySlot: '5:00 AM - 7:00 AM',
    status: 'Out for Delivery',
    driverName: 'Ramesh Kumar (Savera Express)',
    driverPhone: '+91 98112 33445',
    otp: '4829',
    createdAt: '2026-08-23T14:30:00Z',
    updatedAt: '2026-08-23T16:10:00Z'
  },
  {
    id: 'ORD-9820',
    orderNumber: 'SAV-9820',
    customerId: 'cust-103',
    customerName: 'Ananya Gupta',
    customerPhone: '+91 97111 22334',
    items: [
      { productId: 'prod-a2-ghee', productName: 'A2 Vedic Bilona Cow Ghee', variantId: 'var-ghee-500g', variantName: '500g Glass Jar', price: 949, quantity: 1, isSubscription: false, image: '/images/bilona-ghee.png' }
    ],
    subtotal: 949,
    deliveryFee: 0,
    discount: 100,
    couponCode: 'PURE100',
    tax: 0,
    totalAmount: 849,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    deliveryAddress: {
      id: 'addr-3',
      fullName: 'Ananya Gupta',
      mobileNumber: '9711122334',
      houseFlat: 'E-12, Vasant Vihar',
      street: 'Paschimi Marg',
      area: 'Vasant Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110057',
      type: 'Home'
    },
    deliveryDate: '2026-08-24',
    deliverySlot: '7:00 AM - 9:00 AM',
    status: 'Packed',
    driverName: 'Suresh Yadav',
    driverPhone: '+91 97188 99001',
    otp: '1934',
    createdAt: '2026-08-23T11:15:00Z',
    updatedAt: '2026-08-23T13:00:00Z'
  }
];

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
  { id: 'zone-1', pincode: '122002', areaName: 'DLF Phase 1-5 & Golf Course Rd (Gurugram)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 150, eveningSlotCap: 80, isServiceable: true },
  { id: 'zone-2', pincode: '122018', areaName: 'Sohna Road & Sector 47-50 (Gurugram)', deliveryFee: 30, freeThreshold: 299, morningSlotCap: 120, eveningSlotCap: 60, isServiceable: true },
  { id: 'zone-3', pincode: '110057', areaName: 'Vasant Vihar & Chhattarpur (New Delhi)', deliveryFee: 40, freeThreshold: 399, morningSlotCap: 100, eveningSlotCap: 50, isServiceable: true }
];

export const SEED_COUPONS: Coupon[] = [
  { code: 'FIRST100', discountType: 'Flat Amount', discountValue: 100, minOrderAmount: 299, description: '₹100 Off on your first Savera order', validUntil: '2026-12-31' },
  { code: 'SUBSCRIPTION10', discountType: 'Percentage', discountValue: 10, minOrderAmount: 500, description: '10% Off on Milk Subscriptions', validUntil: '2026-12-31' },
  { code: 'PUREA2', discountType: 'Flat Amount', discountValue: 50, minOrderAmount: 350, description: '₹50 Instant Discount on A2 Dairy Products', validUntil: '2026-09-30' }
];

export const SEED_CUSTOMER: CustomerProfile = {
  id: 'cust-101',
  fullName: 'Priya Sharma',
  phone: '+91 98765 43210',
  email: 'priya.sharma@example.com',
  walletBalance: 350,
  rewardPoints: 180,
  referralCode: 'SAV-PRIYA100',
  totalOrders: 14,
  totalSpent: 4820,
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Priya Sharma',
      mobileNumber: '9876543210',
      houseFlat: 'B-402, Sunshine Apartments',
      street: 'Golf Course Road, Sector 54',
      area: 'DLF Phase 5',
      landmark: 'Near One Horizon Center',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      type: 'Home'
    }
  ]
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
