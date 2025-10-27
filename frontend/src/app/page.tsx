import { HeroSection, Footer, DiagnosisSection, BestSellersSection } from '@/components';
import productsData from '@/data/products.json';
import { Product } from '@/types';

const products = productsData as Product[];

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