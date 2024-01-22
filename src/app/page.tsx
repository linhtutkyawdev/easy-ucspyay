"use client";
import Navbar from "./client/navbar";
import Footer from "./client/footer";
import Hero from "./client/hero";
import Faq from "./client/faq";

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <Faq />
      <Footer />
    </main>
  );
}
