import "./style.css";

export const metadata = {
  title: "DEX-Aggregator",
  description: "Optimize your trades on DEXes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,100..900&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressContentEditableWarning={true}>{children}</body>
    </html>
  );
}
