import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common";
import { useAppStore } from "../zustand/appStore";
import { AIAssistant } from "../components/modals";
import { AIBtn } from "../components/buttons";

const MainLayout = () => {
  const { isSidebarOpen, isAIModalOpen, toggleSidebar, toggleAIModal } =
    useAppStore();

  return (
    <div className="relative h-dvh w-full flex min-h-screen overflow-hidden flex-col bg-background-dark font-display text-text-primary overflow-hidden">
      <div className="flex h-full w-full flex-1 relative">
        {/* Sidebar with animation */}
        <div
          className={`absolute top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => toggleSidebar()}
            className="fixed inset-0 bg-black/50 z-10 transition-opacity duration-300 ease-in-out md:hidden"
          />
        )}

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 overflow-auto ease-in-out ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </div>

        {/* Toggle button when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => toggleSidebar()}
            className="absolute top-3 left-0 -translate-x-1/2 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-primary text-background-dark hover:bg-success-bg transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-lg font-bold">
              left_panel_open
            </span>
          </button>
        )}
      </div>

      <AIAssistant visible={isAIModalOpen} onClose={() => toggleAIModal()} />
      <AIBtn />
    </div>
  );
};

export default MainLayout;
