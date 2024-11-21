import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};