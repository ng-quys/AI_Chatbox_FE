import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type MainLayoutProps = {
  children: ReactNode;
};

const mainMenus = [
  { key: "home", label: "Trang chủ", path: "/dashboard" },
  { key: "quick-create", label: "Tạo đề nhanh", path: "/dashboard/quick-create" },
  { key: "outline-create", label: "Tạo đề cương", path: "/dashboard/outline" },
  { key: "sample-create", label: "Tạo đề với mẫu", path: "/dashboard/sample" },
  { key: "question-bank", label: "Ngân hàng câu hỏi", path: "/dashboard/bank" },
  { key: "gpt-program", label: "Chương trình GPT", path: "/dashboard/gpt" },
];

const settingMenus = [
  { key: "settings", label: "Cài đặt", path: "/dashboard/settings" },
  { key: "guide", label: "Hướng dẫn", path: "/dashboard/guide" },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-box">E</div>
            <div>
              <h2>ETECHS</h2>
              <p>EOS Operation</p>
            </div>
          </div>

          <p className="sidebar-section-title">CHUNG</p>
          <nav className="sidebar-menu">
            {mainMenus.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.key}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <p className="sidebar-section-title">HỖ TRỢ</p>
          <nav className="sidebar-menu">
            {settingMenus.map((item) => (
              <button
                key={item.key}
                className="sidebar-item"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="search-box">Tìm kiếm...</div>
          <div className="user-box">Ngoc Quy</div>
        </header>

        <main className="page-content">{children}</main>
      </section>
    </div>
  );
}
