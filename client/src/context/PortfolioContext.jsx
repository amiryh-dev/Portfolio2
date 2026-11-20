import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";

const PortfolioContext = createContext(null);
const PortfolioUpdateContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPortfolio() {
      try {
        // Page content, projects and qualifications come from separate APIs
        // and are combined into one object for the pages.
        const options = { signal: controller.signal };
        const [content, projects, qualifications] = await Promise.all([
          apiRequest("/api/portfolio", options),
          apiRequest("/api/projects", options),
          apiRequest("/api/qualifications", options),
        ]);
        setPortfolio({ ...content, projects, qualifications });
        setError("");
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Could not connect to the server.");
        }
      }
    }

    loadPortfolio();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setError("");
    setAttempt((current) => current + 1);
  }, []);

  if (error) {
    return (
      <main className="api-status" role="alert">
        <h1>Portfolio content is unavailable</h1>
        <p>{error} Check the server connection, then try again.</p>
        <button className="button-primary" onClick={retry}>
          Retry
        </button>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="api-status" role="status">
        <p>Loading portfolio…</p>
      </main>
    );
  }

  return (
    <PortfolioUpdateContext.Provider value={setPortfolio}>
      <PortfolioContext.Provider value={portfolio}>
        {children}
      </PortfolioContext.Provider>
    </PortfolioUpdateContext.Provider>
  );
}

export function usePortfolio() {
  const portfolio = useContext(PortfolioContext);
  if (!portfolio) {
    throw new Error("usePortfolio must be used within PortfolioProvider.");
  }
  return portfolio;
}

// Replaces the content shown on the site, e.g. after the dashboard saves.
export function useSetPortfolio() {
  const setPortfolio = useContext(PortfolioUpdateContext);
  if (!setPortfolio) {
    throw new Error("useSetPortfolio must be used within PortfolioProvider.");
  }
  return setPortfolio;
}
