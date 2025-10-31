import React from "react";

const Landing: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#0A0D0A] text-stone-300 font-['Space_Grotesk',sans-serif]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="flex flex-col w-full max-w-lg text-center">
            <header className="flex items-center justify-center gap-3 mb-8">
              <div className="size-8 text-[#2bee2b]">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h1 className="text-white text-2xl font-bold leading-tight tracking-tight">
                Solana Wallet
              </h1>
            </header>

            <main className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">
                  Your Gateway to the Solana Ecosystem
                </h2>
                <p className="text-stone-400 text-lg font-normal leading-relaxed max-w-xl mx-auto">
                  The simplest, safest way to manage your digital assets. Step
                  into the future of decentralized finance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3 p-4 bg-[#121412] border border-white/5 rounded-xl">
                  <span
                    className="material-symbols-outlined text-[#2bee2b] text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    lock
                  </span>
                  <h3 className="text-white font-semibold">Secure</h3>
                  <p className="text-stone-400 text-sm">
                    Top-tier security for your peace of mind.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 p-4 bg-[#121412] border border-white/5 rounded-xl">
                  <span
                    className="material-symbols-outlined text-[#2bee2b] text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    bolt
                  </span>
                  <h3 className="text-white font-semibold">
                    Fast Transactions
                  </h3>
                  <p className="text-stone-400 text-sm">
                    Lightning-fast speeds on the Solana network.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 p-4 bg-[#121412] border border-white/5 rounded-xl">
                  <span
                    className="material-symbols-outlined text-[#2bee2b] text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    monitoring
                  </span>
                  <h3 className="text-white font-semibold">Easy Tracking</h3>
                  <p className="text-stone-400 text-sm">
                    Effortlessly monitor your portfolio.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button className="flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#2bee2b] text-[#0A0D0A] gap-3 text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(43,238,43,0.4),0_0_15px_-15px_rgba(43,238,43,0.2)]">
                  <svg
                    fill="#0A0D0A"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                    <path d="M1 1h22v22H1z" fill="none"></path>
                  </svg>
                  <span className="truncate">Continue with Google</span>
                </button>
                <p className="text-stone-500 text-sm font-normal leading-normal">
                  Your key to the decentralized world is one click away.
                </p>
              </div>
            </main>

            <footer className="flex flex-col gap-4 pt-10 mt-8 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <a
                  className="text-stone-400 text-sm font-normal leading-normal hover:text-white transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-stone-400 text-sm font-normal leading-normal hover:text-white transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
              </div>
              <p className="text-stone-500 text-sm font-normal leading-normal">
                © 2024 Solana Wallet. All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
