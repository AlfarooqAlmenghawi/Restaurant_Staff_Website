import { useState } from "react";
import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  RouterProvider,
} from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Tables from "./components/Tables/Tables.jsx";
import { SignIn } from "./components/Auth/SignIn.jsx";
import { AuthProvider } from "./hooks/Auth.jsx";
import { RootLayout } from "./layouts/RootLayout.jsx";
import { signInAction } from "./components/Auth/SignIn.jsx";
import { SignUp, signUpAction } from "./components/Auth/SignUp.jsx";
import ProfileEdit from "./components/ProfileEdit/ProfileEdit.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="test" element={<p>Other path</p>} />
      <Route path="tables" element={<Tables />} />
      <Route path="sign-in" element={<SignIn />} action={signInAction} />
      <Route path="sign-up" element={<SignUp />} action={signUpAction} />
      <Route path="profile" element={<ProfileEdit />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
