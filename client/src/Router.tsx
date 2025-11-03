import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/Landing"));
const HomePage = lazy(() => import("./pages/Home"));
const ContactsPage = lazy(() => import("./pages/Contacts"));
const SendPage = lazy(() => import("./pages/Send"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const NotFoundPage = lazy(() => import("./pages/404"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));

function Router() {
  const routes = createBrowserRouter([
    {
      path: "/",
      Component: LandingPage,
    },
    {
      path: "/dashboard",
      Component: MainLayout,
      children: [
        {
          path: "",
          Component: HomePage,
        },
        {
          path: "contacts",
          Component: ContactsPage,
        },
        {
          path: "send",
          Component: SendPage,
        },
        {
          path: "profile",
          Component: ProfilePage,
        },
      ],
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ]);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-lg">
          Loading...
        </div>
      }
    >
      <RouterProvider router={routes} />
    </Suspense>
  );
}

export default Router;
