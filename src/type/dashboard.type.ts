export interface SidebarItem {
  key: string;
  label: string;
  icon?: string; // Tên icon hoặc component icon nếu cần
  path?: string;  // Đường dẫn router khi click vào
}