import { useEffect } from "react";
import Router from "./Router";

function App() {
  const handleAuth = async () => {
    const res = await fetch(
      "https://ruby-monographical-slicingly.ngrok-free.dev/api/v1/auth/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "browser",
        }),
      }
    );

    let data = await res.json();
    window.open(data.data.redirect_url, "OAuthPopup", "width=500,height=600");
  };

  const handleLogout = async () => {
    const res = await fetch(
      "https://ruby-monographical-slicingly.ngrok-free.dev/api/v1/auth/google/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    let data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    const handleWindowMessage = (event: any) => {
      if (
        event.origin !== "https://ruby-monographical-slicingly.ngrok-free.dev"
      )
        return;
      console.log("Data from popup:", event.data);
    };

    window.addEventListener("message", handleWindowMessage);

    return () => {
      if (handleWindowMessage) {
        window.removeEventListener("message", handleWindowMessage);
      }
    };
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
