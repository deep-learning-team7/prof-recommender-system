'use client'; 

import { useState } from "react";
// Next.js 라우팅을 위해 useRouter를 가져옵니다.
import { useRouter } from 'next/navigation'; 
import Link from "next/link"; // 페이지 이동을 위해 Link를 유지합니다.

// 환경 변수에서 API URL을 가져옵니다.
// .env.local의 NEXT_PUBLIC_API_URL 값을 사용합니다.
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

// 관심사 태그 더미 데이터 (백엔드 카테고리명과 일치시켜야 함)
const categories = [
  { name: "cs.CV", label: "Computer Vision", color: "bg-red-100 text-red-800" },
  { name: "cs.CL", label: "NLP / Language", color: "bg-blue-100 text-blue-800" },
  { name: "cs.LG", label: "Machine Learning (CS)", color: "bg-green-100 text-green-800" },
  { name: "cs.AI", label: "Artificial Intelligence", color: "bg-yellow-100 text-yellow-800" },
  { name: "stat.ML", label: "Machine Learning (STAT)", color: "bg-indigo-100 text-indigo-800" },
];

// 라벨(Label)을 실제 백엔드 요청에 필요한 카테고리 코드(Name)로 변환하는 함수
const getCategoryCode = (label: string) => {
  const found = categories.find(cat => cat.label === label);
  return found ? found.name : categories[0].name; // 없으면 기본값으로 "cs.CV" 사용
}

export default function InputPage() {
  const router = useRouter(); // 라우터 훅 사용을 선언

  // 상태 관리: UI에 보이는 'label'을 저장합니다.
  const [selectedLabel, setSelectedLabel] = useState(categories[0].label);
  const [cvText, setCvText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 요청 핸들러
  const handleAnalyze = async () => {
    if (!API_ENDPOINT) {
      setError("❌ 환경 변수 (NEXT_PUBLIC_API_URL)가 설정되지 않았습니다.");
      return;
    }
    if (!cvText.trim()) {
      alert("이력서 내용을 입력해주세요.");
      return;
    }

    const controller = new AbortController();
    // 300,000ms는 5분입니다. (3분 소요되므로 충분히 넉넉합니다.)
    const timeoutDuration = 300000; 
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    // API 요청에 필요한 카테고리 코드 변환
    const categoryCodeToSend = getCategoryCode(selectedLabel);

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryCodeToSend, 
          cv_text: cvText,
        }),
        signal: controller.signal, // AbortController 신호를 fetch에 전달
      });

      // 요청 성공 시 타임아웃 타이머 해제 (필수)
      clearTimeout(timeoutId); 
      
      if (!response.ok) {
        // 서버에서 200이 아닌 상태 코드(4xx, 5xx)를 반환했을 때
        const errorBody = await response.text();
        throw new Error(`API 통신 오류 (${response.status}): ${errorBody.substring(0, 100)}...`);
      }

      const data = await response.json();
      
      // 최종 결과 데이터를 로컬 스토리지에 저장 (URL 길이 제한 회피)
      const resultDataString = JSON.stringify(data.results);
      localStorage.setItem('recommendationResults', resultDataString); 

      console.log("🔥 API 호출 성공, 결과 로컬 스토리지에 저장.");

      // 결과 페이지로 이동 (로컬 스토리지를 읽어옴)
      router.push(`/result`);
      
    } catch (err) {
      // ⭐ [수정 핵심]: 타임아웃 오류(AbortError)와 일반 오류 분리 처리
      if (err && typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
        // fetch가 타임아웃으로 인해 중단되었을 때의 처리
        setError(`⏰ 분석 시간이 ${timeoutDuration / 60000}분을 초과하여 연결이 종료되었습니다. 코랩 런타임을 확인하세요.`);
      } else {
        // 일반 네트워크 오류, JSON 파싱 오류, 4xx/5xx 상태 코드 오류 등
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류 발생";
        setError(errorMessage);
      }
      
    } finally {
      // 로딩 상태 해제
      setIsLoading(false);
    }
};

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
              <button 
                onClick={() => setSelectedLabel(cat.label)}
                key={cat.name}
                className={`${cat.color} px-4 py-2 rounded-full text-sm font-semibold transition-all
                  ${selectedLabel === cat.label 
                      ? 'ring-2 ring-offset-2 ring-indigo-300 font-bold shadow-lg' // 선택 시 강조 스타일
                      : 'hover:opacity-80'}`} // 미선택 시 기본 스타일
                disabled={isLoading} >
                {cat.label} 
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