"use client";

import { useState, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ExperienceCard } from "./ExperienceCard";
import { SectionHeader } from "./SectionHeader";
import { NewProjectModal } from "./NewProjectModal";
import { NewExperienceModal } from "./NewExperienceModal";
import { useExperienceCounts } from "@/app/_hooks/useExperienceCounts";
import { EXPERIENCE_CATEGORY } from "@/types/api";

const EXPERIENCE_CARDS = [
  {
    id: 1,
    category: EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION,
    bgColor: "bg-[#dcf9f9]",
    illustration: "/illustrations/card-type01.png",
  },
  {
    id: 2,
    category: EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE,
    bgColor: "bg-[#e3f6fd]",
    illustration: "/illustrations/card-type02.png",
  },
  {
    id: 3,
    category: EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
    bgColor: "bg-[#e3f0fd]",
    illustration: "/illustrations/card-type03.png",
  },
  {
    id: 4,
    category: EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING,
    bgColor: "bg-[#e3e9fd]",
    illustration: "/illustrations/card-type04.png",
  },
  {
    id: 5,
    category: EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION,
    bgColor: "bg-gradient-to-b from-[#e4e3fd] to-[#e9e3fd]",
    illustration: "/illustrations/card-type05.png",
  },
  {
    id: 6,
    category: EXPERIENCE_CATEGORY.PERSISTENT_RESPONSIBILITY,
    bgColor: "bg-gradient-to-b from-[#eee3fd] to-[#f9e3fd]",
    illustration: "/illustrations/card-type06.png",
  },
  {
    id: 7,
    category: EXPERIENCE_CATEGORY.FLEXIBLE_ADAPTABILITY,
    bgColor: "bg-gradient-to-b from-[#f7e3fd] to-[#fde3f9]",
    illustration: "/illustrations/card-type07.png",
  },
  {
    id: 8,
    category: EXPERIENCE_CATEGORY.CUSTOMER_VALUE,
    bgColor: "bg-gradient-to-b from-[#fde3f8] to-[#fde3e3]",
    illustration: "/illustrations/card-type08.png",
  },
];

interface HomeClientProps {
  projectListSlot: ReactNode;
}

export function HomeClient({ projectListSlot }: HomeClientProps) {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setExperienceModalOpen] = useState(false);
  const { data: counts = {} } = useExperienceCounts();

  return (
    <main className="w-full mx-auto pt-10 pb-25 flex-1 overflow-y-auto scrollbar-hide">
      <div className="max-w-276 mx-auto">
        <h1 className="text-headline-1 text-gray-400 mb-16">
          어떤 자기소개서를 작성하시겠어요?
        </h1>

        {/* 경험 유형 섹션 */}
        <section className="mb-21.25">
          <SectionHeader
            title="경험 유형"
            buttonText="경험 등록"
            onClick={() => setExperienceModalOpen(true)}
          />
          <Carousel opts={{ align: "start" }} className="mt-5 w-311 -ml-17.5">
            <div className="flex items-center gap-7.5 ">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200 cursor-pointer" />
              <CarouselContent className="-ml-5 ">
                {EXPERIENCE_CARDS.map((card) => (
                  <CarouselItem key={card.id} className="pl-5 basis-auto">
                    <ExperienceCard
                      title={card.category}
                      count={counts[card.category] ?? 0}
                      bgColor={card.bgColor}
                      illustration={card.illustration}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200 cursor-pointer" />
            </div>
          </Carousel>
        </section>

        {/* 프로젝트 목록 섹션 */}
        <section>
          <SectionHeader
            title="프로젝트 목록"
            buttonText="프로젝트 생성"
            onClick={() => setProjectModalOpen(true)}
          />
          {projectListSlot}
        </section>
      </div>

      <NewProjectModal
        open={isProjectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
      <NewExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setExperienceModalOpen}
      />
    </main>
  );
}
