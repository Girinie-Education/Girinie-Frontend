import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/icons/TextLogo.svg";
import { useAuthStore } from "@/stores/authStore";
import { useChildData } from "@/hooks/useChildData";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const { childId: urlChildId } = useParams(); // ★★★ URL에서 childId 가져오기 ★★★
  const { data: children } = useChildData();

  // ★★★ 현재 자녀 ID를 결정합니다. URL에 있으면 그걸 사용하고, 없으면 첫 번째 자녀의 ID를 사용합니다. ★★★
  const currentChildId = urlChildId || (children && children.length > 0 ? children[0].id.toString() : null);

  const handleLogoClick = () => {
    navigate(isLoggedIn ? "/home" : "/");
  };

  const handleLogoutClick = () => {
    useAuthStore.getState().logout();
    navigate("/", { replace: true });
  };
  
  // ★★★ '아이' 버튼의 onClick 핸들러를 수정합니다. ★★★
  const handleChildChatClick = () => {
    if (currentChildId) {
      navigate(`/chatbot/${currentChildId}`);
    } else {
      // 자녀 데이터가 없는 경우, 다른 페이지로 이동하거나 알림 표시
      alert("등록된 자녀가 없습니다.");
    }
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white py-3">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 sm:px-4">
        <div className="flex items-center gap-8">
          <img
            src={logoUrl}
            alt="logo"
            className="h-12 w-20 cursor-pointer rounded-full"
            onClick={handleLogoClick}
          />
        </div>

        <div className="flex items-center gap-x-3 sm:gap-x-10">
          <nav className="flex items-center gap-x-3 text-sm font-medium text-gray-700 sm:gap-x-7 sm:text-base">
            <button
              onClick={() => navigate("/calendar/parent")}
              className="transition-colors hover:text-[#FF6464]"
            >
              보호자
            </button>
            <button
              onClick={handleChildChatClick} // ★★★ 수정된 핸들러 사용 ★★★
              className="transition-colors hover:text-[#FF6464]"
            >
              아이
            </button>
          </nav>

          {isLoggedIn ? (
            <Button
              className="h-9 bg-[#CE995D] px-4 text-white transition-colors hover:bg-[#a87847] sm:px-5"
              onClick={handleLogoutClick}
            >
              로그아웃
            </Button>
          ) : (
            <Button
              className="h-9 bg-[#CE995D] px-4 text-white transition-colors hover:bg-[#a87847] sm:px-5"
              onClick={() => navigate("/login")}
            >
              로그인 →
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;