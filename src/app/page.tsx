import { ProjectIntro } from "@/components/sections/project-intro"
import { ProjectTimeline } from "@/components/sections/timeline"
import { Positions } from "@/components/sections/positions"
import { AboutUs } from "@/components/sections/about-us"
import { ContactUs } from "@/components/sections/contact-us"
import { Interview } from "@/components/sections/interview"
import { Suspense } from "react"

export default function Home() {
  return (
    <div className="pt-16 sm:pt-20">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectIntro />
        <Interview />
        <ProjectTimeline />
        <Positions />
        <AboutUs />
        <ContactUs />
      </Suspense>
    </div>
  )
}
