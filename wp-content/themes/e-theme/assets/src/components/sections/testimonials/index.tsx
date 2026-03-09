'use client';

import KnowledgeCard from "../knowledge/KnowledgeCard";
import SectionHeader from '../../ui/SectionHeader'

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[110px]"
    >
      <img src="/assets/gradient-line.webp" alt="" className="mx-auto" />

      <div className="max-w-[1280px] mt-20 w-full mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-full lg:max-w-[1036px] w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
          <SectionHeader
            badge="Testimonials"
            title="Testimonials"
            className="!items-start !justify-start !text-left !w-full"
            textClassName="!mx-0 !text-left"
            maxWidth="100%"
          />
          <KnowledgeCard
            key={3}
            icon="/assets/mumdatlogo.svg"
            index={3}
            title="markmann + müller "
            description="Die Zusammenarbeit mit AICONIQ war für uns ein echter Gamechanger. Das Team versteht nicht nur KI auf technologischer Ebene, sondern auch unsere geschäftlichen Prozesse. Besonders beeindruckt hat uns, wie schnell komplexe Anforderungen verstanden und in funktionierende Lösungen übersetzt wurden. Man merkt sofort: Hier arbeiten Menschen, die nicht nur über Innovation sprechen, sondern sie wirklich umsetzen"
            reverse={true}
            videoPath="/assets/mainmumdat.mp4"
          />
          
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
