import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home-page";
import { AuthenticationGuard } from "./components/authentication-guard";
import { CallbackPage } from "./pages/callback-page";
import { LoadingSpinner } from "./components/loading-spinner";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="100" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthenticationGuard component={HomePage} />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}

export default App;
