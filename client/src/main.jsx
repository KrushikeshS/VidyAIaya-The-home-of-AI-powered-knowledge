import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
// import App from "./App.jsx";
import "./index.css";

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
    <RouterProvider router={router} />
  </React.StrictMode>
);
