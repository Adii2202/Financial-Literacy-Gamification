import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BlogHome from "./pages/BlogHome";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Party from "./pages/Party";
import TaskPages from "./pages/TaskPages";
import Monetary from "./pages/Monetary";
import FriendsPage from "./pages/FriendsPage";
import Redirect from "./Redirect";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StaggeredDropDown from "./components/ChatBot";
import "./App.css";
import Stock from "./pages/Stock";
import Savings from "./pages/Savings";

function App() {
  const token = localStorage.getItem("token");

  const isNavBarOpen = useSelector((state) => state.ui.isNavBarOpen);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            limit={2}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
          />
          {token && <NavBar />}
          {!isNavBarOpen && (
            <>
              <Outlet />
              {token && (
                <div className="fixed bottom-12 right-36">
                  <StaggeredDropDown />
                </div>
              )}
              {token && <Footer />}
            </>
          )}
        </>
      ),
      children: [
        {
          path: "/",
          element: <Redirect />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/blog",
          element: <BlogHome />,
        },
        {
          path: "/blog/:id",
          element: <Blog />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/party",
          element: <Party />,
        },
        {
          path: "/stock",
          element: <Stock />,
        },
        {
          path: "/savings",
          element: <Savings />,
        },
        {
          path: "/tasks",
          element: <TaskPages />,
        },
        // {
        //   path: "/friends",
        //   element: <FriendsPage />,
        // },
        {
          path: "/monetary",
          element: <Monetary />,
        },
      ],
    },
  ]);

  return (
    <AnimatePresence>
      <div className="h-full w-full bg-[#E6E6FA]">
        <RouterProvider router={router} />
      </div>
    </AnimatePresence>
  );
}

export default App;
