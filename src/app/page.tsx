import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import Who from "@/components/sections/who";
import Work from "@/components/sections/work";
import Commits from "@/components/sections/commits";
import Toolbox from "@/components/sections/toolbox";
import Log from "@/components/sections/log";
import Life from "@/components/sections/life";
import Signal from "@/components/sections/signal";

// Single long page; every chapter is a semantic <section> with real SSR text.
export default function Home() {
  return (
    <>
      <Hero />
      <Who />
      <Work />
      <Commits />
      <Toolbox />
      <Log />
      <Life />
      <Signal />
      <Footer />
    </>
  );
}
