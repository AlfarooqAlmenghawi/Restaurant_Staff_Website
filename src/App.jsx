import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Route } from "react-router-dom";
import Tables from "./components/Tables/Tables.jsx";
import { SignIn } from "./components/Auth/SignIn.jsx";
import { AuthProvider } from "./hooks/Auth.jsx";
import { RootLayout } from "./layouts/RootLayout.jsx";
import { SignUp } from "./components/Auth/SignUp.jsx";
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
          <ProtectedRoute requiresRestaurant={true}>
            <Tables />
          </ProtectedRoute>
        }
      />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute requiresRestaurant={true}>
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
      <Route
        path="restaurant-new"
        element={
          <ProtectedRoute>
            <CreateRestaurant />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute requiresRestaurant={true}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="go-live"
        element={
          <ProtectedRoute requiresRestaurant={true}>
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
