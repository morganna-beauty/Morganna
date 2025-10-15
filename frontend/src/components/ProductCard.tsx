interface ProductCardProps {
  title: string;
  description: string;
  imageSrc?: string;
}

function ProductCard({ title, description, imageSrc }: ProductCardProps) {
  return (
    <div className="flex flex-col justify-center items-start gap-4 w-full h-auto
      sm:gap-5 sm:w-full
      md:gap-6 md:w-full
      lg:w-[408px] lg:h-[695px] lg:flex-1">
      
      <div className="flex flex-row items-start p-[10px] gap-[10px] w-full h-[300px] bg-[#E8E8E8] rounded-2xl
        sm:h-[400px]
        md:h-[500px]
        lg:h-[611px]">
        {imageSrc && (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover rounded-2xl" />
        )}
      </div>

      <div className="flex flex-col justify-center items-start gap-2 w-full px-2
        sm:px-0">
        <h3 className="font-roboto font-medium text-[18px] leading-[24px] text-left text-black
          sm:text-[20px] sm:leading-[26px]
          lg:text-[22px] lg:leading-[28px] lg:text-center">
          {title}
        </h3>

        <p className="font-roboto font-medium text-[14px] leading-[20px] tracking-[0.15px] text-left text-[#808080]
          sm:text-[15px] sm:leading-[22px]
          lg:text-base lg:leading-6 lg:text-center">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;