import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Box } from "@mui/material";
import { NavBar } from "@/components/navigation/nav-bar";
import { Footer } from "@/components/navigation/footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export const metadata: Metadata = {
  title: "『實踐科創·探知歷史』2025暑期實習團",
  description: "實習生招募"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Suspense fallback={null}>
              <NavBar />
            </Suspense>
            <Box
              component="main"
              sx={{
                flex: 1,
                mt: { xs: '72px', sm: '80px' },
                width: '100%',
                overflowX: 'hidden',
                paddingTop: 'env(safe-area-inset-top)'
              }}
            >
              {children}
            </Box>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
