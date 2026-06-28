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
import { ExperienceModal } from "./ExperienceModal";
import { getAccessToken } from "@/libs/auth";
import { useLoginModal } from "./LoginModalContext";
import { getProjects } from "@/app/_actions/projects";
import { EXPERIENCE_CATEGORY } from "@/types/api";
import { HomeBanner } from "./HomeBanner";

const EXPERIENCE_CARDS = [
  {
    id: 1,
    category: EXPERIENCE_CATEGORY.CUSTOMER_VALUE,
    illustration: "/illustrations/card-type01.webp",
  },
  {
    id: 2,
    category: EXPERIENCE_CATEGORY.TECHNICAL_EXPERTISE,
    illustration: "/illustrations/card-type02.webp",
  },
  {
    id: 3,
    category: EXPERIENCE_CATEGORY.COLLABORATIVE_COMMUNICATION,
    illustration: "/illustrations/card-type03.webp",
  },
  {
    id: 4,
    category: EXPERIENCE_CATEGORY.PROACTIVE_EXECUTION,
    illustration: "/illustrations/card-type04.webp",
  },
  {
    id: 5,
    category: EXPERIENCE_CATEGORY.LOGICAL_ANALYSIS,
    illustration: "/illustrations/card-type05.webp",
  },
  {
    id: 6,
    category: EXPERIENCE_CATEGORY.CREATIVE_PROBLEM_SOLVING,
    illustration: "/illustrations/card-type06.webp",
  },
  {
    id: 7,
    category: EXPERIENCE_CATEGORY.FLEXIBLE_ADAPTABILITY,
    illustration: "/illustrations/card-type07.webp",
  },
  {
    id: 8,
    category: EXPERIENCE_CATEGORY.PERSISTENT_RESPONSIBILITY,
    illustration: "/illustrations/card-type08.webp",
  },
];

interface HomeClientProps {
  projectListSlot: ReactNode;
}

export function HomeClient({ projectListSlot }: HomeClientProps) {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setExperienceModalOpen] = useState(false);
  const { setLoginModalOpen } = useLoginModal();

  const handleExperienceButtonClick = () => {
    if (getAccessToken()) {
      setExperienceModalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleProjectButtonClick = () => {
    if (getAccessToken()) {
      setProjectModalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <main className="w-full mx-auto flex-1 overflow-y-auto scrollbar-hide outline-none">
      <HomeBanner />
      <div className="w-276 mx-auto p-10 pb-25">
        <h1 className="text-headline-1 text-gray-400 mb-16">
          오늘 지원할 공고에 딱 맞는 경험, 로짓과 함께 골라 볼까요?
        </h1>

        {/* 경험 유형 섹션 */}
        <section className="mb-21.25">
          <SectionHeader
            title="경험 유형"
            buttonText="경험 등록"
            onClick={handleExperienceButtonClick}
          />
          <Carousel opts={{ align: "start", slidesToScroll: 4 }} className="mt-5 w-311 -ml-17.5">
            <div className="flex items-center gap-7.5 ">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200 cursor-pointer disabled:bg-gray-20 disabled:text-gray-100 disabled:cursor-default disabled:opacity-40" />
              <CarouselContent className="-ml-5 ">
                {EXPERIENCE_CARDS.map((card) => (
                  <CarouselItem key={card.id} className="pl-5 basis-auto">
                    <ExperienceCard
                      title={card.category}
                      illustration={card.illustration}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200 cursor-pointer disabled:bg-gray-20 disabled:text-gray-100 disabled:cursor-default disabled:opacity-40" />
            </div>
          </Carousel>
        </section>

        {/* 프로젝트 목록 섹션 */}
        <section>
          <SectionHeader
            title="프로젝트 목록"
            buttonText="프로젝트 생성"
            onClick={handleProjectButtonClick}
          />
          {projectListSlot}
        </section>
      </div>

      <NewProjectModal
        open={isProjectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
      <ExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setExperienceModalOpen}
        onSuccess={async () => {
          const projects = await getProjects({ skip: 0, limit: 1 }).catch(
            () => [],
          );
          if (projects.length === 0) {
            setProjectModalOpen(true);
          }
        }}
      />
    </main>
  );
}
