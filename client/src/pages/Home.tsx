import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiveModal } from "../components/modals";

const Home: React.FC = () => {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all ease-in-out duration-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-primary text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Home
            </h1>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              Welcome back, manage your assets.
            </p>
          </div>
          <button className="w-full sm:w-auto flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-hover-light text-text-muted text-sm font-medium leading-normal tracking-[0.015em] transition-colors hover:bg-white/10">
            <span className="truncate">Copy Address</span>
          </button>
        </header>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-dark p-5 sm:p-6">
            <p className="text-text-secondary text-sm sm:text-base font-medium leading-normal">
              Total Balance
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-text-primary tracking-light text-2xl sm:text-3xl font-bold leading-tight">
                1,234.56
              </p>
              <span className="font-semibold text-text-muted text-sm sm:text-base">
                SOL
              </span>
            </div>
            <p className="text-primary text-sm sm:text-base font-medium leading-normal">
              +5.2%
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-dark p-5 sm:p-6">
            <p className="text-text-secondary text-sm sm:text-base font-medium leading-normal">
              Portfolio Value (USD)
            </p>
            <p className="text-text-primary tracking-light text-2xl sm:text-3xl font-bold leading-tight">
              $185,184.00
            </p>
            <p className="text-primary text-sm sm:text-base font-medium leading-normal">
              $9,168.00 (24h)
            </p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex justify-start">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/dashboard/send")}
              className="flex-1 sm:flex-initial py-2 flex min-w-[84px] max-w-full sm:max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:opacity-90"
            >
              <span className="material-symbols-outlined">north_east</span>
              <span className="truncate">Send</span>
            </button>

            <button
              onClick={() => setIsReceiveModalOpen((prev) => !prev)}
              className="flex-1 sm:flex-initial py-2 flex min-w-[84px] max-w-full sm:max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-hover-light text-text-primary text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-white/10"
            >
              <span className="material-symbols-outlined">south_west</span>
              <span className="truncate">Receive</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="flex flex-col">
          <h2 className="text-text-primary text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 sm:pb-4 pt-4 sm:pt-5">
            Recent Transactions
          </h2>

          {/* Desktop Table View */}
          <div className="hidden md:block w-full overflow-hidden rounded-xl border border-border bg-card-dark">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-medium" scope="col">
                      Type
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      Address
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-4 font-medium" scope="col">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Sent Transaction */}
                  <tr>
                    <td className="px-6 py-4 text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red/20 text-red">
                          <span className="material-symbols-outlined text-base">
                            north_east
                          </span>
                        </div>
                        <span>Sent</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted">
                      B3s...kL9p
                    </td>
                    <td className="px-6 py-4 text-text-primary">-25.5 SOL</td>
                    <td className="px-6 py-4 text-text-secondary">
                      Oct 26, 2023
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-primary">
                        Completed
                      </span>
                    </td>
                  </tr>

                  {/* Received Transaction */}
                  <tr>
                    <td className="px-6 py-4 text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-bg text-primary">
                          <span className="material-symbols-outlined text-base">
                            south_west
                          </span>
                        </div>
                        <span>Received</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted">
                      X7h...aT4q
                    </td>
                    <td className="px-6 py-4 text-primary">+150.0 SOL</td>
                    <td className="px-6 py-4 text-text-secondary">
                      Oct 25, 2023
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-primary">
                        Completed
                      </span>
                    </td>
                  </tr>

                  {/* Swap Transaction */}
                  <tr>
                    <td className="px-6 py-4 text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow/20 text-yellow">
                          <span className="material-symbols-outlined text-base">
                            sync
                          </span>
                        </div>
                        <span>Swap</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted">
                      Raydium Pool
                    </td>
                    <td className="px-6 py-4 text-text-primary">-10.0 SOL</td>
                    <td className="px-6 py-4 text-text-secondary">
                      Oct 24, 2023
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow/20 px-2 py-1 text-xs font-medium text-yellow">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3">
            {/* Sent Transaction Card */}
            <div className="rounded-xl border border-border bg-card-dark p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red/20 text-red">
                    <span className="material-symbols-outlined text-lg">
                      north_east
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Sent</p>
                    <p className="text-text-muted text-xs font-mono">
                      B3s...kL9p
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-primary">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-text-primary font-semibold text-lg">
                  -25.5 SOL
                </p>
                <p className="text-text-secondary text-sm">Oct 26, 2023</p>
              </div>
            </div>

            {/* Received Transaction Card */}
            <div className="rounded-xl border border-border bg-card-dark p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-bg text-primary">
                    <span className="material-symbols-outlined text-lg">
                      south_west
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Received</p>
                    <p className="text-text-muted text-xs font-mono">
                      X7h...aT4q
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-primary">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-primary font-semibold text-lg">+150.0 SOL</p>
                <p className="text-text-secondary text-sm">Oct 25, 2023</p>
              </div>
            </div>

            {/* Swap Transaction Card */}
            <div className="rounded-xl border border-border bg-card-dark p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow/20 text-yellow">
                    <span className="material-symbols-outlined text-lg">
                      sync
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Swap</p>
                    <p className="text-text-muted text-xs">Raydium Pool</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-yellow/20 px-2 py-1 text-xs font-medium text-yellow">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-text-primary font-semibold text-lg">
                  -10.0 SOL
                </p>
                <p className="text-text-secondary text-sm">Oct 24, 2023</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ReceiveModal
        visible={isReceiveModalOpen}
        setVisible={setIsReceiveModalOpen}
      />
    </main>
  );
};

export default Home;
