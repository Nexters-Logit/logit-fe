"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useCreateProject } from "../_hooks";
import { getRandomProject, DUMMY_EXPERIENCES } from "../_data/dummy";
import { createExperience } from "../_actions/experiences";
import { ExperienceCard } from "./ExperienceCard";
import { SectionHeader } from "./SectionHeader";
import { DesignTokensTest } from "./DesignTokensTest";

const experienceTypes = [
  {
    id: 1,
    title: "주도적 실행력",
    count: 1,
    bgColor: "bg-[#dcf9f9]",
    illustration: "/illustrations/card-type01.png",
  },
  {
    id: 2,
    title: "기술적 전문성",
    count: 1,
    bgColor: "bg-[#e3f6fd]",
    illustration: "/illustrations/card-type02.png",
  },
  {
    id: 3,
    title: "논리적 분석력",
    count: 1,
    bgColor: "bg-[#e3f0fd]",
    illustration: "/illustrations/card-type03.png",
  },
  {
    id: 4,
    title: "창의적 문제해결",
    count: 1,
    bgColor: "bg-[#e3e9fd]",
    illustration: "/illustrations/card-type04.png",
  },
];

interface HomeClientProps {
  projectListSlot: ReactNode;
}

export function HomeClient({ projectListSlot }: HomeClientProps) {
  const router = useRouter();
  const [isCreatingExperiences, setIsCreatingExperiences] = useState(false);

  const createProject = useCreateProject();

  // TODO: 모달을 띄워서 사용자 input을 받아 프로젝트 생성 (현재는 더미 데이터로 테스트)
  const handleCreateProject = () => {
    createProject.mutate(getRandomProject(), {
      onSuccess: () => {
        alert("프로젝트가 생성되었습니다.");
        router.refresh();
      },
    });
  };

  // 모든 더미 경험을 병렬로 등록
  const handleCreateExperience = async () => {
    setIsCreatingExperiences(true);
    try {
      const results = await Promise.all(
        DUMMY_EXPERIENCES.map((exp) => createExperience(exp))
      );
      alert(`${results.length}개의 경험이 등록되었습니다.`);
    } catch {
      alert("경험 등록 중 에러가 발생했습니다.");
    } finally {
      setIsCreatingExperiences(false);
    }
  };

  return (
    <main className="max-w-276 mx-auto pt-10 pb-25 flex-1 overflow-y-auto">
        <h1 className="text-headline-1 text-gray-400 mb-16">
          어떤 자기소개서를 작성하시겠어요?
        </h1>

        {/* 경험 유형 섹션 */}
        <section className="mb-21.25">
          <SectionHeader
            title="경험 유형"
            buttonText="경험 등록"
            onClick={handleCreateExperience}
            isPending={isCreatingExperiences}
            pendingText="등록 중..."
          />
          <Carousel opts={{ align: "start" }} className="mt-5">
            <div className="flex items-center gap-7.5">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200" />
              <CarouselContent className="-ml-5">
                {experienceTypes.map((type) => (
                  <CarouselItem key={type.id} className="pl-5 basis-auto">
                    <ExperienceCard
                      title={type.title}
                      count={type.count}
                      bgColor={type.bgColor}
                      illustration={type.illustration}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200" />
            </div>
          </Carousel>
        </section>

        {/* 프로젝트 목록 섹션 */}
        <section>
          <SectionHeader
            title="프로젝트 목록"
            buttonText="프로젝트 생성"
            onClick={handleCreateProject}
            isPending={createProject.isPending}
            pendingText="생성 중..."
          />
          {projectListSlot}
        </section>

        {/* 디자인 토큰 테스트 섹션 */}
        <DesignTokensTest />
    </main>
  );
}
