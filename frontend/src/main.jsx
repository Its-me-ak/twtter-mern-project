import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SoketContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  }
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {/* <AuthContextProvider> */}
        <SocketProvider>
          <App />
        </SocketProvider>
      {/* </AuthContextProvider> */}
    </QueryClientProvider>
  </BrowserRouter>
);
