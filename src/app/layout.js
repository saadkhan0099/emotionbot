// app/layout.js
import "./globals.css";

export const metadata = {
  title: "AI vs Human Intelligence | Compare Responses",
  description:
    "An interactive platform to compare AI and Human responses with sentiment analysis and visualization.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-gray-100">{children}</body>
    </html>
  );
}
