import StarBlog from "@/Icons/StartBlogIcon";
import { Check } from "lucide-react";

interface ProductProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Error al obtener el producto con ID ${id}`);
  }

  return res.json();
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.id);

  return (
    <div className="flex flex-col items-center px-5 py-8 gap-8 w-full lg:flex-row lg:justify-center lg:px-[60px] lg:py-[60px] lg:max-w-[1440px] lg:mx-auto">
      {/* Product detail */}
      <div className="flex flex-col justify-center items-start gap-8 w-full max-w-[400px] lg:w-[866px] lg:max-w-none">
        
        {/* Summary */}
        <div className="flex flex-col items-start gap-8 w-full lg:flex-row">
          
          {/* Left section - MOBILE: Solo imagen principal */}
          <div className="flex flex-col items-start gap-3 w-full lg:w-[370px]">
            {/* Main Image */}
            <div className="flex flex-row items-start p-2.5 w-full h-[400px] bg-gray-200 rounded-2xl lg:w-[370px] lg:h-[370px]">
              <img
                src={product.imageSrc || product.image || '/placeholder.png'}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images - Solo en desktop */}
            <div className="hidden lg:flex flex-row items-center gap-3 w-[370px] h-[113px]">
              <div className="flex flex-row items-start p-2.5 flex-1 h-[113px] bg-gray-200 rounded-2xl">
                <img
                  src={product.imageSrc || product.image || '/placeholder.png'}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-row items-start p-2.5 flex-1 h-[113px] bg-gray-200 rounded-2xl">
                <img
                  src={product.imageSrc || product.image || '/placeholder.png'}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-row items-start p-2.5 flex-1 h-[113px] bg-gray-200 rounded-2xl">
                <img
                  src={product.imageSrc || product.image || '/placeholder.png'}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col justify-center items-start gap-8 w-full lg:flex-1">
            
            {/* Head */}
            <div className="flex flex-col items-start gap-6 w-full">
              <h1 className="text-[32px] font-medium leading-10 text-black">
                {product.title}
              </h1>
              <p className="text-base font-normal leading-6 tracking-[0.5px] text-black">
                {product.description || "Un tratamiento intensivo para el cabello que nutre profundamente, fortalece y restaura el brillo natural. Ideal para cabellos secos y dañados."}
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col justify-center items-start gap-6 w-full">
              <h2 className="text-[22px] font-medium leading-7 text-black">
                Beneficios
              </h2>
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-row items-center gap-2">
                  <Check className="w-6 h-6 text-[#1D1B20]" />
                  <span className="text-base font-normal leading-6 tracking-[0.5px] text-[#1E1E1E]">
                    Nutrición profunda
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Check className="w-6 h-6 text-[#1D1B20]" />
                  <span className="text-base font-normal leading-6 tracking-[0.5px] text-[#1E1E1E]">
                    Reparación de daños
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Check className="w-6 h-6 text-[#1D1B20]" />
                  <span className="text-base font-normal leading-6 tracking-[0.5px] text-[#1E1E1E]">
                    Protección antioxidante
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Check className="w-6 h-6 text-[#1D1B20]" />
                  <span className="text-base font-normal leading-6 tracking-[0.5px] text-[#1E1E1E]">
                    Brillo y suavidad
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-start gap-2 w-full">
              <button className="flex flex-row justify-center items-center w-full h-12">
                <div className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 bg-[#B6D6DD] rounded-full w-full">
                  <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#215E6B]">
                    Añadir a la bolsa
                  </span>
                </div>
              </button>
              <button className="flex flex-row justify-center items-center w-full h-12">
                <div className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 bg-[#215E6B] rounded-full w-full">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-sm font-medium leading-5 tracking-[0.1px] text-white">
                    Comprar por WhatsApp
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col items-start gap-6 w-full">
          <h2 className="text-[22px] font-medium leading-7 text-black">
            Descripción
          </h2>
          <p className="text-base font-normal leading-6 tracking-[0.5px] text-black">
            Tratamiento capilar nutritivo está formulado con una mezcla de aceites naturales y extractos botánicos que trabajan en sinergia para hidratar y reparar el cabello desde la raíz hasta las puntas. Su fórmula rica en antioxidantes protege el cabello de los daños ambientales y mejora su elasticidad, dejándolo suave, manejable y lleno de vida.
          </p>
        </div>

        {/* Ingredientes clave */}
        <div className="flex flex-col items-start gap-6 w-full">
          <h2 className="text-[22px] font-medium leading-7 text-black">
            Ingredientes clave
          </h2>
          <div className="flex flex-row items-start gap-6 w-full">
            
            {/* Ingredient 1 */}
            <div className="flex flex-col justify-center items-start p-6 gap-3.5 flex-1 bg-white border border-[#E4E4E4] rounded-lg">
              <div className="flex flex-row justify-center items-center w-12 h-12">
                <div className="flex flex-col justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                  <StarBlog />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                  Aceite de argán
                </h3>
                <p className="text-sm font-medium leading-5 tracking-[0.1px] text-[#808080]">
                  Rico en ácidos grasos y vitamina E para nutrir y fortalecer el cabello.
                </p>
              </div>
            </div>

            {/* Ingredient 2 */}
            <div className="flex flex-col justify-center items-start p-6 gap-3.5 flex-1 bg-white border border-[#E4E4E4] rounded-lg">
              <div className="flex flex-row justify-center items-center w-12 h-12">
                <div className="flex flex-col justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                  <StarBlog />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                  Manteca de karité
                </h3>
                <p className="text-sm font-medium leading-5 tracking-[0.1px] text-[#808080]">
                  Hidrata y suaviza el cabello, mejorando su textura y elasticidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}