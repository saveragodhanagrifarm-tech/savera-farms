import { SEED_ORDERS } from '@/lib/db';
import OrderTrackingPage from './OrderTrackingClient';

export function generateStaticParams() {
  return SEED_ORDERS.map((o) => ({
    id: o.id,
  }));
}

export default function Page() {
  return <OrderTrackingPage />;
}
