const aiFeatures = [
  { id: 1, text: "TẠO ĐỀ KIỂM TRA TỰ ĐỘNG" },
  { id: 2, text: "TẠO ĐỀ CƯƠNG ÔN THI TỰ ĐỘNG" },
  { id: 3, text: "TẠO MA TRẬN ĐỀ TỰ ĐỘNG" },
];

export default function Home() {
  return (
    <div className="dashboard-home">
      <div className="badge dashboard-badge">Công cụ hỗ trợ</div>

      <h1 className="dashboard-title">
        TẠO ĐỀ <span>KIỂM TRA</span>
      </h1>

      <p className="dashboard-desc">
        <span>AI tạo đề kiểm tra</span> thuộc ETECHS giúp giáo viên nhanh chóng tạo
        đề thi chất lượng, đa dạng và phù hợp với từng cấp độ học sinh, tiết kiệm
        thời gian và nâng cao hiệu quả giảng dạy.
      </p>

      <div className="feature-list">
        {aiFeatures.map((feature) => (
          <button key={feature.id} className="feature-card">
            <span className="feature-tag">AI</span>
            <span>{feature.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
