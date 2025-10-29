import { Product } from '@/types';
import BestSellersCard from '../../components/BestSellersCard';
import { div } from 'framer-motion/client';
import Image from 'next/image';

interface Props {
  products: Product[];
}

export default function BlogPage({ products }: Props) {
  return (
    <div>
        {products.map(product => (
            <BestSellersCard product={product} key={product.id}/>
        ))}
    </div>
  )
}
