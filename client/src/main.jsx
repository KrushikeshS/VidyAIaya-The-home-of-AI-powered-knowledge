import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
// import App from "./App.jsx";
import "./index.css";
import {GamificationProvider} from "./context/GamificationContext";
import {ProgressProvider} from "./context/ProgressContext"; // Import Provider

// Import your layout and pages
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import CourseOverviewPage from "./pages/CourseOverviewPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Your layout is the base
    children: [
      {
        index: true, // This is the default page
        element: <HomePage />,
      },
      {
        path: "my-courses",
        element: <MyCoursesPage />,
      },
      {
        path: "course/:courseId",
        element: <CourseOverviewPage />,
      },
      {
        path: "lesson/:lessonId",
        element: <LessonPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email offline_access", // ✅
      }}
      cacheLocation="localstorage" // ✅ helps on localhost
      useRefreshTokens // ✅ modern silent auth
    >
      <GamificationProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </GamificationProvider>
    </Auth0Provider>
  </React.StrictMode>
);
