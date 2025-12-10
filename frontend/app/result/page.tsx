'use client';

import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface ProfessorResult {
  professor_name: string; // 교수 이름 (id)
  score: number;        // 최종 적합도 점수 (0~1)
  summary: string;      // 연구 요약 텍스트
}

interface Tag {
    text: string;
    color: string;
}

const KEYWORD_COLORS: { [key: string]: string } = {
    'Autonomous Driving': 'bg-teal-100 text-teal-800',
    'Object Detection': 'bg-purple-100 text-purple-800',
    'YOLO': 'bg-red-100 text-red-800',
    'ResNet': 'bg-blue-100 text-blue-800',
    'NeRF': 'bg-green-100 text-green-800',
    'LiDAR': 'bg-orange-100 text-orange-800',
    '3D Reconstruction': 'bg-pink-100 text-pink-800',
};

const extractTags = (summary: string): Tag[] => {
    // 7가지 키워드 목록
    const keywords = [
        "Autonomous Driving", "Object Detection", "YOLO", "ResNet", 
        "NeRF", "LiDAR", "3D Reconstruction"
    ];
    const extractedTags: Tag[] = [];

    // 키워드 검색 및 태그 생성
    for (const keyword of keywords) {
        // 대소문자 구분 없이 검색
        if (summary.toLowerCase().includes(keyword.toLowerCase())) {
            extractedTags.push({
                text: keyword,
                color: KEYWORD_COLORS[keyword] || 'bg-gray-100 text-gray-800'
            });
        }
    }

    // 중복 제거 및 반환
    return extractedTags.filter((tag, index, self) => 
        index === self.findIndex((t) => (
            t.text === tag.text
        ))
    );
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  
  // ⭐ [수정 핵심 1]: IIFE와 window 검사를 조합하여 초기값 설정
  // Next.js 환경에서 CSR/SSR 불일치를 피하기 위해, 클라이언트 환경에서만 localStorage를 읽습니다.
  const initialData = (() => {
    // 서버 환경(SSR)에서는 무조건 null을 반환하여 Hydration Mismatch를 피합니다.
    if (typeof window === 'undefined') {
        return { results: null, error: null }; 
    }
    
    // 클라이언트 환경(CSR)에서만 localStorage에 접근합니다.
    const storedData = localStorage.getItem('recommendationResults');
    localStorage.removeItem('recommendationResults'); 
    
    if (!storedData) {
      return { results: null, error: "분석 결과 데이터가 없습니다. 다시 분석을 시작해주세요." };
    }
    
    try {
      const parsedResults = JSON.parse(storedData) as ProfessorResult[]; 
      return { results: parsedResults, error: null };
    } catch (error) {
      console.error("로컬 스토리지 데이터 파싱 오류:", error);
      return { results: null, error: "저장된 분석 결과 데이터 파싱 중 오류가 발생했습니다." };
    }
  })();
  
  // useState의 초기값으로 파싱된 데이터를 설정합니다.
  const [results] = useState<ProfessorResult[] | null>(initialData.results);
  const [loadingError] = useState<string | null>(initialData.error);
  
  // ⭐ [수정 핵심 2]: 클라이언트 로드 상태는, results가 초기값(null)이 아닐 때만 true가 되도록 수정합니다.
  // 이 방식은 Hydration Mismatch를 유발했던 이전의 isClientLoaded 상태 변수를 대체합니다.
  const isDataLoaded = results !== null || loadingError !== null;
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // ⭐ [수정 핵심]: isClientLoaded가 true가 될 때까지 '결과 분석 중' 화면을 유지합니다.
  if (!isClientLoaded) {
      // 서버와 클라이언트 모두 이 상태로 시작하므로 Hydration Mismatch가 발생하지 않습니다.
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <h2 className="text-2xl font-bold text-gray-700 animate-pulse">결과 분석 중...</h2>
          </div>
      );
  }

  // 데이터가 로드(성공 또는 실패)되지 않았을 때만 로딩 화면을 보여줍니다.
  if (!isDataLoaded) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               {/* 이 로딩 화면은 SSR/CSR에서 모두 일치하므로 Hydration Safe합니다. */}
               <h2 className="text-2xl font-bold text-gray-700 animate-pulse">결과 분석 중...</h2>
          </div>
      );
  }

  // 데이터 로딩 완료 후 오류 발생 여부 체크
  if (loadingError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-600">
          {loadingError}
          <Link href="/input">
            <button className="mt-4 block mx-auto text-sm font-bold text-black underline">다시 분석 시작</button>
          </Link>
        </div>
      </div>
    );
  }

  // 이 시점에서는 results는 반드시 null이 아닙니다.
  if (!results) {
      // (로직상 여기에 도달할 수 없지만, TypeScript 경고 방지 및 안전 장치)
      return <div className="min-h-screen flex items-center justify-center">오류 발생 (데이터 누락)</div>;
  }

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
          {results.map((result, index) => (
            // RnDcircle 스타일의 카드 디자인 (둥근 모서리, 흰 배경, 그림자)
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between hover:shadow-md transition-shadow">
              
              {/* 왼쪽: 교수님/연구실 정보 */}
              <div className="mb-6 md:mb-0 md:mr-8 flex-1">
                <div className="flex items-center gap-3 mb-2">
                   {/* 순위 배지 */}
                  <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
                    {index + 1}위
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {result.professor_name}
                  </h3>
                  {/* 적합도 점수 표시 (원래 UI에 없었지만, AI 서비스의 핵심 결과이므로 유지) */}
                  <span className="text-gray-500 font-medium">
                     | 적합도: {(result.score * 100).toFixed(2)}%
                  </span>
                </div>
                {/* 랩 이름 및 대학 정보는 API에 없으므로, 플레이스홀더 사용 */}
                <p className="text-lg text-gray-800 font-semibold mb-3">
                  {result.professor_name} 연구 분야 (연구실 및 대학 정보는 확인 필요)
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
                {extractTags(result.summary).map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
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