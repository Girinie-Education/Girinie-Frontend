import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/icons/TextLogo.svg";
import { useAuthStore } from "@/stores/authStore";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  const handleLogoutClick = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

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
              onClick={() => navigate("/chatbot")}
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
