import { SEED_ORDERS } from '@/lib/db';
import OrderTrackingPage from './OrderTrackingClient';

export function generateStaticParams() {
  const ids = SEED_ORDERS.map((o) => ({
    id: o.id,
  }));
  if (ids.length === 0) {
    return [{ id: 'preview' }];
  }
  return ids;
}

export default function Page() {
  return <OrderTrackingPage />;
}
