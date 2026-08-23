import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow | المستشار للمحاماة - التوظيف",
  description: "منصة التوظيف الرسمية لمكتب المستشار للمحاماة والاستشارات القانونية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
