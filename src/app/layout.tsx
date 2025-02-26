
export const metadata = {
  title: "Qubex - AI-Powered IDE", // This changes the tab title
  description: "An AI-driven Intelligent IDE that enhances your coding experience.",
  icons: {
    icon: "/image.png", // Path to your custom logo
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-white">
        {children}
      </body>
    </html>
  );
}
