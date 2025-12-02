import Link from "next/link";

// 관심사 태그 더미 데이터 (레퍼런스 스타일 참고)
const categories = [
  { name: "Computer Vision", color: "bg-red-100 text-red-800" },
  { name: "NLP / Language", color: "bg-blue-100 text-blue-800" },
  { name: "Machine Learning", color: "bg-green-100 text-green-800" },
  { name: "Robotics", color: "bg-purple-100 text-purple-800" },
  { name: "Medical AI", color: "bg-pink-100 text-pink-800" },
  { name: "Edge AI", color: "bg-yellow-100 text-yellow-800" },
];

export default function InputPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* 1. 관심 분야 선택 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            관심 연구 분야를 선택해주세요
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              // 레퍼런스 스타일의 알약 모양 태그
              <button 
                key={cat.name}
                className={`${cat.color} px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 2. CV 입력 섹션 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            CV / 이력서 내용을 입력해주세요
          </h2>
          {/* 레퍼런스의 검색창처럼 둥글고 깨끗한 입력창 */}
          <textarea 
            className="w-full h-64 p-6 bg-gray-100 rounded-3xl border-0 focus:ring-2 focus:ring-gray-300 resize-none text-gray-700 text-lg outline-none mb-8"
            placeholder="여기에 이력서 내용을 붙여넣거나 간단히 작성해주세요..."
          ></textarea>
        </section>
        
        {/* 분석 시작 버튼 */}
        <div className="text-center">
          {/* Link를 클릭하면 Next.js가 자동으로 loading.tsx를 보여줍니다 */}
          <Link href="/result">
            <button className="bg-black text-white text-xl font-bold px-12 py-4 rounded-full hover:bg-gray-800 transition-all w-full md:w-auto">
              AI 분석 및 추천받기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}