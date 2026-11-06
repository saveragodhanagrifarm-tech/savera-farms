import { SEED_PRODUCTS } from '@/lib/db';
import ProductDetailPage from './ProductDetailPageClient';

export function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export default function Page() {
  return <ProductDetailPage />;
}
