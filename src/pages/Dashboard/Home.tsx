import { ArrowRight, Zap, FileText, LayoutGrid,  Bell } from "lucide-react";
import logo from "../../assets/images/logo.png"; // Đường dẫn logo của bạn

export default function Home() {
  // Dữ liệu giả lập cho phần tổng quan học liệu
  const stats = [
    { id: "exams", label: "Đề thi", count: "128", icon: <FileText className="stat-icon-svg" />, colorClass: "bg-teal" },
    { id: "outlines", label: "Đề cương", count: "36", icon: <FileText className="stat-icon-svg text-blue" />, colorClass: "bg-blue" },
    { id: "matrices", label: "Ma trận đề", count: "24", icon: <LayoutGrid className="stat-icon-svg text-purple" />, colorClass: "bg-purple" },
    { id: "questions", label: "Câu hỏi", count: "2.450", icon: <FileText className="stat-icon-svg text-yellow" />, colorClass: "bg-yellow" },
  ];

  // Dữ liệu giả lập cho hoạt động gần đây
  const recentActivities = [
    { id: 1, title: "Đề kiểm tra giữa kỳ I - Toán 10", time: "10:30", date: "24/05/2026", icon: <FileText />, colorClass: "bg-teal-light" },
    { id: 2, title: "Đề cương ôn tập Hóa 11", time: "9:30", date: "24/05/2026", icon: <FileText className="text-blue" />, colorClass: "bg-blue-light" },
    { id: 3, title: "Ma trận đề - Ngữ văn 12", time: "8:30", date: "23/05/2026", icon: <LayoutGrid className="text-purple" />, colorClass: "bg-purple-light" },
    { id: 4, title: "Ma trận đề - Ngữ văn 12", time: "7:30", date: "23/05/2026", icon: <LayoutGrid className="text-purple" />, colorClass: "bg-purple-light" },
  ];

  return (
    <div className="home-container">
      {/* 1. KHUNG CHÀO MỪNG (WELCOME BANNER) */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1 className="banner-title">Chào mừng đến với ETECHS</h1>
          <p className="banner-desc">
            Nền tảng hỗ trợ giảng viên tạo đề và quản lý học liệu hiệu quả, nhanh chóng và khoa học
          </p>
        </div>
        <div className="banner-image">
          {/* Bạn có thể thay bằng thẻ img chứa ảnh minh họa cây xanh/sách giống trong figma */}
          <div className="banner-illustration">
            <span className="illust-pencil-cup">✏️</span>
            <span className="illust-books">📚</span>
            <span className="illust-plant">🪴</span>
          </div>
        </div>
      </div>

      {/* 2. CÁC NÚT TẠO NHANH (QUICK ACTIONS) */}
      <div className="quick-actions-grid">
        <div className="action-card">
          <div className="action-icon-wrapper bg-teal-light">
            <Zap className="action-icon text-teal" />
          </div>
          <div className="action-info">
            <h3 className="action-title">Tạo đề nhanh</h3>
            <p className="action-subtitle">Tạo đề thi nhanh với ngân hàng câu hỏi.</p>
          </div>
          <ArrowRight className="action-arrow" />
        </div>

        <div className="action-card">
          <div className="action-icon-wrapper bg-blue-light">
            <FileText className="action-icon text-blue" />
          </div>
          <div className="action-info">
            <h3 className="action-title">Tạo đề cương</h3>
            <p className="action-subtitle">Xây dựng đề cương theo cấu trúc mong muốn.</p>
          </div>
          <ArrowRight className="action-arrow" />
        </div>

        <div className="action-card">
          <div className="action-icon-wrapper bg-purple-light">
            <LayoutGrid className="action-icon text-purple" />
          </div>
          <div className="action-info">
            <h3 className="action-title">Tạo đề với ma trận</h3>
            <p className="action-subtitle">Tạo đề thi dựa trên ma trận đề.</p>
          </div>
          <ArrowRight className="action-arrow" />
        </div>
      </div>

      {/* 3. BỐ CỤC CHÍNH (THÔNG TIN CHI TIẾT & HOẠT ĐỘNG) */}
      <div className="main-dashboard-layout">
        {/* CỘT TRÁI: TỔNG QUAN HỌC LIỆU & THÔNG BÁO */}
        <div className="layout-column-left">
          
          {/* Khối Tổng quan học liệu */}
          <div className="dashboard-section-box">
            <h2 className="section-box-title">Tổng quan học liệu</h2>
            <div className="stats-subgrid">
              {stats.map((item) => (
                <div key={item.id} className="stat-card-item">
                  <div className={`stat-icon-circle ${item.colorClass}`}>
                    {item.icon}
                  </div>
                  <div className="stat-data">
                    <span className="stat-label-text">{item.label}</span>
                    <span className="stat-count-number">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Khối Thông báo và hướng dẫn */}
          <div className="dashboard-section-box notification-box">
            <div className="notif-header">
              <h2 className="section-box-title">Thông báo và hướng dẫn</h2>
              <button type="button" className="btn-outline-notif">Xem hướng dẫn</button>
            </div>
            <div className="notif-body">
              <div className="notif-bell-icon">
                <Bell />
              </div>
              <div className="notif-desc">
                <span className="notif-label">Cập nhật mới:</span>
              </div>
              <button type="button" className="btn-explore-notif">Khám phá</button>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="layout-column-right">
          <div className="dashboard-section-box activity-section-box">
            <h2 className="section-box-title">Hoạt động gần đây</h2>
            
            <div className="activity-list-wrapper">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item-row">
                  <div className={`activity-icon-box ${activity.colorClass}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-item-title">{activity.title}</h4>
                    <span className="activity-item-time">
                      Cập nhật lúc {activity.time}, {activity.date}
                    </span>
                  </div>
                  <span className="activity-timestamp">{activity.time}</span>
                </div>
              ))}
            </div>

            <button type="button" className="btn-view-all-activities">
              <span>Xem tất cả</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}