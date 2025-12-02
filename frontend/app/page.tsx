import Link from "next/link";

export default function Home() {
  return (
    // 전체 화면 중앙 정렬, 깨끗한 흰색/회색 배경
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center max-w-2xl">
        {/* RnDcircle처럼 깔끔한 타이틀 */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          AI 대학원 연구실 매칭 시스템
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          당신의 CV와 관심사를 분석하여<br />최적의 지도 교수님을 추천해 드립니다.
        </p>
        
        {/* 둥글고 깔끔한 시작 버튼 */}
        <Link href="/input">
          <button className="bg-black text-white text-lg font-bold px-10 py-4 rounded-full hover:bg-gray-800 transition-all shadow-md">
            시작하기
          </button>
        </Link>
      </div>
    </main>
  );
}