// Types for Savera Farms Platform

export type CategoryType =
  | 'Milk'
  | 'Ghee'
  | 'Oils'
  | 'Dairy'
  | 'Farm Products'
  | 'Herbal & Wellness'
  | 'Personal Care'
  | 'Traditional Staples'
  | 'Mindful Living';

export interface ProductVariant {
  id: string;
  name: string; // e.g., '1 L', '500 ml', '1 kg'
  price: number;
  mrp: number;
  discountPct: number;
  stock: number;
  sku: string;
  weightVolume: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: CategoryType;
  subcategory?: string;
  description: string;
  ingredients: string[];
  fatPercentage?: string;
  nutritionalInfo: { label: string; value: string }[];
  storageInstructions: string;
  shelfLife: string;
  manufacturingInfo: string;
  origin: string;
  benefits: string[];
  howItIsMade: string[];
  faqs: { question: string; answer: string }[];
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isSubscriptionEligible: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export type SubscriptionFrequency = 'Daily' | 'Alternate Days' | '3 Days/Week' | 'Weekly' | 'Custom';
export type DeliverySlot = '5:00 AM - 7:00 AM' | '7:00 AM - 9:00 AM' | '5:00 PM - 7:00 PM';
export type SubscriptionStatus = 'Active' | 'Paused' | 'Cancelled';

export interface MilkSubscription {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantityPerDelivery: number;
  pricePerUnit: number;
  frequency: SubscriptionFrequency;
  customDays?: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  deliverySlot: DeliverySlot;
  deliveryAddress: Address;
  startDate: string;
  status: SubscriptionStatus;
  pausedUntil?: string;
  skippedDates: string[]; // ['2026-08-25', '2026-08-29']
  nextDeliveryDate: string;
  monthlyEstimate: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
  isSubscription?: boolean;
  image: string;
}

export interface Address {
  id: string;
  fullName: string;
  mobileNumber: string;
  houseFlat: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  tax: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallets' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  deliveryAddress: Address;
  deliveryDate: string;
  deliverySlot: DeliverySlot;
  status: OrderStatus;
  driverName?: string;
  driverPhone?: string;
  otp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchItem {
  id: string;
  batchId: string; // e.g., BATCH-20260820-A2M
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  productionDate: string;
  expiryDate: string;
  quantityProduced: number;
  quantitySold: number;
  wastage: number;
  unitCost: number;
  supplierSource: string;
  status: 'Fresh' | 'Expiring Soon' | 'Expired' | 'Depleted';
}

export interface ProductionRecord {
  id: string;
  date: string;
  productName: string;
  rawMaterialUsed: string;
  inputQuantity: string;
  outputQuantity: string;
  wastage: string;
  batchNumber: string;
  productionCost: number;
  operator: string;
  efficiencyPct: number;
  notes?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'Milk' | 'Packaging' | 'Ingredients' | 'Containers';
  currentStock: number;
  unit: string;
  minStockLevel: number;
  costPerUnit: number;
  lastRestocked: string;
  supplier: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  paymentTerms: string;
  productsSupplied: string;
  outstandingBalance: number;
  rating: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  itemDescription: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
  expectedDelivery: string;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Partially Received' | 'Received' | 'Cancelled';
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  pincode: string;
  areaName: string;
  deliveryFee: number;
  freeThreshold: number;
  morningSlotCap: number;
  eveningSlotCap: number;
  isServiceable: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'Percentage' | 'Flat Amount';
  discountValue: number; // e.g. 10 for 10% or 100 for ₹100
  minOrderAmount: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
}

export interface WalletTransaction {
  id: string;
  customerId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  walletBalance: number;
  rewardPoints: number;
  referralCode: string;
  totalOrders: number;
  totalSpent: number;
  addresses: Address[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  isApproved: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  issueCategory: 'Order Issue' | 'Delivery Issue' | 'Payment Issue' | 'Product Issue' | 'Subscription Issue' | 'Refund' | 'Other';
  description: string;
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  createdAt: string;
  internalNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  details: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  readTime: string;
}

export type AdminRole = 'Super Admin' | 'Inventory Manager' | 'Production Manager' | 'Delivery Manager' | 'Customer Support' | 'Delivery Executive';
