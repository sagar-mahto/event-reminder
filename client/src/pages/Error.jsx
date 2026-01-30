import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* LEFT – MESSAGE */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-6xl font-extrabold text-black">404</h1>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The page you are looking for doesn’t exist or the link has expired.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Go to Login
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full border border-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT – BRAND / MOTIVATION */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white">
          Oops!
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-md">
          Something went wrong, but don’t worry — you’re just one click away from
          getting back on track.
        </p>

        <div className="mt-10 flex gap-4">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-white/70 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-white/40 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
