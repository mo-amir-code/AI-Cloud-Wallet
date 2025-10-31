import React, { useState } from "react";
import { AddContactModal } from "../components/modals";

const Contacts: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  const contacts = [
    {
      id: 1,
      name: "Alice",
      address: "So1v...aX9Z",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJTDakJ_WmJtzg5nTAAleYNq5gvs90LsAVlOYpssPqdqgx219I0_uH0f6AE0pzqSN1HWkwKxV0t_3pWnRABduJKoLKhNUQE44RDjBbn8nrF6GtAeI7AdDelX0cmCL8ysUdkeRhngLU5AtHlJI4FVyITMgpSLnjAEpVHfFXPq8bW9okmmVnchCwnoAosBsuARgrMeWgTw3TLofQ6zkX9aJahPwkQeVernO_0Fiw20RnihAtjHohSvcYyAdVths9AzeVV8j24A5LP3zZ",
    },
    {
      id: 2,
      name: "Bob",
      address: "B0b4...kL2p",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBcKNAf1n3dFBca1Q3cPNkF15zB1Jtdozx06IQP_hprNhLblzwXDfuE63M3EylW8_2xB1nBr4A0x1w-OMbSh-a2BKIrwavww00mBNOobcJj-efxHsKsF-5omVuHZGMzwIgwbHd0vTBc0ZfwcsNElZRUXTbSFzgdieOrhd41R6eGW6NKuJjv-t-B3je3EC6tahZRpvscX4caVkTCi9EACzF7sV1IlrUZ27geruqo8UOzyGiGml8gms548lBUmnuutiwhlbDJT2tfiI__",
    },
    {
      id: 3,
      name: "Kraken Wallet",
      address: "Kr4k...7hN1",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAJxqj53NO6nbxvWfQu2_isDmzCnE8oys3yDCrhNa79JlsxgS-9J61scP-BCOjVRLJCc4UO9omPmT0FcN1Bh4tE91Q3kPSP9Riyb932I6m7WMou0-w4LQ9KnNvzClGV0RYa57riIlWxiMtu60u-Xee35kHep-heFhD4B8NMkFd0u2-xE2_OWHNoor4sPH50obM0vAzH0EOrtFGF4HoJ8LRxMQq6XRkGBby1iTuQsvbscfTpXNqFd8T5jEsyZJpBS0Zzy2nExUzAt-jp",
    },
  ];

  return (
    <main className="flex-1 p-4 md:p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-text-primary text-3xl md:text-4xl font-bold leading-tight tracking-[-0.03em]">
            Contacts
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <label className="sr-only" htmlFor="search-contacts">
                Search Contacts
              </label>
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                style={{
                  fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                }}
              >
                search
              </span>
              <input
                id="search-contacts"
                type="search"
                placeholder="Search contacts..."
                className="w-full h-11 bg-card-dark border-none rounded-lg text-text-primary placeholder:text-text-secondary pl-10 pr-4 focus:ring-2 focus:ring-primary/50 transition-shadow outline-none"
              />
            </div>

            {/* Add Contact Button */}
            <button
              onClick={() => setIsContactModalOpen((prev) => !prev)}
              className="flex-shrink-0 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span
                className="material-symbols-outlined mr-2"
                style={{
                  fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                }}
              >
                person_add
              </span>
              <span className="truncate">New Contact</span>
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-card-dark rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 pl-6 text-sm font-semibold text-text-secondary tracking-wider uppercase">
                    Name
                  </th>
                  <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider uppercase hidden sm:table-cell">
                    Wallet Address
                  </th>
                  <th className="p-4 pr-6 text-sm font-semibold text-text-secondary tracking-wider uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="group border-b border-white/5 last:border-b-0 hover:bg-hover-light transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                          style={{
                            backgroundImage: `url("${contact.avatar}")`,
                          }}
                        ></div>
                        <div className="flex flex-col">
                          <p className="text-text-primary text-base font-medium leading-normal">
                            {contact.name}
                          </p>
                          <p className="text-text-secondary text-sm sm:hidden">
                            {contact.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-sm font-mono hidden sm:table-cell">
                      {contact.address}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {/* Edit */}
                        <button
                          className="text-text-muted hover:text-text-primary transition-colors flex size-8 items-center justify-center hover:bg-hover-light rounded-full"
                          title="Edit Contact"
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={{
                              fontVariationSettings:
                                "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                            }}
                          >
                            edit
                          </span>
                        </button>

                        {/* Send */}
                        <button
                          className="text-text-muted hover:text-text-primary transition-colors flex size-8 items-center justify-center hover:bg-hover-light rounded-full"
                          title="Send Funds"
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={{
                              fontVariationSettings:
                                "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                            }}
                          >
                            send
                          </span>
                        </button>

                        {/* Delete */}
                        <button
                          className="text-red-500/70 hover:text-red-500 transition-colors flex size-8 items-center justify-center hover:bg-red-500/10 rounded-full"
                          title="Delete Contact"
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={{
                              fontVariationSettings:
                                "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                            }}
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Add Contact Modal */}
      <AddContactModal
        visible={isContactModalOpen}
        setVisible={setIsContactModalOpen}
      />
    </main>
  );
};

export default Contacts;
