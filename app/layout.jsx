
import "./globals.css";
import Landing from "./Landing";
import Home from "./page";
import About from "./About";
import LenisProvider from './components/LenisProvider'
import Project from "./components/Project";
import NewProject from "./components/NewProject";
import TextProject from "./TextProject";


export default function RootLayout() {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden`}
      >
        <LenisProvider>
          {/* Fixed Landing Canvas Background */}
          <Home />
          
          {/* Scrollable Content Layer */}
          <div className="relative z-10">
            {/* Add spacer to allow scrolling past the fixed landing */}
            <div className="h-screen bg-transparent"></div>
            
            <About />
            <TextProject />
            {/* Extended spacer div to provide scroll distance for horizontal NewProject scrolling */}
            <div id="horizontal-scroll-trigger" className="h-[800vh] bg-transparent"></div>
            <NewProject />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
