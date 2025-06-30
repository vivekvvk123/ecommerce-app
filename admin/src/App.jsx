import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";

// Lazy loading components
const Add = lazy(() => import("./pages/Add"));
const List = lazy(() => import("./pages/List"));
const Orders = lazy(() => import("./pages/Orders"));

//Loading spinner
import Loader from "./components/Loader";

// Loading wrapper component to handle route changes
const LoadingWrapper = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isNavigating) {
    return (
      <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Check if token is already stored in localStorage
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr className="border-gray-300" />
          <div className="flex w-full">
            <Sidebar />
            <LoadingWrapper>
              <div className="w-[80%] sm:w-[75%] mx-auto my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/" element={<Navigate to="/add" replace />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </LoadingWrapper>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
