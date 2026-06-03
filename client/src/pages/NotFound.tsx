import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Heart className="w-16 h-16 text-black animate-pulse-slow" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full text-sm font-medium transition-all hover:bg-gray-800"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
