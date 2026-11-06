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
  deleteAddress: (id: string) => void;
  rechargeWallet: (amount: number) => void;
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
  // Local state initialized from localStorage/seed
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(SEED_COUPONS);
  const [customer, setCustomer] = useState<CustomerProfile>(SEED_CUSTOMER);
  const [selectedPincode, setSelectedPincode] = useState<string>('122002');
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const isHydrated = useRef(false);

  // Load stored data on mount
  useEffect(() => {
    const rawStoredProducts = getStoredData<Product[]>('savera_products_v2', SEED_PRODUCTS);
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
    setSubscriptions(getStoredData('savera_subscriptions_v2', SEED_SUBSCRIPTIONS));
    setOrders(getStoredData('savera_orders_v2', SEED_ORDERS));
    setBatches(getStoredData('savera_batches_v2', SEED_BATCHES));
    setProductionLogs(getStoredData('savera_production_v2', SEED_PRODUCTION));
    setRawMaterials(getStoredData('savera_raw_v2', SEED_RAW_MATERIALS));
    setSuppliers(getStoredData('savera_suppliers_v2', SEED_SUPPLIERS));
    setPurchaseOrders(getStoredData('savera_purchase_orders_v2', SEED_PURCHASE_ORDERS));
    setDeliveryZones(getStoredData('savera_zones_v2', SEED_DELIVERY_ZONES));
    setCustomer(getStoredData('savera_customer_v2', SEED_CUSTOMER));
    setSupportTickets(getStoredData('savera_tickets_v2', SEED_TICKETS));
    setAuditLogs(getStoredData('savera_audit_v2', SEED_AUDIT_LOGS));
    setReviews(getStoredData('savera_reviews_v2', SEED_REVIEWS));
    isHydrated.current = true;
  }, []);

  // Save to storage (only after hydration)
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_cart_v2', cart);
  }, [cart]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_coupons_v2', coupons);
  }, [coupons]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_subscriptions_v2', subscriptions);
  }, [subscriptions]);
  useEffect(() => {
    if (isHydrated.current) setStoredData('savera_orders_v2', orders);
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
    setCustomer((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    addToast('Address Saved', 'New delivery address saved to your profile.', 'success');
    return newId;
  };

  const deleteAddress = (id: string) => {
    setCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    addToast('Address Removed', 'Address deleted from your profile.', 'info');
  };

  const rechargeWallet = (amount: number) => {
    setCustomer((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    addToast('Wallet Recharged!', `₹${amount} added successfully to your Savera Wallet.`, 'success');
    logAuditAction('Wallet Recharge', customer.id, `Credited ₹${amount}`);
  };

  const updateCustomerProfile = (data: Partial<CustomerProfile>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
    addToast('Profile Updated', 'Customer profile details updated successfully.', 'success');
  };

  // Subscriptions
  const addSubscription = (
    subData: Omit<MilkSubscription, 'id' | 'startDate' | 'status' | 'skippedDates' | 'nextDeliveryDate'>
  ) => {
    const newSub: MilkSubscription = {
      ...subData,
      id: 'SUB-' + Math.floor(1000 + Math.random() * 9000),
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      skippedDates: [],
      nextDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    addToast('Milk Subscription Activated!', `Your ${newSub.frequency} delivery is scheduled starting tomorrow.`, 'success');
    logAuditAction('New Subscription', newSub.id, `Created subscription for ${newSub.productName}`);

    // Asynchronously sync to Supabase
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const userId = session?.user?.id || null;
        supabase.from('subscriptions').insert({
          id: newSub.id,
          user_id: userId,
          customer_name: customer.fullName,
          customer_phone: customer.phone,
          delivery_address: customer.addresses[0] || {},
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
  };

  const updateSubscription = (subId: string, updates: Partial<MilkSubscription>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, ...updates } : s))
    );
    addToast('Subscription Updated', 'Delivery preferences updated successfully.', 'success');
    logAuditAction('Subscription Modified', subId, 'Updated parameters');
  };

  // Orders
  const placeOrder = (
    deliveryAddress: Address,
    deliverySlot: MilkSubscription['deliverySlot'],
    paymentMethod: Order['paymentMethod']
  ) => {
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      orderNumber: 'SAV-' + Math.floor(10000 + Math.random() * 90000),
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
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
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliverySlot,
      status: 'Order Placed',
      driverName: 'Ramesh Kumar (Savera Delivery Partner)',
      driverPhone: '+91 98112 33445',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reward points
    const earnedPoints = Math.floor(cartTotal / 10);
    setCustomer((prev) => ({
      ...prev,
      rewardPoints: prev.rewardPoints + earnedPoints,
      totalOrders: prev.totalOrders + 1,
      totalSpent: prev.totalSpent + cartTotal,
    }));

    clearCart();
    addToast('Order Placed Successfully!', `Order #${newOrder.orderNumber} confirmed for delivery tomorrow.`, 'success');
    logAuditAction('New Order Placed', newOrder.orderNumber, `Order placed for ₹${cartTotal}`);

    // Asynchronously sync to Supabase database
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const userId = session?.user?.id || null;
        supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          user_id: userId,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          delivery_address: newOrder.deliveryAddress,
          items: newOrder.items,
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
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    addToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'info');
    logAuditAction('Order Status Change', orderId, `Updated status to ${status}`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as const, updatedAt: new Date().toISOString() } : o))
    );
    addToast('Order Cancelled', `Order ${orderId} has been cancelled.`, 'info');
    logAuditAction('Order Cancelled', orderId, reason || 'Customer requested cancellation');
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
        deleteAddress,
        rechargeWallet,
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
