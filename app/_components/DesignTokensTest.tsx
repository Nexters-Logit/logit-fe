export function DesignTokensTest() {
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
