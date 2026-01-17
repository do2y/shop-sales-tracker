export const metadata = {
  title: "Shop Sales Tracker",
  description: "매장 정산 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sales" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
