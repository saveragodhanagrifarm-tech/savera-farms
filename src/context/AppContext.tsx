'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  OrderItem,
  Address,
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
  WalletTransaction,
  SupportTicket,
  AuditLog,
  Review,
  AdminRole,
} from '@/types';
import {
  SEED_PRODUCTS,
  SEED_SUBSCRIPTIONS,
  SEED_ORDERS,
  SEED_BATCHES,
  SEED_PRODUCTION,
  SEED_RAW_MATERIALS,
  SEED_SUPPLIERS,
  SEED_PURCHASE_ORDERS,
  SEED_DELIVERY_ZONES,
  SEED_COUPONS,
  SEED_CUSTOMER,
  SEED_TICKETS,
  SEED_AUDIT_LOGS,
  SEED_REVIEWS,
  getStoredData,
  setStoredData,
} from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Cart
  cart: OrderItem[];
  addToCart: (product: Product, variantId: string, quantity?: number, isSubscription?: boolean) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  cartSubtotal: number;
  cartDiscount: number;
  freeShippingThreshold: number;
  deliveryFee: number;
  cartTotal: number;

  // Customer Profile & Pincode
  customer: CustomerProfile;
  selectedPincode: string;
  setSelectedPincode: (pin: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => string;
  updateAddress: (id: string, address: Partial<Omit<Address, 'id'>>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  resetToFreshBaseline: () => void;
  rechargeWallet: (amount: number, referenceId?: string, description?: string) => void;
  debitWallet: (amount: number, referenceId?: string, description?: string) => boolean;
  walletTransactions: WalletTransaction[];
  isAfterCutoff: boolean;
  earliestDeliveryDate: string;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;

  // Milk Subscriptions
  subscriptions: MilkSubscription[];
  addSubscription: (sub: Omit<MilkSubscription, 'id' | 'startDate' | 'status' | 'skippedDates' | 'nextDeliveryDate'>) => void;
  togglePauseSubscription: (subId: string) => void;
  skipSubscriptionDate: (subId: string, dateStr: string) => void;
  cancelSubscription: (subId: string) => void;
  updateSubscription: (subId: string, updates: Partial<MilkSubscription>) => void;

  // Orders
  orders: Order[];
  placeOrder: (
    address: Address,
    slot: MilkSubscription['deliverySlot'],
    paymentMethod: Order['paymentMethod']
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Admin Data & Management
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> | Product) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductPrice: (productId: string, variantId: string, newPrice: number, newMrp?: number) => void;
  deleteProduct: (id: string) => void;
  batches: BatchItem[];
  addBatch: (batch: Omit<BatchItem, 'id' | 'quantitySold' | 'status'>) => void;
  productionLogs: ProductionRecord[];
  addProductionLog: (log: Omit<ProductionRecord, 'id' | 'efficiencyPct'>) => void;
  rawMaterials: RawMaterial[];
  restockRawMaterial: (id: string, amount: number) => void;
  addRawMaterial: (rm: Omit<RawMaterial, 'id'>) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  deliveryZones: DeliveryZone[];
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  toggleZoneServiceable: (pincode: string) => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: {
    name: string;
    phone: string;
    category: SupportTicket['issueCategory'];
    description: string;
  }) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  auditLogs: AuditLog[];
  logAuditAction: (action: string, entity: string, details: string) => void;
  clearAuditLogs: () => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'isVerified' | 'isApproved'>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();

  // Local state initialized from localStorage/seed
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(SEED_COUPONS);
  const [customer, setCustomer] = useState<CustomerProfile>(SEED_CUSTOMER);
  const [selectedPincode, setSelectedPincode] = useState<string>('134109');
  const [subscriptions, setSubscriptions] = useState<MilkSubscription[]>(SEED_SUBSCRIPTIONS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [batches, setBatches] = useState<BatchItem[]>(SEED_BATCHES);
  const [productionLogs, setProductionLogs] = useState<ProductionRecord[]>(SEED_PRODUCTION);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(SEED_RAW_MATERIALS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SEED_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(SEED_PURCHASE_ORDERS);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(SEED_DELIVERY_ZONES);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(SEED_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const isHydrated = useRef(false);

  // Load stored data on mount
  useEffect(() => {
    const rawStoredProducts = getStoredData<Product[]>('savera_products_v4', SEED_PRODUCTS);
    const storedMap = new Map((rawStoredProducts || []).map((p) => [p.id, p]));
    const mergedProducts = SEED_PRODUCTS.map((sp) => {
      const custom = storedMap.get(sp.id);
      return custom ? { ...sp, ...custom } : sp;
    });
    // Append any extra products added dynamically
    (rawStoredProducts || []).forEach((p) => {
      if (!SEED_PRODUCTS.some((sp) => sp.id === p.id)) {
        mergedProducts.push(p);
      }
    });
    setProducts(mergedProducts);

    setCart(getStoredData('savera_cart_v2', []));
    setCoupons(getStoredData('savera_coupons_v2', SEED_COUPONS));
    setSubscriptions(getStoredData('savera_subscriptions_v3', SEED_SUBSCRIPTIONS));
    setOrders(getStoredData('savera_orders_v3', SEED_ORDERS));
    setBatches(getStoredData('savera_batches_v2', SEED_BATCHES));
    setProductionLogs(getStoredData('savera_production_v2', SEED_PRODUCTION));
    setRawMaterials(getStoredData('savera_raw_v2', SEED_RAW_MATERIALS));
    setSuppliers(getStoredData('savera_suppliers_v2', SEED_SUPPLIERS));
    setPurchaseOrders(getStoredData('savera_purchase_orders_v2', SEED_PURCHASE_ORDERS));
    setDeliveryZones(getStoredData('savera_zones_v3', SEED_DELIVERY_ZONES));
    setCustomer(getStoredData('savera_customer_v2', SEED_CUSTOMER));
    setWalletTransactions(getStoredData('savera_wallet_tx_v3', []));
    setSupportTickets(getStoredData('savera_tickets_v2', SEED_TICKETS));
    setAuditLogs(getStoredData('savera_audit_v2', SEED_AUDIT_LOGS));
    setReviews(getStoredData('savera_reviews_v2', SEED_REVIEWS));
    isHydrated.current = true;
  }, []);

  // Synchronize authenticated user identity, orders, and subscriptions
  useEffect(() => {
    if (user) {
      const realName = profile?.full_name || (user.user_metadata as any)?.full_name || user.email?.split('@')[0] || 'Savera Member';
      const realPhone = profile?.phone || (user.user_metadata as any)?.phone || '';
      const realEmail = user.email || profile?.email || '';
      const codeBase = realName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'SAVERA';
      const dynamicReferral = `SAV-${codeBase}100`;

      // Load user-scoped addresses from local storage
      const userAddressesKey = `savera_user_addresses_${user.id}`;
      const userAddresses = getStoredData<Address[]>(userAddressesKey, []);

      // Load user-scoped wallet balance
      const userWalletKey = `savera_user_wallet_${user.id}`;
      const initialWallet = typeof profile?.wallet_balance === 'number' ? profile.wallet_balance : 0;
      const storedWallet = getStoredData<number>(userWalletKey, initialWallet);

      // Load existing local orders and merge with user-specific stored orders
      const userOrdersKey = `savera_user_orders_${user.id}`;
      const localUserOrders = getStoredData<Order[]>(userOrdersKey, []);
      const platformOrders = getStoredData<Order[]>('savera_orders_v3', []);

      const initialOrderMap = new Map<string, Order>();
      platformOrders.forEach((o) => initialOrderMap.set(o.orderNumber || o.id, o));
      localUserOrders.forEach((o) => initialOrderMap.set(o.orderNumber || o.id, o));
      const combinedInitialOrders = Array.from(initialOrderMap.values());
      if (combinedInitialOrders.length > 0) {
        setOrders(combinedInitialOrders);
      }

      // Load existing local subscriptions
      const userSubsKey = `savera_user_subs_${user.id}`;
      const localUserSubs = getStoredData<MilkSubscription[]>(userSubsKey, []);
      const platformSubs = getStoredData<MilkSubscription[]>('savera_subscriptions_v3', []);
      const initialSubMap = new Map<string, MilkSubscription>();
      platformSubs.forEach((s) => initialSubMap.set(s.id, s));
      localUserSubs.forEach((s) => initialSubMap.set(s.id, s));
      const combinedInitialSubs = Array.from(initialSubMap.values());
      if (combinedInitialSubs.length > 0) {
        setSubscriptions(combinedInitialSubs);
      }

      setCustomer((prev) => ({
        id: user.id,
        fullName: realName,
        email: realEmail,
        phone: realPhone || prev.phone,
        walletBalance: storedWallet,
        rewardPoints: typeof profile?.reward_points === 'number' ? profile.reward_points : 50,
        referralCode: dynamicReferral,
        totalOrders: combinedInitialOrders.filter(o => o.customerId === user.id || (o.customerEmail && o.customerEmail.toLowerCase() === realEmail.toLowerCase())).length || prev.totalOrders,
        totalSpent: prev.totalSpent,
        addresses: userAddresses,
      }));

      // Fetch user-specific orders from Supabase (MERGE rather than replace)
      supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${user.id},customer_name.eq.${realName},customer_phone.eq.${realPhone}`)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (data && !error) {
            const fetchedUserOrders: Order[] = data.map((d: any) => ({
              id: d.id,
              orderNumber: d.order_number,
              customerId: d.user_id || user.id,
              customerName: d.customer_name || realName,
              customerPhone: d.customer_phone || realPhone,
              customerEmail: realEmail,
              items: d.items || [],
              subtotal: Number(d.subtotal) || 0,
              deliveryFee: Number(d.delivery_fee) || 0,
              discount: Number(d.discount) || 0,
              tax: 0,
              totalAmount: Number(d.total_amount) || 0,
              paymentMethod: (d.payment_method as any) || 'UPI',
              paymentStatus: (d.payment_status as any) || 'Paid',
              deliveryAddress: d.delivery_address || {},
              deliveryDate: d.delivery_date || '',
              deliverySlot: d.delivery_slot || '5:00 AM - 7:00 AM',
              status: (d.status as any) || 'Order Placed',
              driverName: d.driver_name || 'Ramesh Kumar (Savera Delivery Partner)',
              driverPhone: d.driver_phone || '+91 98112 33445',
              otp: d.otp || '4821',
              createdAt: d.created_at || new Date().toISOString(),
              updatedAt: d.created_at || new Date().toISOString(),
            }));

            // Safely merge Supabase orders with existing local orders
            setOrders((prevOrders) => {
              const orderMap = new Map<string, Order>();
              prevOrders.forEach((o) => orderMap.set(o.orderNumber || o.id, o));
              localUserOrders.forEach((o) => {
                const key = o.orderNumber || o.id;
                if (!orderMap.has(key)) orderMap.set(key, o);
              });
              fetchedUserOrders.forEach((o) => {
                const key = o.orderNumber || o.id;
                if (orderMap.has(key)) {
                  orderMap.set(key, { ...orderMap.get(key)!, ...o });
                } else {
                  orderMap.set(key, o);
                }
              });
              const merged = Array.from(orderMap.values());
              if (typeof window !== 'undefined') {
                localStorage.setItem('savera_orders_v3', JSON.stringify(merged));
                localStorage.setItem(userOrdersKey, JSON.stringify(merged.filter(o => o.customerId === user.id || o.customerEmail?.toLowerCase() === realEmail.toLowerCase())));
              }
              return merged;
            });

            setCustomer((c) => ({
              ...c,
              totalOrders: fetchedUserOrders.length || c.totalOrders,
              totalSpent: fetchedUserOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0) || c.totalSpent,
            }));
          }
        });

      // Fetch user-specific subscriptions from Supabase (MERGE rather than replace)
      supabase
        .from('subscriptions')
        .select('*')
        .or(`user_id.eq.${user.id},customer_name.eq.${realName},customer_phone.eq.${realPhone}`)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (data && !error) {
            const fetchedUserSubs: MilkSubscription[] = data.map((d: any) => ({
              id: d.id,
              customerId: d.user_id || user.id,
              customerName: d.customer_name || realName,
              customerPhone: d.customer_phone || realPhone,
              productId: d.product_id,
              productName: d.product_name,
              variantId: d.variant_id || 'var-1L',
              variantName: d.variant_name || '1 Litre Glass Bottle',
              quantityPerDelivery: d.quantity || 1,
              pricePerUnit: d.monthly_cost ? Math.round(d.monthly_cost / (30 * (d.quantity || 1))) : 95,
              frequency: (d.schedule_type as any) || 'Daily',
              customDays: d.custom_days || [],
              deliverySlot: (d.delivery_slot as any) || '5:00 AM - 7:00 AM',
              deliveryAddress: d.delivery_address || {},
              startDate: d.start_date || new Date().toISOString().split('T')[0],
              status: (d.status as any) || 'Active',
              skippedDates: [],
              nextDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              monthlyEstimate: Number(d.monthly_cost) || 2850,
            }));

            setSubscriptions((prevSubs) => {
              const subMap = new Map<string, MilkSubscription>();
              prevSubs.forEach((s) => subMap.set(s.id, s));
              localUserSubs.forEach((s) => {
                if (!subMap.has(s.id)) subMap.set(s.id, s);
              });
              fetchedUserSubs.forEach((s) => {
                if (subMap.has(s.id)) {
                  subMap.set(s.id, { ...subMap.get(s.id)!, ...s });
                } else {
                  subMap.set(s.id, s);
                }
              });
              const merged = Array.from(subMap.values());
              if (typeof window !== 'undefined') {
                localStorage.setItem('savera_subscriptions_v3', JSON.stringify(merged));
                localStorage.setItem(userSubsKey, JSON.stringify(merged.filter(s => s.customerId === user.id)));
              }
              return merged;
            });
          }
        });
    } else {
      setCustomer({
        id: 'cust-guest',
        fullName: 'Savera Guest',
        phone: '+91 98765 43210',
        email: 'guest@saverafarms.com',
        walletBalance: 0,
        rewardPoints: 50,
        referralCode: 'SAV-WELCOME100',
        totalOrders: 0,
        totalSpent: 0,
        addresses: [],
      });
      // CRITICAL: Do NOT wipe orders or subscriptions to []!
      // During initial page load or reloads, user is null for several milliseconds before
      // Supabase getSession() returns. Wiping here wipes localStorage permanently.
    }
  }, [user, profile]);

  // Save to storage (only after hydration)
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_cart_v2', cart);
  }, [cart]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_coupons_v2', coupons);
  }, [coupons]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_subscriptions_v3', subscriptions);
  }, [subscriptions]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_orders_v3', orders);
  }, [orders]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_batches_v2', batches);
  }, [batches]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_production_v2', productionLogs);
  }, [productionLogs]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_raw_v2', rawMaterials);
  }, [rawMaterials]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_suppliers_v2', suppliers);
  }, [suppliers]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_purchase_orders_v2', purchaseOrders);
  }, [purchaseOrders]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_zones_v2', deliveryZones);
  }, [deliveryZones]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_customer_v2', customer);
  }, [customer]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_tickets_v2', supportTickets);
  }, [supportTickets]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_audit_v2', auditLogs);
  }, [auditLogs]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_reviews_v2', reviews);
  }, [reviews]);

  // Toast handler
  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, variantId: string, quantity: number = 1, isSubscription: boolean = false) => {
    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.variantId === variant.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            variantName: variant.name,
            price: variant.price,
            quantity,
            isSubscription,
            image: product.images[0],
          },
        ];
      }
    });
    addToast('Added to Cart', `${product.name} (${variant.name}) x${quantity} added.`, 'success');
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
    addToast('Removed Item', 'Item removed from your cart.', 'info');
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Pricing math
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'Flat Amount') {
      cartDiscount = appliedCoupon.discountValue;
    } else {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
        cartDiscount = appliedCoupon.maxDiscount;
      }
    }
  }

  // Active zone delivery fee check
  const activeZone = deliveryZones.find((z) => z.pincode === selectedPincode);
  const freeShippingThreshold = activeZone?.freeThreshold || 299;
  const baseDeliveryFee = activeZone?.deliveryFee ?? 30;
  const deliveryFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : baseDeliveryFee;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === formatted);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return { success: false, message: `Minimum order value of ₹${found.minOrderAmount} required for coupon ${formatted}.` };
    }
    setAppliedCoupon(found);
    addToast('Coupon Applied!', `${found.description}`, 'success');
    return { success: true, message: `Coupon ${formatted} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Coupon removed from cart.', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addToast('Coupon Created', `Code ${coupon.code} is now active.`, 'success');
    logAuditAction('Created Coupon', coupon.code, `Added coupon with discount: ${coupon.discountValue}`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) setAppliedCoupon(null);
    addToast('Coupon Deleted', `Coupon ${code} removed.`, 'info');
    logAuditAction('Deleted Coupon', code, 'Removed promotional coupon code');
  };

  // Addresses & Profile
  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newId = 'addr-' + Date.now();
    const newAddr: Address = { ...addrData, id: newId };
    setCustomer((prev) => {
      const isFirst = prev.addresses.length === 0;
      if (isFirst) newAddr.isDefault = true;
      const updated = [...prev.addresses, newAddr];
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_addresses_${user.id}`, JSON.stringify(updated));
      }
      return {
        ...prev,
        addresses: updated,
      };
    });
    addToast('Address Saved', 'New delivery address saved to your profile.', 'success');
    return newId;
  };

  const updateAddress = (id: string, updatedData: Partial<Omit<Address, 'id'>>) => {
    setCustomer((prev) => {
      const updated = prev.addresses.map((a) => (a.id === id ? { ...a, ...updatedData } : a));
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_addresses_${user.id}`, JSON.stringify(updated));
      }
      return {
        ...prev,
        addresses: updated,
      };
    });
    addToast('Address Updated', 'Delivery address details updated successfully.', 'success');
  };

  const deleteAddress = (id: string) => {
    setCustomer((prev) => {
      const updated = prev.addresses.filter((a) => a.id !== id);
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_addresses_${user.id}`, JSON.stringify(updated));
      }
      return {
        ...prev,
        addresses: updated,
      };
    });
    addToast('Address Removed', 'Address deleted from your profile.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setCustomer((prev) => {
      const updated = prev.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_addresses_${user.id}`, JSON.stringify(updated));
      }
      return {
        ...prev,
        addresses: updated,
      };
    });
    addToast('Default Address Set', 'Preferred delivery address set.', 'info');
  };

  const rechargeWallet = (amount: number, referenceId?: string, description?: string) => {
    const ref = referenceId || `WAL-${Math.floor(10000 + Math.random() * 90000)}`;
    const desc = description || 'Online Wallet Recharge via Razorpay';

    setCustomer((prev) => {
      const newBal = prev.walletBalance + amount;
      const tx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        customerId: user?.id || prev.id,
        type: 'Credit',
        amount,
        balanceAfter: newBal,
        description: desc,
        referenceId: ref,
        createdAt: new Date().toISOString(),
      };
      setWalletTransactions((txPrev) => {
        const updatedTx = [tx, ...txPrev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('savera_wallet_tx_v3', JSON.stringify(updatedTx));
        }
        return updatedTx;
      });

      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_wallet_${user.id}`, JSON.stringify(newBal));
      }

      try {
        supabase.auth.getSession().then(({ data: { session } }) => {
          const uid = session?.user?.id;
          if (uid) {
            supabase.from('profiles').update({ wallet_balance: newBal }).eq('id', uid).then();
          }
        });
      } catch (e) {}
      return {
        ...prev,
        walletBalance: newBal,
      };
    });
    addToast('Wallet Recharged! 💳', `₹${amount} added successfully to your Savera Wallet.`, 'success');
    logAuditAction('Wallet Recharge', customer.id, `Credited ₹${amount} (Ref: ${ref})`);
  };

  const debitWallet = (amount: number, referenceId?: string, description?: string): boolean => {
    if (customer.walletBalance < amount) {
      addToast('Insufficient Wallet Balance', `Your wallet balance (₹${customer.walletBalance}) is lower than ₹${amount}.`, 'error');
      return false;
    }
    const ref = referenceId || `DEB-${Math.floor(10000 + Math.random() * 90000)}`;
    const desc = description || 'Wallet Debit';

    setCustomer((prev) => {
      const newBal = Math.max(0, prev.walletBalance - amount);
      const tx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        customerId: user?.id || prev.id,
        type: 'Debit',
        amount,
        balanceAfter: newBal,
        description: desc,
        referenceId: ref,
        createdAt: new Date().toISOString(),
      };
      setWalletTransactions((txPrev) => {
        const updatedTx = [tx, ...txPrev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('savera_wallet_tx_v3', JSON.stringify(updatedTx));
        }
        return updatedTx;
      });

      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_wallet_${user.id}`, JSON.stringify(newBal));
      }

      try {
        supabase.auth.getSession().then(({ data: { session } }) => {
          const uid = session?.user?.id;
          if (uid) {
            supabase.from('profiles').update({ wallet_balance: newBal }).eq('id', uid).then();
          }
        });
      } catch (e) {}

      return {
        ...prev,
        walletBalance: newBal,
      };
    });
    logAuditAction('Wallet Debit', customer.id, `Debited ₹${amount} (Ref: ${ref})`);
    return true;
  };

  const updateCustomerProfile = (data: Partial<CustomerProfile>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
    addToast('Profile Updated', 'Customer profile details updated successfully.', 'success');
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const uid = session?.user?.id;
        if (uid) {
          const dbUpdates: any = { updated_at: new Date().toISOString() };
          if (data.fullName) dbUpdates.full_name = data.fullName;
          if (data.phone) dbUpdates.phone = data.phone;
          supabase.from('profiles').update(dbUpdates).eq('id', uid).then();
        }
      });
    } catch (e) {}
  };

  // Subscriptions
  const addSubscription = (
    subData: Omit<MilkSubscription, 'id' | 'startDate' | 'status' | 'skippedDates' | 'nextDeliveryDate'>
  ) => {
    const resolvedCustomerId = user?.id || customer.id || 'cust-user';
    const resolvedCustomerName = subData.customerName || profile?.full_name || customer.fullName || 'Customer';
    const resolvedCustomerPhone = subData.customerPhone || profile?.phone || customer.phone || '';

    const newSub: MilkSubscription = {
      ...subData,
      customerId: resolvedCustomerId,
      customerName: resolvedCustomerName,
      customerPhone: resolvedCustomerPhone,
      id: 'SUB-' + Math.floor(1000 + Math.random() * 9000),
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      skippedDates: [],
      nextDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    };

    setSubscriptions((prev) => {
      const updated = [newSub, ...prev.filter((s) => s.id !== newSub.id)];
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_subscriptions_v3', JSON.stringify(updated));
        if (user?.id) {
          localStorage.setItem(`savera_user_subs_${user.id}`, JSON.stringify(updated));
        }
      }
      return updated;
    });

    addToast('Milk Subscription Activated!', `Your ${newSub.frequency} delivery is scheduled starting tomorrow.`, 'success');
    logAuditAction('New Subscription', newSub.id, `Created subscription for ${newSub.productName}`);

    // Asynchronously sync to Supabase
    try {
      const isValidUUID = (str?: string | null) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      supabase.auth.getSession().then(({ data: { session } }) => {
        const rawUserId = session?.user?.id || user?.id || null;
        const validDbUserId = isValidUUID(rawUserId) ? rawUserId : null;
        supabase.from('subscriptions').insert({
          id: newSub.id,
          user_id: validDbUserId,
          customer_name: newSub.customerName,
          customer_phone: newSub.customerPhone,
          delivery_address: newSub.deliveryAddress || customer.addresses[0] || {},
          product_id: newSub.productId,
          product_name: newSub.productName,
          variant_id: newSub.variantId,
          variant_name: newSub.variantName,
          quantity: newSub.quantityPerDelivery,
          schedule_type: newSub.frequency,
          custom_days: newSub.customDays || [],
          start_date: newSub.startDate,
          delivery_slot: newSub.deliverySlot,
          status: newSub.status,
          monthly_cost: newSub.monthlyEstimate,
        }).then(({ error }) => {
          if (error) console.warn('Supabase subscription sync note:', error.message);
        });
      });
    } catch (e) {}
  };

  const togglePauseSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const nextStatus = s.status === 'Active' ? 'Paused' : 'Active';
          addToast('Subscription Updated', `Subscription ${subId} is now ${nextStatus}.`, 'info');
          try {
            supabase.from('subscriptions').update({ status: nextStatus }).eq('id', subId).then();
          } catch (e) {}
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const skipSubscriptionDate = (subId: string, dateStr: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const exists = s.skippedDates.includes(dateStr);
          const updated = exists ? s.skippedDates.filter((d) => d !== dateStr) : [...s.skippedDates, dateStr];
          addToast('Schedule Updated', exists ? `Rescheduled delivery for ${dateStr}.` : `Skipped delivery for ${dateStr}.`, 'success');
          return { ...s, skippedDates: updated };
        }
        return s;
      })
    );
  };

  const cancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'Cancelled' as const } : s))
    );
    addToast('Subscription Cancelled', 'Your milk subscription has been cancelled.', 'info');
    logAuditAction('Subscription Cancelled', subId, 'Customer cancelled subscription');
    try {
      supabase.from('subscriptions').update({ status: 'Cancelled' }).eq('id', subId).then();
    } catch (e) {}
  };

  const updateSubscription = (subId: string, updates: Partial<MilkSubscription>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updates } : s))
    );
    addToast('Subscription Updated', 'Delivery preferences updated successfully.', 'success');
    logAuditAction('Subscription Modified', subId, 'Updated parameters');
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.quantityPerDelivery) dbUpdates.quantity = updates.quantityPerDelivery;
      if (updates.frequency) dbUpdates.schedule_type = updates.frequency;
      if (updates.deliverySlot) dbUpdates.delivery_slot = updates.deliverySlot;
      if (updates.monthlyEstimate) dbUpdates.monthly_cost = updates.monthlyEstimate;
      if (Object.keys(dbUpdates).length > 0) {
        supabase.from('subscriptions').update(dbUpdates).eq('id', subId).then();
      }
    } catch (e) {}
  };

  // Orders
  const placeOrder = (
    deliveryAddress: Address,
    deliverySlot: MilkSubscription['deliverySlot'],
    paymentMethod: Order['paymentMethod']
  ) => {
    // 8:00 PM IST Cutoff logic:
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istNow = new Date(utc + (3600000 * 5.5)); // Indian Standard Time
    const isPastCutoff = istNow.getHours() >= 20; // 8:00 PM IST or later
    const daysToAdd = isPastCutoff ? 2 : 1;
    const deliveryDateObj = new Date(istNow);
    deliveryDateObj.setDate(deliveryDateObj.getDate() + daysToAdd);
    const calculatedDeliveryDate = deliveryDateObj.toISOString().split('T')[0];

    const isChandigarh = (deliveryAddress.city || '').toLowerCase().includes('chandigarh') || (deliveryAddress.pincode || '').startsWith('16');
    const assignedDriverName = isChandigarh ? 'Gurpreet Singh (Savera Express)' : 'Ramesh Kumar (Savera Express)';
    const assignedDriverPhone = isChandigarh ? '+91 98222 33445' : '+91 98111 22334';

    const resolvedCustomerId = user?.id || customer.id || 'cust-user';
    const resolvedCustomerEmail = user?.email || profile?.email || customer.email || '';
    const resolvedCustomerName = deliveryAddress.fullName || profile?.full_name || customer.fullName || (user?.email ? user.email.split('@')[0] : 'Customer');
    const resolvedCustomerPhone = deliveryAddress.mobileNumber || profile?.phone || customer.phone || '';

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      orderNumber: 'SAV-' + Math.floor(10000 + Math.random() * 90000),
      customerId: resolvedCustomerId,
      customerEmail: resolvedCustomerEmail,
      customerName: resolvedCustomerName,
      customerPhone: resolvedCustomerPhone,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      tax: 0,
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      deliveryAddress,
      deliveryDate: calculatedDeliveryDate,
      deliverySlot,
      status: 'Order Placed',
      driverName: assignedDriverName,
      driverPhone: assignedDriverPhone,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)];
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_orders_v3', JSON.stringify(updated));
        if (user?.id) {
          localStorage.setItem(`savera_user_orders_${user.id}`, JSON.stringify(updated.filter(o => o.customerId === user.id || (o.customerEmail && o.customerEmail.toLowerCase() === resolvedCustomerEmail.toLowerCase()))));
        }
        if (resolvedCustomerEmail) {
          localStorage.setItem(`savera_user_orders_${resolvedCustomerEmail.toLowerCase()}`, JSON.stringify(updated));
        }
      }
      return updated;
    });

    // If paid via wallet, add debit transaction record
    if (paymentMethod === 'Wallets') {
      const remainingBal = Math.max(0, customer.walletBalance - cartTotal);
      const tx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        customerId: resolvedCustomerId,
        type: 'Debit',
        amount: cartTotal,
        balanceAfter: remainingBal,
        description: `Payment for Order #${newOrder.orderNumber}`,
        referenceId: newOrder.orderNumber,
        createdAt: new Date().toISOString(),
      };
      setWalletTransactions((txPrev) => {
        const updatedTx = [tx, ...txPrev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('savera_wallet_tx_v3', JSON.stringify(updatedTx));
        }
        return updatedTx;
      });

      if (typeof window !== 'undefined' && user?.id) {
        localStorage.setItem(`savera_user_wallet_${user.id}`, JSON.stringify(remainingBal));
      }
    }

    // Reward points
    const earnedPoints = Math.floor(cartTotal / 10);
    setCustomer((prev) => ({
      ...prev,
      rewardPoints: prev.rewardPoints + earnedPoints,
      totalOrders: prev.totalOrders + 1,
      totalSpent: prev.totalSpent + cartTotal,
      walletBalance: paymentMethod === 'Wallets' ? Math.max(0, prev.walletBalance - cartTotal) : prev.walletBalance,
    }));

    clearCart();
    const confirmMsg = isPastCutoff
      ? `Order #${newOrder.orderNumber} placed! (8 PM cutoff passed: scheduled for ${calculatedDeliveryDate} 5 AM).`
      : `Order #${newOrder.orderNumber} confirmed for 5 AM morning delivery!`;
    addToast('Order Placed Successfully!', confirmMsg, 'success');
    logAuditAction('New Order Placed', newOrder.orderNumber, `Order placed for ₹${cartTotal}`);

    // Asynchronously sync to Supabase database (validating UUID foreign key)
    try {
      const isValidUUID = (str?: string | null) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      supabase.auth.getSession().then(({ data: { session } }) => {
        const rawUserId = session?.user?.id || user?.id || null;
        const validDbUserId = isValidUUID(rawUserId) ? rawUserId : null;
        supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          user_id: validDbUserId,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          delivery_address: newOrder.deliveryAddress || {},
          items: newOrder.items || [],
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          delivery_fee: newOrder.deliveryFee,
          total_amount: newOrder.totalAmount,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          status: newOrder.status,
          delivery_date: newOrder.deliveryDate,
          delivery_slot: newOrder.deliverySlot,
          otp: newOrder.otp,
          driver_name: newOrder.driverName,
          driver_phone: newOrder.driverPhone,
        }).then(({ error }) => {
          if (error) console.warn('Supabase order sync note:', error.message);
        });
      });
    } catch (e) {}

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedPaymentStatus = (status === 'Delivered' && o.paymentMethod === 'Cash on Delivery') ? 'Paid' as const : o.paymentStatus;
          return { ...o, status, paymentStatus: updatedPaymentStatus, updatedAt: new Date().toISOString() };
        }
        return o;
      })
    );
    addToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'info');
    logAuditAction('Order Status Change', orderId, `Updated status to ${status}`);
    try {
      supabase.from('orders').update({ status }).or(`id.eq.${orderId},order_number.eq.${orderId}`).then();
    } catch (e) {}
  };

  const resetToFreshBaseline = () => {
    setOrders([]);
    setSubscriptions([]);
    setWalletTransactions([]);
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savera_orders_v3', JSON.stringify([]));
      localStorage.setItem('savera_subscriptions_v3', JSON.stringify([]));
      localStorage.setItem('savera_wallet_tx_v3', JSON.stringify([]));
      localStorage.removeItem('savera_orders_v2');
      localStorage.removeItem('savera_subscriptions_v2');
      localStorage.removeItem('savera_wallet_tx_v2');
    }
    addToast('Baseline Reset to Zero (₹0)', 'All customer orders, active subscriptions, and revenue reset to 0.', 'success');
    logAuditAction('System Reset', 'Platform Baseline', 'Super Admin reset orders & revenue to zero');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as const, updatedAt: new Date().toISOString() } : o))
    );
    addToast('Order Cancelled', `Order ${orderId} has been cancelled.`, 'info');
    logAuditAction('Order Cancelled', orderId, reason || 'Customer requested cancellation');
    try {
      supabase.from('orders').update({ status: 'Cancelled' }).or(`id.eq.${orderId},order_number.eq.${orderId}`).then();
    } catch (e) {}
  };

  // Products & Pricing Management (Super Admin)
  const addProduct = (newProdData: Omit<Product, 'id'> | Product) => {
    const newId = 'id' in newProdData && newProdData.id ? newProdData.id : `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
    };
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_products_v4', JSON.stringify(updated));
      }
      return updated;
    });
    logAuditAction('Product Created', newProduct.id, `Created ${newProduct.name} by Super Admin`);
    addToast('Product Added', `${newProduct.name} has been added to the store catalog.`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_products_v4', JSON.stringify(updated));
      }
      return updated;
    });
    logAuditAction('Product Updated', id, `Updated attributes/details for product ID ${id}`);
    addToast('Product Updated', 'Product updated successfully.', 'success');
  };

  const updateProductPrice = (productId: string, variantId: string, newPrice: number, newMrp?: number) => {
    let productName = '';
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId) return p;
        productName = p.name;
        const updatedVariants = p.variants.map((v) => {
          if (v.id !== variantId) return v;
          const mrp = newMrp !== undefined ? newMrp : Math.max(v.mrp, newPrice);
          const discountPct = mrp > newPrice ? Math.round(((mrp - newPrice) / mrp) * 100) : 0;
          return {
            ...v,
            price: newPrice,
            mrp,
            discountPct,
          };
        });
        return { ...p, variants: updatedVariants };
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_products_v4', JSON.stringify(updated));
      }
      return updated;
    });
    logAuditAction('Price Updated', productId, `Updated price for ${productName || productId} variant ${variantId} to ₹${newPrice}`);
    addToast('Price Updated', `Price of ${productName || 'product'} updated to ₹${newPrice}.`, 'success');
  };

  const deleteProduct = (id: string) => {
    let deletedName = '';
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      deletedName = target ? target.name : id;
      const updated = prev.filter((p) => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_products_v4', JSON.stringify(updated));
      }
      return updated;
    });
    logAuditAction('Product Deleted', id, `Removed ${deletedName} from live catalog`);
    addToast('Product Removed', `${deletedName} removed from catalog.`, 'info');
  };

  // Batches & Production
  const addBatch = (batchData: Omit<BatchItem, 'id' | 'quantitySold' | 'status'>) => {
    const newBatch: BatchItem = {
      ...batchData,
      id: 'batch-' + Date.now(),
      quantitySold: 0,
      status: 'Fresh',
    };
    setBatches((prev) => [newBatch, ...prev]);
    addToast('Batch Added', `Batch ${newBatch.batchId} created successfully.`, 'success');
    logAuditAction('New Batch', newBatch.batchId, `Created batch for ${newBatch.productName}`);
  };

  const addProductionLog = (logData: Omit<ProductionRecord, 'id' | 'efficiencyPct'>) => {
    const newLog: ProductionRecord = {
      ...logData,
      id: 'prod-rec-' + Date.now(),
      efficiencyPct: 98.0,
    };
    setProductionLogs((prev) => [newLog, ...prev]);
    addToast('Production Record Saved', `Recorded output: ${newLog.outputQuantity}`, 'success');
    logAuditAction('Production Record', newLog.batchNumber, `Recorded ${newLog.productName}`);
  };

  // Raw Materials
  const restockRawMaterial = (id: string, amount: number) => {
    setRawMaterials((prev) =>
      prev.map((rm) => (rm.id === id ? { ...rm, currentStock: rm.currentStock + amount, lastRestocked: new Date().toISOString().split('T')[0] } : rm))
    );
    addToast('Stock Restocked', `Added ${amount} units to inventory.`, 'success');
    logAuditAction('Raw Material Restocked', id, `Added ${amount} units`);
  };

  const addRawMaterial = (rmData: Omit<RawMaterial, 'id'>) => {
    const newRM: RawMaterial = { ...rmData, id: 'rm-' + Date.now() };
    setRawMaterials((prev) => [newRM, ...prev]);
    addToast('Raw Material Added', `${newRM.name} recorded in materials log.`, 'success');
    logAuditAction('New Material Logged', newRM.name, `Initial stock: ${newRM.currentStock} ${newRM.unit}`);
  };

  // Suppliers & POs
  const addSupplier = (supData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = { ...supData, id: 'sup-' + Date.now() };
    setSuppliers((prev) => [newSup, ...prev]);
    addToast('Supplier Added', `${newSup.name} saved successfully.`, 'success');
    logAuditAction('New Supplier', newSup.name, `Contact: ${newSup.contactPerson}`);
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'createdAt'>) => {
    const newPO: PurchaseOrder = {
      ...poData,
      id: 'po-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addToast('Purchase Order Generated', `PO #${newPO.poNumber} created.`, 'success');
    logAuditAction('Purchase Order Created', newPO.poNumber, `Amount: ₹${newPO.totalAmount}`);
  };

  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
    addToast('PO Status Updated', `Purchase order marked as ${status}.`, 'info');
    logAuditAction('PO Status Update', id, `Changed to ${status}`);
  };

  // Delivery Zones
  const addDeliveryZone = (zoneData: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = { ...zoneData, id: 'zone-' + Date.now() };
    setDeliveryZones((prev) => [newZone, ...prev]);
    addToast('Delivery Zone Added', `Pincode ${newZone.pincode} (${newZone.areaName}) is now registered.`, 'success');
    logAuditAction('New Delivery Zone', newZone.pincode, newZone.areaName);
  };

  const toggleZoneServiceable = (pincode: string) => {
    setDeliveryZones((prev) =>
      prev.map((z) => {
        if (z.pincode === pincode) {
          const nextVal = !z.isServiceable;
          addToast('Zone Status Updated', `Zone ${pincode} serviceable: ${nextVal ? 'YES' : 'NO'}`, 'info');
          return { ...z, isServiceable: nextVal };
        }
        return z;
      })
    );
  };

  // Support Tickets
  const createSupportTicket = (ticketData: {
    name: string;
    phone: string;
    category: SupportTicket['issueCategory'];
    description: string;
  }) => {
    const newTkt: SupportTicket = {
      id: 'tkt-' + Date.now(),
      ticketNumber: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      customerName: ticketData.name || customer.fullName,
      customerPhone: ticketData.phone || customer.phone,
      issueCategory: ticketData.category,
      description: ticketData.description,
      status: 'Open',
      createdAt: new Date().toLocaleString(),
    };
    setSupportTickets((prev) => [newTkt, ...prev]);
    addToast('Support Ticket Raised', `Ticket #${newTkt.ticketNumber} created. Our team will contact you shortly.`, 'success');
    logAuditAction('Support Ticket Raised', newTkt.ticketNumber, newTkt.issueCategory);
    return newTkt;
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId || t.ticketNumber === ticketId ? { ...t, status } : t))
    );
    addToast('Ticket Status Updated', `Ticket marked as ${status}.`, 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'isVerified' | 'isApproved'>) => {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      isApproved: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    addToast('Review Submitted!', 'Thank you for sharing your feedback with Savera Farms.', 'success');
  };

  // Audit Logs
  const logAuditAction = (action: string, entity: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString(),
      user: 'Current User',
      role: adminRole,
      action,
      entity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    addToast('Audit Logs Cleared', 'Historical audit logs cleared.', 'info');
  };

  // 8:00 PM IST Cutoff status
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istNow = new Date(utc + (3600000 * 5.5));
  const isAfterCutoff = istNow.getHours() >= 20;
  const daysToAdd = isAfterCutoff ? 2 : 1;
  const deliveryDateObj = new Date(istNow);
  deliveryDateObj.setDate(deliveryDateObj.getDate() + daysToAdd);
  const earliestDeliveryDate = deliveryDateObj.toISOString().split('T')[0];

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        coupons,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        cartSubtotal,
        cartDiscount,
        freeShippingThreshold,
        deliveryFee,
        cartTotal,
        customer,
        selectedPincode,
        setSelectedPincode,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        resetToFreshBaseline,
        rechargeWallet,
        debitWallet,
        walletTransactions,
        isAfterCutoff,
        earliestDeliveryDate,
        updateCustomerProfile,
        subscriptions,
        addSubscription,
        togglePauseSubscription,
        skipSubscriptionDate,
        cancelSubscription,
        updateSubscription,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        adminRole,
        setAdminRole,
        products,
        addProduct,
        updateProduct,
        updateProductPrice,
        deleteProduct,
        batches,
        addBatch,
        productionLogs,
        addProductionLog,
        rawMaterials,
        restockRawMaterial,
        addRawMaterial,
        suppliers,
        addSupplier,
        purchaseOrders,
        addPurchaseOrder,
        updatePOStatus,
        deliveryZones,
        addDeliveryZone,
        toggleZoneServiceable,
        supportTickets,
        createSupportTicket,
        updateTicketStatus,
        auditLogs,
        logAuditAction,
        clearAuditLogs,
        reviews,
        addReview,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
