import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    preload: false
});

export const metadata: Metadata = {
    title: "SGコンプライアンス学習",
    description: "SMARTGOLF コンプライアンス e-ラーニングシステム",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${inter.className} ${notoSansJP.className}`}>{children}</body>
        </html>
    );
}
