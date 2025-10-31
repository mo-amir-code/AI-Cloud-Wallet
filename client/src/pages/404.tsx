import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col bg-background-dark">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col w-full max-w-7xl flex-1">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 flex items-center justify-between whitespace-nowrap px-6 sm:px-10 py-5">
              <div className="flex items-center gap-4 text-text-primary">
                <div className="size-6 text-primary">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">
                  Solana Wallet
                </h2>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
              <div className="flex flex-col items-center gap-6 max-w-md">
                <h1 className="text-primary tracking-tighter text-8xl md:text-9xl font-bold leading-tight">
                  404
                </h1>
                <div className="flex flex-col gap-3">
                  <p className="text-text-primary text-2xl md:text-3xl font-bold leading-tight">
                    Page Not Found
                  </p>
                  <p className="text-text-secondary text-base font-normal leading-normal">
                    The page you are looking for might have been moved, deleted,
                    or never existed.
                  </p>
                </div>
                <div className="flex pt-4 justify-center">
                  <button
                    onClick={handleReturnToDashboard}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
                  >
                    <span className="truncate">Return to Dashboard</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
