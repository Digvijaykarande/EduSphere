import Navbar from "@/components/pages/demo/Navbar";
import Footer from "@/components/pages/demo/Footer";
import PageTransition from "@/components/shared/PageTransition";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}