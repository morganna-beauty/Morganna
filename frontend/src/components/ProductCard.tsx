import ProductCardProps from "@/interface/ProductCard";
import Image from "next/image";

function ProductCard({ title, description, imageSrc }: ProductCardProps) {
  return (
    <div
      className="
        flex flex-col justify-center items-start gap-6
        w-full max-w-[400px] h-auto
      "
    >
      <div
        className="
          flex flex-row items-start gap-[10px]
          w-full h-[611px] bg-[#E8E8E8] rounded-2xl
          md:h-[500px]
          lg:h-[611px]
        "
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
            width={400}
            height={611}
          />
        )}
      </div>

      <div className="flex flex-col justify-center items-start gap-2 w-full lg:items-center">
        <h3 className="font-roboto font-medium text-[22px] leading-[28px] text-black w-full">
          {title}
        </h3>

        {description && (
          <p className="font-roboto font-medium text-base leading-6 tracking-[0.15px] text-[#808080] w-full">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;