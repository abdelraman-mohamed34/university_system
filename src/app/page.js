import Header from "./components/home-page/Header";
import OverAll from "./components/home-page/OverAll";
import Performance from './components/home-page/Performance.jsx'
import SideBar from "./fixed/SideBar";
export default function Home() {
  return (
    <div className="lg:px-10 sm:px-7sm:py-5 pb-5 px-2">
      <Header prop='لوحة التحكم' />
      <OverAll />
      <Performance />
    </div>
  );
}