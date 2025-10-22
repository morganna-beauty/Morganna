import ProductCardProps from "@/interface/ProductCard";

function ProductCard({ title, description, imageSrc }: ProductCardProps) {
  return (
    <div
      className="
        flex flex-col justify-center items-start gap-6
        w-[400px] h-[695px]               /* Tamaño fijo en mobile */
        md:w-full md:h-auto              /* En tablet se adapta */
        lg:w-[400px] lg:h-[695px] lg:flex-1
      "
    >
      <div
        className="
          flex flex-row items-start p-[10px] gap-[10px]
          w-full h-[611px] bg-[#E8E8E8] rounded-2xl
          md:h-[500px]
          lg:h-[611px]
        "
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </div>

      <div className="flex flex-col justify-center items-start gap-2 w-full lg:items-center">
        <h3 className="font-roboto font-medium text-[22px] leading-[28px] text-black w-full">
          {title}
        </h3>

        <p className="font-roboto font-medium text-base leading-6 tracking-[0.15px] text-[#808080] w-full">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
