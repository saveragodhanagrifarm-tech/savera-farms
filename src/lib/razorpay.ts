export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (e.g. 100 INR = 10000 paise)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  amountInRupees,
  customerName,
  customerEmail,
  customerPhone,
  orderNumber,
  onSuccess,
  onFailure,
}: {
  amountInRupees: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderNumber: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (err: any) => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    onFailure(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51MockSaveraKey';

  const options: RazorpayOptions = {
    key,
    amount: Math.round(amountInRupees * 100), // convert to paise
    currency: 'INR',
    name: 'Savera Godhan Agri Farm',
    description: `Order #${orderNumber} — Farm Fresh A2 Produce`,
    image: '/logo.png',
    prefill: {
      name: customerName,
      email: customerEmail || 'customer@saverafarms.com',
      contact: customerPhone || '9876543210',
    },
    theme: {
      color: '#1B3B2B', // Savera Dark Green
    },
    handler: (response) => {
      onSuccess(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment was cancelled by the user.'));
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
