"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useCreateProject } from "../_hooks";
import { getRandomProject } from "../_data/dummy";
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

  const handleCreateExperience = () => {
    router.push("/experience/new");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-276 mx-auto pt-10 pb-25">
        <h1 className="text-headline-1 text-gray-400 mb-16">
          어떤 자기소개서를 작성하시겠어요?
        </h1>

        {/* 경험 유형 섹션 */}
        <section className="mb-21.25">
          <SectionHeader
            title="경험 유형"
            buttonText="경험 등록"
            onClick={handleCreateExperience}
          />
          <Carousel
            opts={{ align: "start" }}
            className="mt-5 w-[1244px] ml-[-70px]"
          >
            <div className="flex items-center gap-7.5 ">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 bg-gray-20 border-0 hover:bg-gray-70 text-gray-200" />
              <CarouselContent className="-ml-5 ">
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
    </div>
  );
}
