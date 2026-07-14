export function EndedStamp() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/55 backdrop-blur-[2px]">
      <div className="-rotate-[15deg] border-[3.5px] border-white/90 rounded-full w-44 h-44 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-body-5-1 tracking-widest">이벤트</span>
          <span className="text-white text-body-5-1 tracking-widest">종료</span>
        </div>
      </div>
    </div>
  );
}
