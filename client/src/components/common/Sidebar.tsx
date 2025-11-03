import { NavLink } from "react-router-dom";
import { useAppStore } from "../../stores/appStore";
import { useUserStore } from "../../stores/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpAxios, ROUTES } from "../../utils/axios";

const Sidebar = () => {
  const { toggleSidebar } = useAppStore();
  const { userInfo, logout: kLogout } = useUserStore();
  const queryClient = useQueryClient();

  const navItems = [
    { to: "/dashboard", label: "Home", icon: "home" },
    { to: "/dashboard/send", label: "Send", icon: "north_east" },
    { to: "/dashboard/contacts", label: "Contacts", icon: "group" },
    { to: "/dashboard/profile", label: "Profile", icon: "person" },
  ];

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await httpAxios.post(ROUTES.AUTH.LOGOUT);
      return res.data;
    },
    onSuccess: () => {
      // Reset client state to defaults
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      kLogout();
    },
    onError: () => {
      kLogout();
    },
  });

  return (
    <aside className="flex w-64 h-full flex-col justify-between border-r border-border bg-background-dark p-4 relative shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3 px-2 pt-2">
          <img
            src={
              userInfo?.photoUrl ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuB7c4Ensamgz_7MXRlyfFhQGZ7p6duNi67vOS0XRC6BdkAhpFTHzYTAgnMdBrtVsxulstgim1tl-w53GGMqgyE7RS7nBjiABlLJYG5gBd9hJQ-ytLWIaDp8yXH2rjGtLL7tqf3h1dvMpeaVZ_785td-GBG--SyMpMaM74VXmoYoGLvKlCQ_BhOf7PjwfcWKqed8MmKDowi8JAcHlATQL7_nBewCUzMYPy2JgebUvdMD9hMVrfIVRtMbTVhX6B9U9XInC9XwhR31V7uB"
            }
            alt={userInfo?.name || "User avatar"}
            className="rounded-lg size-10 object-cover"
          />
          <div className="flex flex-col">
            <h1 className="text-foreground text-base font-bold leading-normal">
              {userInfo ? userInfo.name : "Guest User"}
            </h1>
            <p className="text-foreground/60 text-sm font-normal leading-normal">
              Web Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"} // only exact match for dashboard root
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"></div>
                  )}
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isActive
                        ? "'FILL' 1"
                        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    {icon}
                  </span>
                  <p className="text-sm font-medium leading-normal">{label}</p>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground/70 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }}
          >
            {isLoggingOut ? "hourglass_top" : "logout"}
          </span>
          <p className="text-sm font-medium leading-normal">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </p>
        </button>
      </div>

      {/* Close Icon */}
      <button
        onClick={() => toggleSidebar()}
        className="absolute top-2 right-2 cursor-pointer hover:bg-foreground/10 rounded-lg p-1 transition-colors"
      >
        <span className="material-symbols-outlined text-foreground">close</span>
      </button>
    </aside>
  );
};

export default Sidebar;
