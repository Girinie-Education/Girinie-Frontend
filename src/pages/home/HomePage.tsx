// src/pages/home/HomePage.tsx

import Logo from "@/assets/icons/image.svg?react";
import IconChatbot from "@/assets/images/G1.svg?react";
import IconCulture from "@/assets/images/G2.svg?react";
import IconParent from "@/assets/images/G3.svg?react";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <main className="flex flex-col items-center gap-0 py-20 pt-[88px] text-left">
        <section className="m-0 grid w-full grid-cols-1 gap-8 border-none bg-[#FEF1B0] px-4 py-28 md:grid-cols-3 md:px-8 lg:px-16">
          <div className="col-span-1 flex items-center justify-center">
            <Logo className="h-auto w-[500px] md:w-[700px] lg:w-[900px]" />
          </div>
          <div className="col-span-2 mt-0 space-y-4 px-4">
            <h2 className="text-4xl font-bold text-[#333]">
              다문화 가정 아동을 위한 스마트 러닝 파트너
            </h2>
            <div className="whitespace-pre-line text-base leading-relaxed text-gray-700">
              {
                "기리니 에듀케이션은 언어 장벽과 보호자의 학습 공백으로 인해 생기는 교육 격차를\n해소하기 위한 AI 챗봇 기반 스마트 러닝 웹 플랫폼입니다.\n\n아이들이 가정에서도 꾸준히 학습할 수 있도록 도우며,\n문화적 다양성과 개인별 학습 속도를 존중하는 맞춤형 교육을 제공합니다.\n\nAI 챗봇이 아이의 질문에 친절히 답하고, 보호자는 학습 현황을 확인할 수 있습니다.\n기리니는 교실 밖에서도 아이들이 안전하고 즐겁게 성장할 수 있도록 함께합니다.\n\n개별화된 학습, 따뜻한 보살핌, 그리고 디지털의 힘으로.\n기리니는 모두의 배움이 연결되는 미래를 꿈꿉니다."
              }
            </div>
          </div>
        </section>

        <section className="w-full border-none bg-[#FFF3D5] px-4 py-28 md:px-8 lg:px-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#333]">왜 기리니인가요?</h2>
          <div className="grid w-full grid-cols-1 gap-8 text-center md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex h-[280px] flex-col justify-center rounded-lg bg-white p-8 shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <IconChatbot className="mx-auto mb-4 h-24 w-24" />
              <h3 className="mb-2 font-bold text-[#333]">AI 챗봇 기반</h3>
              <p className="text-sm text-gray-600">아이 눈높이에 맞춰 대화형으로 배우는 학습</p>
            </div>

            {/* Card 2 */}
            <div className="flex h-[280px] flex-col justify-center rounded-lg bg-white p-8 shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <IconCulture className="mx-auto mb-4 h-24 w-24" />
              <h3 className="mb-2 font-bold text-[#333]">문화·생활 중심 교육</h3>
              <p className="text-sm text-gray-600">교과과정뿐만 아니라 예절, 문화, 생활 기초 등</p>
              <p className="text-sm text-gray-600"> 실생활 밀착 교육</p>
            </div>

            {/* Card 3 */}
            <div className="flex h-[280px] flex-col justify-center rounded-lg bg-white p-8 shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <IconParent className="mx-auto mb-4 h-24 w-24" />
              <h3 className="mb-2 font-bold text-[#333]">부모도 함께</h3>
              <p className="text-sm text-gray-600">
                보호자가 직접 검사하고 관리할 수 있도록 보호자 탭 형성
              </p>
            </div>
          </div>
        </section>

        <section className="w-full border-none bg-[#F5F5F5] px-4 py-28 md:px-8 lg:px-16">
          <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* 왼쪽 텍스트 */}
            <div className="text-left">
              <h2 className="mb-6 text-4xl font-bold text-[#333]">
                언어와 문화를 넘어, 아이의 미래까지
              </h2>
              <p className="text-base text-gray-600">
                기초 학습부터 생활 예절까지, AI 챗봇이 함께하는 스마트 러닝.
              </p>
            </div>

            {/* 오른쪽 인용 카드 */}
            <div className="rounded-lg bg-gray-50 p-8 shadow-md">
              <div className="mb-4 text-3xl text-[#E0A545]">“</div>
              <p className="mb-4 text-sm text-gray-600">
                “기리니 에듀케이션은 단순한 교육 도구가 아닙니다. 우리는 다문화 가정 아동들이
                위축되지 않고, AI의 도움을 받아 스스로 배우며 성장하길 바라는 마음으로 이 플랫폼을
                만들었습니다. 기리니가 누군가의 배움에 든든한 친구가 되어줄 수 있기를 바랍니다.”
              </p>
              <p className="mt-6 text-sm font-semibold text-[#333]">— 기리니 에듀케이션 개발자</p>
            </div>
          </div>
        </section>
        <section className="w-full border-none bg-[#FEF1B0] px-4 py-24 text-center md:px-8 lg:px-16">
          <div className="w-full">
            <h2 className="mb-4 text-2xl font-bold text-[#333]">
              언어와 문화를 넘어, 아이의 미래까지
            </h2>
            <p className="mb-6 text-gray-600">
              기초 학습부터 생활 어휘까지, AI 챗봇이 함께하는 스마트 러닝.
            </p>
            <a
              href="/signup"
              className="inline-block rounded bg-[#C1905C] px-6 py-3 font-semibold text-white hover:bg-[#a87847]"
            >
              지금 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="stext-center bg-[#FEF1B0] py-4 pt-0 text-sm text-gray-400">
        &copy; 2025 Girinie. All rights reserved.
      </footer>
    </div>
  );
}
