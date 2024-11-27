import { ToastContainer } from "react-toastify";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Header />
      <main className="px-[20vw] sm:max-xl:w-[768px] sm:max-xl:px-0 sm:max-xl:mx-auto">
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
};
