"use client"

import AutoScroll from "embla-carousel-auto-scroll"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface Logo {
  id: string
  description: string
  image: string
  className?: string
}

interface Logos3Props {
  heading?: string
  eyebrow?: string
  logos?: Logo[]
  className?: string
}

const DEFAULT_LOGOS: Logo[] = [
  {
    id: "alixpartners",
    description: "AlixPartners",
    image: "/partners/alixpartners.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "imar-learning-solutions",
    description: "Imar Learning Solutions",
    image: "/partners/imar-learning-solutions.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "bank-of-new-york-mellon",
    description: "Bank of New York Mellon",
    image: "/partners/bank-of-new-york-mellon.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "usitc",
    description: "United States International Trade Commission",
    image: "/partners/usitc.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "sunterra",
    description: "SunTerra",
    image: "/partners/sunterra.jpg",
    className: "h-14 w-auto",
  },
  {
    id: "wcaps",
    description: "WCAPS",
    image: "/partners/wcaps.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "global-fund-for-women",
    description: "Global Fund for Women",
    image: "/partners/global-fund-for-women.png",
    className: "h-16 w-auto",
  },
  {
    id: "western-cam",
    description: "Western CAM",
    image: "/partners/western-cam.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "cli-investment-management",
    description: "CLI Investment & Management",
    image: "/partners/cli-investment-management.jpg",
    className: "h-16 w-auto",
  },
  {
    id: "toggle-robotics",
    description: "Toggle Robotics",
    image: "/partners/toggle-robotics.jpg",
    className: "h-12 w-auto",
  },
  {
    id: "asia-initiatives",
    description: "Asia Initiatives",
    image: "/partners/asia-initiatives.png",
    className: "h-12 w-auto",
  },
  {
    id: "icap",
    description: "International Career Advancement Program",
    image: "/partners/icap.png",
    className: "h-14 w-auto",
  },
  {
    id: "augustus-global-investment",
    description: "Augustus Global Investment",
    image: "/partners/augustus-global-investment.png",
    className: "h-12 w-auto",
  },
  {
    id: "soulfull-life-university",
    description: "SoulFull Life University",
    image: "/partners/soulfull-life-university.png",
    className: "h-10 w-auto",
  },
  {
    id: "national-chengchi-university",
    description: "National Chengchi University",
    image: "/partners/national-chengchi-university.png",
    className: "h-16 w-auto",
  },
  {
    id: "roger",
    description: "Roger",
    image: "/partners/roger.jpeg",
    className: "h-12 w-auto",
  },
]

const Logos3 = ({
  heading = "Partners and Clients",
  eyebrow = "Institutional Network",
  logos = DEFAULT_LOGOS,
  className,
}: Logos3Props) => {
  return (
    <section className={cn("relative overflow-hidden py-24 lg:py-32", className)}>
      <div className="mx-auto flex max-w-7xl flex-col px-6 text-center lg:px-10">
        <div className="mx-auto mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-[#C8A96A]/60" />
          <span
            className="font-sans font-medium uppercase text-[#C8A96A]"
            style={{ fontSize: "11px", letterSpacing: "0.3em" }}
          >
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-[#C8A96A]/60" />
        </div>
        <h2
          className="font-serif font-light leading-[1.06] text-[#F5F1E8]"
          style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
        >
          {heading}
        </h2>
      </div>

      <div className="pt-12 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex max-w-[1500px] items-center justify-center">
          <Carousel
            className="w-full"
            opts={{ align: "start", loop: true }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                speed: 0.8,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            aria-label={heading}
          >
            <CarouselContent className="ml-0">
              {[...logos, ...logos].map((logo, index) => (
                <CarouselItem
                  key={`${logo.id}-${index}`}
                  className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="mx-3 flex h-36 w-full max-w-[220px] shrink-0 flex-col items-center justify-center gap-4 border border-[#C8A96A]/10 bg-[#F5F1E8] px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-[#C8A96A]/35 md:mx-5">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={cn("max-w-full object-contain", logo.className)}
                      loading="lazy"
                    />
                    <p
                      className="line-clamp-2 min-h-8 text-center font-sans font-medium leading-snug text-[#070B14]/70"
                      style={{ fontSize: "11px", letterSpacing: "0.03em" }}
                    >
                      {logo.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#070B14] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#070B14] to-transparent" />
        </div>
      </div>
    </section>
  )
}

export { Logos3 }
