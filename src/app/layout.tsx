import Sidebar from "@/containers/sidebar";
import "../styles/globals.css";
import Header from "@/containers/header";
// import localFont from "next/font/local";

// export const fontTest = localFont({
//   src: "../../public/font/HJ한전서B.ttf",
//   // variable: "--font-한전서",
//   display: "swap",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <title>직원용 ERP</title>
      </head>
      <body>
        <Header />
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
