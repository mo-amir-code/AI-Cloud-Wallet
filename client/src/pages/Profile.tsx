import React, { useState } from "react";

const Profile: React.FC = () => {
  const [name, setName] = useState("Satoshi Nakamoto");
  const [email, setEmail] = useState("satoshi.n@email.com");

  // const wallets = [
  //   { id: 1, name: "Main Savings", address: "So11...1111", icon: "savings" },
  //   {
  //     id: 2,
  //     name: "Trading Fund",
  //     address: "Trad...2222",
  //     icon: "candlestick_chart",
  //   },
  //   { id: 3, name: "dApp Connector", address: "Dapp...3333", icon: "hub" },
  // ];

  return (
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 lg:size-28"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDf-HZs80b5UILcJW7jwi8ZmOnV-68tCA435tdyksbS46GNo4kYzg6YaUqaLdAqQ9H7Zoyj5d4m2AnYHPTYO43vlcthQcjaxSMWnDuvZEZxyGCs4bvXAz2js56UU8trUFLtIQ6eCksw0Yb4xetbMPRd8A_MMF1wNPPzNZ5YS6juj74NTnDuR-FKi9eRZjAiksQkFnt3y1ElXGC9khItWaraCgK8wChn-MGVZdp-5Ajo4-U1dApfbyKdVNLStVvKxzI5apRxYUIgPrFB")',
              }}
            ></div>
            {/* <button className="absolute bottom-1 right-1 flex items-center justify-center size-8 bg-success-bg rounded-full text-text-primary ring-2 ring-background-dark hover:bg-primary hover:text-background-dark transition-colors">
              <span className="material-symbols-outlined text-base">edit</span>
            </button> */}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-text-primary text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em]">
              {}
            </h1>
            <p className="text-text-secondary text-base font-normal leading-normal mt-1">
              {email}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="material-symbols-outlined text-primary text-lg leading-none">
                verified
              </span>
              <p className="text-primary text-sm font-medium leading-normal">
                Verified Account
              </p>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="xl:col-span-1 flex flex-col gap-8">
            {/* Account Settings */}
            <div>
              <h2 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Account Settings
              </h2>
              <div className="flex flex-col gap-4">
                <label className="text-sm text-text-secondary" htmlFor="name">
                  Name
                </label>
                <input
                  className="bg-card-dark border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary outline-none transition-colors focus:border-primary focus:text-primary"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="text-sm text-text-secondary" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="bg-card-dark border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary outline-none transition-colors focus:border-primary focus:text-primary"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity mt-2">
                  <span className="truncate">Save Changes</span>
                </button>
              </div>
            </div>

            {/* Security */}
            {/* <div>
              <h2 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Security
              </h2>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-text-primary text-sm font-medium">
                      Two-Factor Authentication
                    </p>
                    <p className="text-text-secondary text-xs">
                      Protect your account with an extra layer of security.
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      twoFactorEnabled ? "bg-primary" : "bg-hover-light"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark`}
                    role="switch"
                    type="button"
                    aria-checked={twoFactorEnabled}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background-dark shadow ring-0 transition duration-200 ease-in-out ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-card-dark border border-border text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined text-base">
                    password
                  </span>
                  <span className="truncate text-sm font-medium">
                    Change Password
                  </span>
                </button>

                <button className="w-full flex items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-card-dark border border-border text-text-muted hover:bg-hover-light hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined text-base">
                    history
                  </span>
                  <span className="truncate text-sm font-medium">
                    View Session History
                  </span>
                </button>
              </div>
            </div> */}
          </div>

          {/* Right Column - Wallets */}
          {/* <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-text-primary text-[22px] font-bold leading-tight tracking-[-0.015em]">
                My Wallets
              </h2>
              <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-base">add</span>
                <span className="truncate">Add New Wallet</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card-dark p-4 min-h-[72px] justify-between rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4 flex-1 w-full sm:w-auto overflow-hidden">
                    <div className="text-text-primary flex items-center justify-center rounded-lg bg-hover-light shrink-0 size-12">
                      <span className="material-symbols-outlined">
                        {wallet.icon}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className="text-text-primary text-base font-medium leading-normal truncate">
                        {wallet.name}
                      </p>
                      <p className="text-text-secondary text-sm font-normal leading-normal truncate">
                        {wallet.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button className="text-text-muted hover:text-text-primary flex size-9 items-center justify-center bg-hover-light hover:bg-border rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        qr_code_2
                      </span>
                    </button>
                    <button className="text-text-muted hover:text-text-primary flex size-9 items-center justify-center bg-hover-light hover:bg-border rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default Profile;
