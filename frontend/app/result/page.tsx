import Link from "next/link";

// RnDcircle 스타일의 더미 데이터
const dummyResults = [
  {
    rank: 1,
    profName: "김이화 교수",
    univ: "KAIST",
    labName: "Visual Intelligence Lab",
    summary: "의료 MRI 초소형 병변 분할 및 에너지 효율적 네트워크 설계",
    // 여기가 핵심: 레퍼런스 스타일의 태그들
    tags: [
      { text: "Medical AI", color: "bg-blue-100 text-blue-800" },
      { text: "Computer Vision", color: "bg-indigo-100 text-indigo-800" },
      { text: "경량화 모델", color: "bg-gray-100 text-gray-800" }
    ]
  },
  {
    rank: 2,
    profName: "박성신 교수",
    univ: "서울대학교",
    labName: "Mobile & Edge Computing Lab",
    summary: "모바일/엣지 환경에서의 지연 최적화 및 온디바이스 AI 연구",
    tags: [
      { text: "Edge AI", color: "bg-yellow-100 text-yellow-800" },
      { text: "시스템 최적화", color: "bg-orange-100 text-orange-800" }
    ]
  },
  {
    rank: 3,
    profName: "최지능 교수",
    univ: "포항공대(POSTECH)",
    labName: "NLP & Knowledge Graph Lab",
    summary: "대규모 언어 모델(LLM)의 환각 현상 탐지 및 지식 그래프 구축",
    tags: [
      { text: "NLP", color: "bg-green-100 text-green-800" },
      { text: "LLM", color: "bg-teal-100 text-teal-800" },
      { text: "생성형 AI", color: "bg-purple-100 text-purple-800" }
    ]
  },
];

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">분석 결과 추천</h2>
          <Link href="/input">
             <button className="text-gray-500 hover:text-black underline">다시 하기</button>
          </Link>
        </div>
        
        <div className="space-y-6">
          {dummyResults.map((result) => (
            // RnDcircle 스타일의 카드 디자인 (둥근 모서리, 흰 배경, 그림자)
            <div key={result.rank} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between hover:shadow-md transition-shadow">
              
              {/* 왼쪽: 교수님/연구실 정보 */}
              <div className="mb-6 md:mb-0 md:mr-8 flex-1">
                <div className="flex items-center gap-3 mb-2">
                   {/* 순위 배지 */}
                  <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
                    {result.rank}위
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {result.profName}
                  </h3>
                  <span className="text-gray-500 font-medium">
                     | {result.univ}
                  </span>
                </div>
                <p className="text-lg text-gray-800 font-semibold mb-3">
                  {result.labName}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {result.summary}
                </p>
                <button className="mt-4 text-sm font-bold text-gray-900 underline hover:text-blue-600">
                    자세히 보기 →
                </button>
              </div>

              {/* 오른쪽: 키워드 태그 (RnDcircle 스타일의 핵심!) */}
              <div className="flex flex-wrap content-start gap-2 md:max-w-xs justify-end">
                {result.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    // 알약 모양(rounded-full), 컬러 배경, 작은 글씨
                    className={`${tag.color} px-3 py-1 rounded-full text-xs font-bold`}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}