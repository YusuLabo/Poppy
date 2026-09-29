import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Mind",
  description: "반려견 행동과 상황을 바탕으로 상태와 욕구를 추정하는 프로토타입",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
