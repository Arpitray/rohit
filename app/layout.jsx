
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
          <Home />
          <About />
          <TextProject />
          {/* Extended spacer div to provide scroll distance for horizontal NewProject scrolling */}
          <div id="horizontal-scroll-trigger" className="h-[800vh] bg-transparent"></div>
          <NewProject />
        </LenisProvider>
      </body>
    </html>
  );
}
