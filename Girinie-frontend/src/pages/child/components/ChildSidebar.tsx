import { useLocation, useNavigate } from "react-router-dom";
import { useChildData } from "@/hooks/useChildData";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: children, loading, error } = useChildData();

  const isActive = (path: string) => location.pathname === path;

  const selectedChild = children?.[0] ?? null;

  if (loading && !selectedChild) {
    return (
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col justify-start border-r border-[#D9D9D9] bg-[#FFFFFF] pt-20 text-white">
        <div className="p-6 text-sm text-black/60">자녀 정보를 불러오는 중…</div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col justify-start border-r border-[#D9D9D9] bg-[#FFFFFF] pt-20 text-white">
      <div className="place-items-center p-10">
        <img
          src={selectedChild?.avatarUrl ?? "/img/default.png"}
          className="h-28 w-28 rounded-full"
          alt={selectedChild?.name}
        />
        <p className="mt-5 text-center font-semibold text-black">{selectedChild?.name}</p>
      </div>

      <nav className="divide-y divide-[#D9D9D9] border-t border-[#D9D9D9]">
        <div
          className={`cursor-pointer px-8 py-4 hover:text-tertiary ${
            isActive("/chatbot") ? "font-bold text-black" : "text-gray-400"
          }`}
          onClick={() => navigate("/chatbot")}
        >
          챗봇
        </div>
        <div
          className={`cursor-pointer px-8 py-4 hover:text-tertiary ${
            isActive("/learning-rate") ? "font-bold text-black" : "text-gray-400"
          }`}
          onClick={() => navigate("/learning-rate")}
        >
          학습률
        </div>
      </nav>
      <hr className="border-t border-[#D9D9D9]" />
    </aside>
  );
};

export default Sidebar;
