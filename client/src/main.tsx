import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createLogger } from "vite";

// Set up basic error handling for the application
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Here we could display a user-friendly error message
  // or report the error to an analytics service
});

// Add a fallback for the model in case it's not available
// (This will be handled by the components themselves)

createRoot(document.getElementById("root")!).render(<App />);
