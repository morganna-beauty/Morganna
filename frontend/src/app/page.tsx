import BestSellersSection from '@/components/BestSellersSection';
import DiagnosisSection from '@/components/DiagnosisSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import productsData from '@/data/products.json';
import { Product } from '@/types';

const products: Product[] = productsData;

function HomePage() {
  return (
    <>
      <HeroSection />

      <BestSellersSection products={products}/>

      <DiagnosisSection />

      <Footer />

    </>
  );
}

export default HomePage;
