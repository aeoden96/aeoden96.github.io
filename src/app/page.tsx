import Image from "next/image";
import { map, range, shuffle } from "lodash";

function ImageCarousel() {
  const shuffeled = shuffle(range(1, 25));
  const shuffeled2 = shuffle(range(1, 25));

  return (
    <div className="relative h-[270px]  overflow-hidden flex w-full flex-col items-center justify-center  max-w-[1000px]">
      <a
        className="z-10"
        href="https://www.facebook.com/modex.samobor/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="z-10 p-4 bg-red-500 text-white shadow-2xl">
          Pogledaj sve proizvode na našoj Facebook stranici
        </button>
      </a>
      <div className="carousel absolute  top-0 flex flex-row gap-4 w-fit items-end justify-center  max-w-[1000px] opacity-75">
        {map(shuffeled, (i) => (
          <Image
            key={i}
            src={`/clothes/${i}.webp`}
            alt="Map"
            width={800}
            height={600}
            className="w-32 h-32 min-w-32 object-cover rounded-lg shadow-lg"
          />
        ))}
      </div>
      <div className="carousel-inverted absolute bottom-0 flex flex-row gap-4  w-fit items-end justify-center  max-w-[1000px] opacity-75">
        {map(shuffeled2, (i) => (
          <Image
            key={i}
            src={`/clothes/${i}.webp`}
            alt="Map"
            width={800}
            height={600}
            className="w-32 h-32 min-w-32 object-cover rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center gap-4 p-4 md:p-24">
      <div id="fb-root"></div>
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0"
        nonce="QyJFxbrp"
      ></script>
      <Image
        src="/background.jpg"
        alt="Map"
        width={800}
        height={600}
        className="fixed top-0 left-0 z-0 w-full h-full object-cover"
      />
      <div className="backdrop-filter backdrop-blur-[2px] fixed top-0 left-0 z-0 w-full h-full bg-black bg-opacity-60"></div>
      <div className="relative flex w-full h-auto sm:h-[800px] md:h-[400px] flex-col md:flex-row items-end justify-center  max-w-[1000px]">
        <a
          href="https://maps.app.goo.gl/iyoW17pTxvedcTFXA"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full md:h-full z-10 h-52"
        >
          <button className="absolute bottom-0 right-0  z-10 p-4 bg-red-500 text-white">
            Dođi do nas
          </button>

          <Image
            src="/map.png"
            alt="Map"
            width={800}
            height={600}
            className=" z-0 w-full h-full object-cover md:max-h-none"
          />
        </a>
        <div className="relative flex flex-col items-center justify-between p-5 md:p-20 gap-4 z-10 w-full md:pb-0 pb-48 sm:w-[400px] md:w-[500px] lg:w-[900px] md:h-full bg-white ">
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl font-bold">
              Hrvatski <span className="text-red-500">Proizvodi</span>
            </h1>
            <p className="text-2xl">
              <span className="text-red-500">u srcu</span> Samobora
            </p>
            <p className="text-lg">
              na adresi <span className="text-red-500">Milakovićeva 9</span>
            </p>
            <p className="text-lg">
              Maloprodaja dječje,muške i ženske odjeće hrvatskih i ostalih
              proizvođača po pristupačnim cijenama.
            </p>
          </div>
          <div className="absolute bottom-0 right-0 flex md:flex-row flex-col justify-end items-end gap-0 w-full">
            <a
              href="http://m.me/modex.samobor"
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-auto w-full"
            >
              <button className="flex flex-row md:w-auto w-full items-center gap-2 bottom-0 right-0 z-10 p-4 bg-red-500 text-white">
                Nazovi
                <Image
                  src={`/wap.svg`}
                  alt="Map"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
            </a>
            <a
              href="http://m.me/modex.samobor"
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-auto w-full"
            >
              <button className="md:w-auto w-full flex flex-row items-center gap-2 bottom-0 right-[100px] z-10 p-4 bg-red-600 text-white">
                Pošalji poruku{" "}
                <Image
                  src={`/mg.svg`}
                  alt="Map"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
            </a>
            <a
              href="https://www.facebook.com/modex.samobor/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:w-auto w-full"
            >
              <button className="md:w-auto w-full flex flex-row items-center gap-2 bottom-0 right-[100px] z-10 p-4 bg-red-500 text-white">
                Pogledaj što nudimo
                <Image
                  src={`/fb.svg`}
                  alt="Map"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
            </a>
          </div>
        </div>
      </div>
      <ImageCarousel />
    </main>
  );
}
