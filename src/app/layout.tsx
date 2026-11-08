import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GymProvider } from "@/lib/store";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Karnataka Gym | Retention & Attendance PWA - Hubballi",
    template: "%s | Karnataka Gym Hubballi",
  },
  description: "Official gym attendance, retention cockpit, instant QR check-in & membership renewals for Karnataka Gym Hubballi. Contact: 9902667407",
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
    <html lang="en" className="dark h-full antialiased bg-[#0B0E14] text-slate-100" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/karnataka-gym-logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0E14] text-slate-100 select-none" suppressHydrationWarning>
        <GymProvider>
          {children}
          <CookieConsent />
        </GymProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocal) {
                  // In local development, unregister any service worker to prevent HMR chunk conflicts & reload loops
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister();
                    }
                  });
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {});
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
