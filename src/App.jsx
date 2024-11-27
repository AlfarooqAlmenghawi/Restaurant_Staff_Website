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
import { SignUp, signUpAction } from "./components/Auth/SignUp.jsx";
import ProfileEdit from "./components/ProfileEdit/ProfileEdit.jsx";
import MyRestaurants from "./components/MyRestaurants/MyRestaurants.jsx";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.jsx";
import CreateRestaurant from "./components/CreateRestaurant/CreateRestaurant.jsx";
import GoLive from "./components/GoLive/GoLive.jsx";
import Settings from "./components/Settings/Settings.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        path="tables"
        element={
          <ProtectedRoute>
            <Tables />
          </ProtectedRoute>
        }
      />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} action={signUpAction} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-restaurants"
        element={
          <ProtectedRoute>
            <MyRestaurants />
          </ProtectedRoute>
        }
      />
      <Route path="restaurant-new" element={<CreateRestaurant />} />
      <Route
        path="settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="go-live"
        element={
          <ProtectedRoute>
            <GoLive />
          </ProtectedRoute>
        }
      />
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
