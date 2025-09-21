
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Landing from "./Landing";
import Home from "./page";
import About from "./About";
import LenisProvider from './components/LenisProvider'
import Project from "./components/Project";
import NewProject from "./components/NewProject";
import TextProject from "./TextProject";
import Personal2 from "./components/Personal2";
import Contact from "./components/Contact";
import CustomCursor from './components/CustomCursor';


export default function RootLayout() {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden`}
      >
        <CustomCursor />
        <LenisProvider>
          <Home />

          <div className="relative z-10">

            <div className="h-screen bg-transparent"></div>

            <About />
            <TextProject />
            {/* Spacer for horizontal NewProject scrolling - only on md+ screens to avoid extra mobile space */}
            <div id="horizontal-scroll-trigger" className="hidden md:block md:h-[240vh] lg:h-[500vh] bg-transparent"></div>
            <NewProject />
            {/* Spacer to ensure PersonalProject appears after horizontal scrolling completes - only on md+ screens */}
            <div className="hidden md:block md:h-screen bg-transparent"></div>
            {/* Personal2 appears after horizontal scrolling completes */}
            <Personal2 />
          </div>

          {/* Render Contact outside the z-10 stack so it's not covered by fixed/floating layers */}
          <div className="relative z-20">
            <Contact />
          </div>

          {/* Floating quick-access contact button */}
        </LenisProvider>
      </body>
    </html>
  );
}
