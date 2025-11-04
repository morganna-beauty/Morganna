import StarBlog from '@/Icons/StartBlogIcon';

export default function AboutPage() {
  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <section className="flex flex-col justify-center items-center px-5 py-8 md:px-12 md:py-12 lg:px-24 lg:py-8 bg-white">
        <div 
          className="flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 py-0 gap-8 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px] h-[634px] rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hair_desktop.jpg')",
          }}
        >
          <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[272px] md:max-w-[600px] lg:max-w-[1120px]">
            <h1 className="text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] lg:text-[57px] lg:leading-[64px] font-medium text-center text-white w-full lg:tracking-[-0.25px]">
              Nacimos para cuidar de ti y tu cabello
            </h1>
            <p className="text-[28px] leading-[36px] md:text-[26px] md:leading-[34px] lg:text-[28px] lg:leading-[36px] font-normal text-center text-white w-full">
              Descubre la historia, la pasión y las personas detrás de los productos que transformarán tu cabello.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4">
            <button className="flex justify-center items-center h-12 hover:opacity-90 transition-opacity">
              <div className="flex justify-center items-center px-4 py-[10px] w-full h-10 bg-[#215E6B] rounded-full">
                <span className="font-medium text-sm leading-5 tracking-[0.1px] text-white">
                  Ver Productos
                </span>
              </div>
            </button>
            
            <button className="flex justify-center items-center w-auto h-12 hover:opacity-90 transition-opacity">
              <div className="flex justify-center items-center px-4 py-[10px] w-full h-10 bg-white rounded-full">
                <span className="font-medium text-sm leading-5 tracking-[0.1px] text-black">
                  Haz tu diagnóstico
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center px-5 py-8 md:px-12 md:py-16 lg:px-24 lg:py-24 gap-8">
        <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1114px]">
          <h2 className="text-[32px] leading-[40px] font-medium text-center text-black w-full">
            Nuestra historia
          </h2>
          <p className="text-sm leading-5 md:text-lg md:leading-7 lg:text-[22px] lg:leading-[28px] font-medium md:font-normal text-center text-black w-full tracking-[0.1px] md:tracking-normal">
            Somos una empresa dedicada a la fabricación de productos para el cuidado del cabello,
            enfocada en la innovación y la salud capilar. Nuestro catálogo tiene una variedad
            selecta para resolver las principales afecciones que puede presentar el cabello. Estamos
            convencidos que una buena salud capilar va acompañada de buenos hábitos de cuidado,
            rutinas sencillas de llevar y productos delicadamente diseñados para cada necesidad.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center px-5 py-8 md:px-12 md:py-16 lg:px-24 lg:py-24 gap-8 md:gap-12 lg:gap-16 bg-white">
        <h2 className="text-[32px] leading-[40px] font-medium text-center text-black w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px]">
          Nuestra misión y filosofía
        </h2>

        <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px]">
          <div className="flex flex-col items-center p-6 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg flex-1">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <h3 className="text-[22px] leading-[28px] font-medium text-center text-black w-full">
                Misión
              </h3>
              <p className="text-base leading-6 font-normal text-center text-[#215E6B] w-full tracking-[0.5px]">
                Facilitar la rutina de cuidado del cabello, promoviendo los buenos hábitos de
                cuidado y la salud capilar.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg flex-1">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <h3 className="text-[22px] leading-[28px] font-medium text-center text-black w-full">
                Visión
              </h3>
              <p className="text-base leading-6 font-normal text-center text-[#215E6B] w-full tracking-[0.5px]">
                Convertirnos en la empresa líder de cosmética capilar, facilitando los procesos de
                cuidados con productos innovadores, que proporcionen resultados notables y duraderos
                en el cabello.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}