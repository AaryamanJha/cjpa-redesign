import { SplashScreen } from "@/components/sections/SplashScreen"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Mission } from "@/components/sections/Mission"
import { Founder } from "@/components/sections/Founder"
import { Services } from "@/components/sections/Services"
import { Team } from "@/components/sections/Team"
import { TeamFilm } from "@/components/sections/TeamFilm"
import { CaseStudies } from "@/components/sections/CaseStudies"
import { Insights } from "@/components/sections/Insights"
import { Publications } from "@/components/sections/Publications"
import { Partners } from "@/components/sections/Partners"
import { Newsletter } from "@/components/sections/Newsletter"
import { Contact } from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <SplashScreen />
      <Hero />
      <About />
      <Mission />
      <Founder />
      <Services />
      <Team />
      <TeamFilm />
      <CaseStudies />
      <Insights />
      <Publications />
      <Partners />
      <Newsletter />
      <Contact />
    </>
  )
}
