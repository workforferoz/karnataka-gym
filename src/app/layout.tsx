import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GymProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Karnataka Gym | Retention & Attendance PWA - Hubballi",
  description: "Modern gym attendance, retention cockpit, instant QR check-in & membership renewals for Karnataka Gym Hubballi. Call: 9902667407",
  manifest: "/manifest.json",
  icons: {
    icon: "/karnataka-gym-logo.png",
    apple: "/karnataka-gym-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Karnataka Gym",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased bg-[#0B0E14] text-slate-100">
      <head>
        <link rel="apple-touch-icon" href="/karnataka-gym-logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0E14] text-slate-100 select-none">
        <GymProvider>
          {children}
        </GymProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('PWA ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
