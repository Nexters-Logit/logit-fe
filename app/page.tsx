"use client";

import { useState } from "react";
import Image from "next/image";
import StatusEmpty from "@/components/StatusEmpty";
import { Header } from "@/components/common/Header";
import { TestChatButton } from "./_components/TestChatButton";

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

const projects = [
  { id: 1, title: "삼성전자 SW개발 자기소개서", date: "2024.01.15" },
  { id: 2, title: "네이버 프론트엔드 개발자 지원", date: "2024.01.12" },
  { id: 3, title: "카카오 서버 개발 인턴십", date: "2024.01.10" },
  { id: 4, title: "토스 Product Designer 지원서", date: "2024.01.08" },
  { id: 5, title: "라인 백엔드 엔지니어 자소서", date: "2024.01.05" },
  { id: 6, title: "쿠팡 데이터 분석가 포지션", date: "2024.01.03" },
];

function ExperienceCard({
  title,
  count,
  bgColor,
  illustration,
}: {
  title: string;
  count: number;
  bgColor: string;
  illustration: string;
}) {
  return (
    <div
      className={`${bgColor} w-65.25 h-47.5 rounded-[20px] overflow-hidden relative shrink-0`}
    >
      <div className="p-6.5">
        <h3 className="text-body-1 text-primary-600">{title}</h3>
        <p className="text-body-5-5 text-primary-600 opacity-50">
          관련경험 {count}개
        </p>
      </div>
      <div className="absolute right-0 bottom-0 w-32.5 h-30">
        <Image src={illustration} alt={title} fill className="object-contain" />
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  buttonText,
}: {
  title: string;
  buttonText: string;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-title-2-2 text-gray-400">{title}</h2>
      <button className="bg-primary-100 text-white text-body-3-2 px-6 py-3.5 rounded-[14px] h-11 flex items-center justify-center">
        {buttonText}
      </button>
    </div>
  );
}

function ProjectRow({ title, date }: { title: string; date: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full">
      <div className="flex items-center gap-6">
        <div className="w-1.25 h-8 bg-primary-70 rounded-lg" />
        <span className="text-body-5-5 text-primary-600">{title}</span>
      </div>
      <span className="text-body-5-5 text-primary-600">{date}</span>
    </div>
  );
}

function DesignTokensTest() {
  return (
    <section className="mt-20 pt-20 border-t-2 border-gray-70">
      <h2 className="text-headline-1 text-gray-400 mb-10">
        디자인 토큰 테스트
      </h2>

      {/* Color Palette */}
      <div className="mb-16">
        <h3 className="text-title-2 text-gray-400 mb-6">컬러 팔레트</h3>

        <div className="mb-8">
          <h4 className="text-body-1 text-gray-400 mb-4">Primary Colors</h4>
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-20" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-20
              </span>
              <span className="text-body-9-3 text-gray-200">#F5FAFF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-50" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-50
              </span>
              <span className="text-body-9-3 text-gray-200">#E5F0FF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-70" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-70
              </span>
              <span className="text-body-9-3 text-gray-200">#8DC9FF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-100" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-100
              </span>
              <span className="text-body-9-3 text-gray-200">#40A5FF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-200" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-200
              </span>
              <span className="text-body-9-3 text-gray-200">#2571EB</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-300" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-300
              </span>
              <span className="text-body-9-3 text-gray-200">#240991</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-400" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-400
              </span>
              <span className="text-body-9-3 text-gray-200">#6B7684</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-primary-600" />
              <span className="text-body-8-1 text-gray-300 mt-2">
                primary-600
              </span>
              <span className="text-body-9-3 text-gray-200">#333D4B</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-body-1 text-gray-400 mb-4">Gray Scale</h4>
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-20 border border-gray-70" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-20</span>
              <span className="text-body-9-3 text-gray-200">#F7F9FC</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-50" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-50</span>
              <span className="text-body-9-3 text-gray-200">#F2F3F7</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-70" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-70</span>
              <span className="text-body-9-3 text-gray-200">#E1E4ED</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-100" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-100</span>
              <span className="text-body-9-3 text-gray-200">#BEC2D1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-200" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-200</span>
              <span className="text-body-9-3 text-gray-200">#828699</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-300" />
              <span className="text-body-8-1 text-gray-300 mt-2">gray-300</span>
              <span className="text-body-9-3 text-gray-200">#6B6F84</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-400" />
              <span className="text-body-8-1 text-white mt-2">gray-400</span>
              <span className="text-body-9-3 text-gray-200">#262626</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-gray-black" />
              <span className="text-body-8-1 text-white mt-2">gray-black</span>
              <span className="text-body-9-3 text-gray-200">#17181E</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-body-1 text-gray-400 mb-4">Icon Colors</h4>
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-1" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-1</span>
              <span className="text-body-9-3 text-gray-200">#63DBD5</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-2" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-2</span>
              <span className="text-body-9-3 text-gray-200">#71D1F0</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-3" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-3</span>
              <span className="text-body-9-3 text-gray-200">#32B1FF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-4" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-4</span>
              <span className="text-body-9-3 text-gray-200">#8B9AFF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-5" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-5</span>
              <span className="text-body-9-3 text-gray-200">#8B83E6</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-6" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-6</span>
              <span className="text-body-9-3 text-gray-200">#A283E6</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-7" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-7</span>
              <span className="text-body-9-3 text-gray-200">#CF83E6</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-icon-8" />
              <span className="text-body-8-1 text-gray-300 mt-2">icon-8</span>
              <span className="text-body-9-3 text-gray-200">#E683BE</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-body-1 text-gray-400 mb-4">Semantic Colors</h4>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-alert" />
              <span className="text-body-8-1 text-gray-300 mt-2">alert</span>
              <span className="text-body-9-3 text-gray-200">#ED1728</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="mb-16">
        <h3 className="text-title-2 text-gray-400 mb-6">타이포그래피</h3>

        <div className="space-y-6">
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">headline-1</span>
            <span className="text-headline-1 text-gray-400">
              어떤 자기소개서를 작성하시겠어요?
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">title-1</span>
            <span className="text-title-1 text-gray-400">
              타이틀 1 스타일입니다
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">title-2</span>
            <span className="text-title-2 text-gray-400">
              타이틀 2 스타일입니다
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">title-2-2</span>
            <span className="text-title-2-2 text-gray-400">경험 유형</span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">title-3</span>
            <span className="text-title-3 text-gray-400">
              타이틀 3 스타일입니다
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">body-1</span>
            <span className="text-body-1 text-gray-400">주도적 실행력</span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">body-3-2</span>
            <span className="text-body-3-2 text-gray-400">경험 등록</span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">body-5-5</span>
            <span className="text-body-5-5 text-gray-400">관련경험 1개</span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">body-7-3</span>
            <span className="text-body-7-3 text-gray-400">
              본문 7 스타일입니다
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">body-9-3</span>
            <span className="text-body-9-3 text-gray-400">
              본문 9 스타일입니다
            </span>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-title-2 text-gray-400 mb-6">폰트 굵기</h3>
        <div className="space-y-4">
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">400</span>
            <span className="text-2xl font-normal text-gray-400">
              Pretendard Regular - 가나다라마바사 ABCDEFG 1234567890
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">500</span>
            <span className="text-2xl font-medium text-gray-400">
              Pretendard Medium - 가나다라마바사 ABCDEFG 1234567890
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">600</span>
            <span className="text-2xl font-semibold text-gray-400">
              Pretendard SemiBold - 가나다라마바사 ABCDEFG 1234567890
            </span>
          </div>
          <div className="flex items-baseline gap-8 border-b border-gray-70 pb-4">
            <span className="w-32 text-body-7-3 text-gray-200">700</span>
            <span className="text-2xl font-bold text-gray-400">
              Pretendard Bold - 가나다라마바사 ABCDEFG 1234567890
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showProjects, setShowProjects] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-276 mx-auto pt-10 pb-25">
        <h1 className="text-headline-1 text-gray-400 mb-16">
          어떤 자기소개서를 작성하시겠어요?
        </h1>

        {/* 토글 버튼 (임시) */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowExperiences(!showExperiences)}
            className={`px-4 py-2 rounded-lg text-body-7-3 transition-colors ${
              showExperiences
                ? "bg-primary-100 text-white"
                : "bg-gray-50 text-gray-300"
            }`}
          >
            경험 {showExperiences ? "숨기기" : "보이기"}
          </button>
          <button
            onClick={() => setShowProjects(!showProjects)}
            className={`px-4 py-2 rounded-lg text-body-7-3 transition-colors ${
              showProjects
                ? "bg-primary-100 text-white"
                : "bg-gray-50 text-gray-300"
            }`}
          >
            프로젝트 {showProjects ? "숨기기" : "보이기"}
          </button>
        </div>

        {/* 테스트 채팅 버튼 */}
        <div className="mb-8">
          <TestChatButton />
        </div>

        {/* 경험 유형 섹션 */}
        <section className="mb-21.25">
          <SectionHeader title="경험 유형" buttonText="경험 등록" />
          {showExperiences ? (
            <div className="mt-5 flex items-center gap-7.5">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-70 transition-colors">
                <svg
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="none"
                  className="text-gray-300"
                >
                  <path
                    d="M7 1L1 8L7 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="flex gap-5 overflow-x-auto">
                {experienceTypes.map((type) => (
                  <ExperienceCard
                    key={type.id}
                    title={type.title}
                    count={type.count}
                    bgColor={type.bgColor}
                    illustration={type.illustration}
                  />
                ))}
              </div>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-70 transition-colors">
                <svg
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="none"
                  className="text-gray-300"
                >
                  <path
                    d="M1 1L7 8L1 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-5 flex justify-center py-10">
              <StatusEmpty message="등록된 경험이 없어요" />
            </div>
          )}
        </section>

        {/* 프로젝트 목록 섹션 */}
        <section>
          <SectionHeader title="프로젝트 목록" buttonText="프로젝트 생성" />
          {showProjects ? (
            <div className="mt-5">
              {projects.map((project) => (
                <ProjectRow
                  key={project.id}
                  title={project.title}
                  date={project.date}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 flex justify-center py-10">
              <StatusEmpty message="생성된 프로젝트가 없어요" />
            </div>
          )}
        </section>

        {/* 디자인 토큰 테스트 섹션 */}
        <DesignTokensTest />
      </main>
    </div>
  );
}
