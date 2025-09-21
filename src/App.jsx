import React, { useEffect } from "react";
import Login from "./components/Login/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Portfolio from "./components/Portfolio/Portfolio.jsx";
import { useState } from "react";
import styles from "./App.module.css"; // Importa o CSS Module

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [currentView, setCurrentView] = useState(
    isLoggedIn ? "dashboard" : "login"
  );
  // const [selectedAsset, setSelectedAssert] = useState(null);
  const [userPortfolio, setUserPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem("userPortfolio");
    // Return saved portfolio or default values:
    return savedPortfolio
      ? JSON.parse(savedPortfolio)
      : {
          balance: 1000.0,
          holdings: {},
          transactionHistory: [],
        };
  });

  useEffect(() => {
    localStorage.setItem("userPortfolio", JSON.stringify(userPortfolio));
  }, [userPortfolio]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = (success) => {
    if (success) {
      setIsLoggedIn(true);
      setCurrentView("dashboard");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userPortfolio");
    localStorage.removeItem("isLoggedIn");
    setUserPortfolio({
      balance: 10000.0,
      holdings: {},
      transactionHistory: [],
    });
    setCurrentView("login");
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <Login onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard userPortfolio={userPortfolio} />;
      case "portfolio":
        return <Portfolio userPortfolio={userPortfolio} />;
      default:
        return <Dashboard userPortfolio={userPortfolio} />;
    }
  };

  return (
    <div className={styles.appContainer}>
      {isLoggedIn && (
        <nav className={styles.appNav}>
          <div className={styles.navLinks}>
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`btn btn-filter ${
                currentView === "dashboard" ? "active" : ""
              }}`}>
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView("portfolio")}
              className={`btn btn-filter ${
                currentView === "portfolio" ? "active" : ""
              }`}>
              Minha Carteira
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Sair
            </button>
          </div>
        </nav>
      )}
      <main className={styles.appMain}>
        <div className={styles.mainContentWrapper}>{renderView()}</div>
      </main>
    </div>
  );
}

export default App;
