"use client";

import Image from "next/image";

const LogoGrid = () => {
  const logos = [
    // { id: 1, src: "/assets/image/1.png", alt: "Signature Global", name: "Signature Global" },
    { id: 2, src: "/assets/image/Navraj-logo-Gold-1.png", alt: "Navraj", name: "Navraj" },
    { id: 3, src: "/assets/image/paras.jpg", alt: "Paras Buildtech", name: "Paras Buildtech" },
    { id: 4, src: "/assets/image/svs.png", alt: "SVS Build Smart", name: "SVS Build Smart" },
    { id: 5, src: "/assets/image/1731261520855_meffier-logo.png", alt: "MEFFIRE", name: "MEFFIRE" },
    { id: 6, src: "/assets/image/images.png", alt: "Central Park", name: "Central Park" },
    { id: 7, src: "/assets/image/41.png", alt: "Lamose", name: "Lamose" },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full py-5 flex flex-col items-center overflow-hidden">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
        Industry Partners
      </h2>

      {/* Marquee container */}
      <div className="w-full overflow-hidden relative">
        <div
          className="flex gap-12 pl-12 animate-scroll"
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="w-36 h-36 rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-gray-400 flex-shrink-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={120}
                className="object-contain max-w-[120px] max-h-[120px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: inline-flex;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoGrid;
