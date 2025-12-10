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

    // CV
    'Autonomous Driving': 'bg-teal-100 text-teal-800',
    'Object Detection': 'bg-purple-100 text-purple-800',
    'YOLO': 'bg-red-100 text-red-800',
    'ResNet': 'bg-blue-100 text-blue-800',
    'NeRF': 'bg-green-100 text-green-800',
    'LiDAR': 'bg-orange-100 text-orange-800',
    '3D Reconstruction': 'bg-pink-100 text-pink-800',

    // CL
    'Large Language Model': 'bg-indigo-100 text-indigo-800', // LLM
    'Text Generation': 'bg-yellow-100 text-yellow-800',
    'Sentiment Analysis': 'bg-lime-100 text-lime-800',
    'Neural Machine Translation': 'bg-red-100 text-red-800',
    'Transformer': 'bg-amber-100 text-amber-800',
    'Information Retrieval': 'bg-gray-100 text-gray-800',
    'Knowledge Graph': 'bg-rose-100 text-rose-800',

    // LG, AI, ML
    'Reinforcement Learning': 'bg-emerald-100 text-emerald-800', // RL
    'Generative Adversarial Network': 'bg-sky-100 text-sky-800', // GAN
    'Federated Learning': 'bg-violet-100 text-violet-800',
    'Causal Inference': 'bg-zinc-100 text-zinc-800',
    'Time Series Analysis': 'bg-neutral-100 text-neutral-800',
    'Deep Learning Theory': 'bg-stone-100 text-stone-800',
    'Transfer Learning': 'bg-slate-100 text-slate-800',
    'Graph Neural Network': 'bg-orange-100 text-orange-800', // GNN

    'Instrumental Variable': 'bg-violet-100 text-violet-800', // IV Regression
    'Nonparametric Regression': 'bg-fuchsia-100 text-fuchsia-800',
    'Feature Learning': 'bg-amber-100 text-amber-800',
    'Confounders': 'bg-cyan-100 text-cyan-800', // Hidden confounders
};

const extractTags = (summary: string): Tag[] => {
    // 7가지 키워드 목록
    const keywords = [
        "Autonomous Driving", "Object Detection", "YOLO", "ResNet", 
        "NeRF", "LiDAR", "3D Reconstruction",

        "Large Language Model", "Text Generation", "Sentiment Analysis",
        "Neural Machine Translation", "Transformer", "Information Retrieval",
        "Knowledge Graph",

        "Reinforcement Learning", "Generative Adversarial Network", "Federated Learning",
        "Causal Inference", "Time Series Analysis", "Deep Learning Theory",
        "Transfer Learning", "Graph Neural Network",
 
        "Instrumental Variable", 
        "Nonparametric Regression",
        "Feature Learning", 
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
  
  // ⭐ [수정 핵심]: useEffect를 제거하고, IIFE로 초기화 로직을 이동합니다.
  const initialData = (() => {
    // 서버 환경(SSR)에서는 무조건 null을 반환하여 Hydration Mismatch를 피합니다.
    if (typeof window === 'undefined') {
        // 서버 렌더링 시에는 결과를 알 수 없으므로 로딩 상태로 만듭니다.
        // isInitialSSR 플래그를 사용하여 서버 렌더링인지 클라이언트 렌더링인지 구분합니다.
        return { results: null, error: null, isInitialSSR: true }; 
    }
    
    // 클라이언트 환경(CSR)에서만 localStorage에 접근합니다.
    const storedData = localStorage.getItem('recommendationResults');
    localStorage.removeItem('recommendationResults'); 
    
    if (!storedData) {
      return { results: null, error: "분석 결과 데이터가 없습니다. 다시 분석을 시작해주세요.", isInitialSSR: false };
    }
    
    try {
      const parsedResults = JSON.parse(storedData) as ProfessorResult[]; 
      return { results: parsedResults, error: null, isInitialSSR: false };
    } catch (error) {
      console.error("로컬 스토리지 데이터 파싱 오류:", error);
      return { results: null, error: "저장된 분석 결과 데이터 파싱 중 오류가 발생했습니다.", isInitialSSR: false };
    }
  })();
  
  // useState의 초기값으로 파싱된 데이터를 설정합니다.
  const [results] = useState<ProfessorResult[] | null>(initialData.results);
  const [loadingError] = useState<string | null>(initialData.error);
  
  // isDataLoaded를 사용하여 로딩 상태를 판단합니다.
  // 서버 렌더링 중이 아니고 (클라이언트 환경이고), 데이터나 오류가 있을 때 true입니다.
  const isDataLoaded = results !== null || loadingError !== null || !initialData.isInitialSSR;

  // ===================================================
  // 조건부 렌더링 (Hydration Safe 로딩)
  // ===================================================
  
  if (!isDataLoaded) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               {/* SSR과 CSR이 모두 이 코드를 공유하므로 Hydration Safe합니다. */}
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
                  {result.professor_name} 연구 분야
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {result.summary}
                </p>
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