export default function Loading() {
    // 화면 중앙에 심플한 로딩 텍스트 (스피너를 넣어도 좋음)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700 animate-pulse">
          AI가 CV를 분석 중입니다...
        </h2>
        <p className="text-gray-500 mt-4">잠시만 기다려 주세요.</p>
      </div>
    );
  }