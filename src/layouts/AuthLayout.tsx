import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="wrapper">
            {/* RIGHT (form sẽ qua bên trái) */}
            <div className="right">{children}</div>

            {/* LEFT (branding qua bên phải) */}
            <div className="left">
                <div className="content">
                <div className="badge">Công cụ hỗ trợ</div>
                <h1>
                    <span className="black">TẠO ĐỀ </span>
                    <span className="green">KIỂM TRA</span>
                </h1>
                <p>
                    <span className="green">AI tạo đề kiểm tra</span> thuộc ETECHS giúp giáo viên nhanh chóng tạo đề thi chất lượng, đa dạng và phù hợp với từng cấp độ học sinh, tiết kiệm thời gian và nâng cao hiệu quả giảng dạy.
                </p>
                </div>
            </div>
        </div>
    );
}