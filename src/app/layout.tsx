import Sidebar from "@/containers/sidebar";
import "../styles/globals.css";
import Header from "@/containers/header";

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
