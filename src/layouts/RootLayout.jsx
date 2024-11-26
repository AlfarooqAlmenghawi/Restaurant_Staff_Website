import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Header />
      <main className="px-[20vw] sm:max-lg:w-[614px] sm:max-lg:px-0 sm:max-lg:mx-auto">
        <Outlet />
      </main>
    </>
  );
};
