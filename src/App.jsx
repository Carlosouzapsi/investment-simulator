import React, { useEffect } from "react";
import Login from "./components/Login/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Portfolio from "./components/Portfolio/Portfolio.jsx";
import AssetsList from "./components/AssetsList/AssetsList.jsx";
import AssetsDetails from "./components/AssetsDetails/AssetsDetails.jsx";
import BuyForm from "./components/BuyForm/BuyForm.jsx";
import TransactionHistory from "./components/TransactionHistory/TransactionHistory.jsx";
import { useState } from "react";
import styles from "./App.module.css"; // Importa o CSS Module
import SellForm from "./components/SellForm/SellForm.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );
  const [currentView, setCurrentView] = useState(
    isLoggedIn ? "dashboard" : "login"
  );
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [userPortfolio, setUserPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem("userPortfolio");
    // Return saved portfolio or default values:
    return savedPortfolio
      ? JSON.parse(savedPortfolio)
      : {
          balance: 10000.0,
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

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setCurrentView("buy");
  };

  const handleSelectAssetForSell = (asset) => {
    setSelectedAsset(asset);
    setCurrentView("sell");
  };

  const handleSelectAssetForDetails = (asset) => {
    setSelectedAsset(asset);
    setCurrentView("details");
  };

  const handleBuyConfirm = (asset, quantity) => {
    const cost = asset.price * quantity;
    if (userPortfolio.balance >= cost) {
      const newBalance = userPortfolio.balance - cost;
      const newHoldings = { ...userPortfolio.holdings };
      const existingHolding = newHoldings[asset.ticker];
      if (existingHolding) {
        existingHolding.quantity += quantity;
        existingHolding.totalCost += cost;
      } else {
        newHoldings[asset.ticker] = {
          ...asset,
          quantity: quantity,
          totalCost: cost,
        };
      }

      const newTransaction = {
        type: "Compra",
        asset: asset.ticker,
        quantity: quantity,
        price: asset.price,
        cost: cost,
        date: new Date().toLocaleDateString("pt-BR"),
      };

      setUserPortfolio({
        balance: newBalance,
        holdings: newHoldings,
        transactionHistory: [
          ...userPortfolio.transactionHistory,
          newTransaction,
        ],
      });

      setCurrentView("dashboard");
      return true;
    }
    return false;
  };

  const handleSellConfirm = (asset, quantity) => {
    const revenue = asset.price * quantity;
    const newHoldings = { ...userPortfolio.holdings };
    // parei aqui
    const existingHolding = newHoldings[asset.ticker];

    if (existingHolding && existingHolding.quantity >= quantity) {
      const originalQuantity = existingHolding.quantity;
      existingHolding.quantity -= quantity;

      const avgCost = existingHolding.totalCost / originalQuantity;
      existingHolding.totalCost -= avgCost * quantity;

      if (existingHolding.quantity <= 0.0001) {
        delete newHoldings[asset.ticker];
      }

      const newBalance = userPortfolio.balance + revenue;

      const newTransaction = {
        type: "Venda",
        asset: asset.ticker,
        quantity: quantity,
        price: asset.price,
        cost: -revenue,
        date: new Date().toLocaleDateString("pt-BR"),
      };

      setUserPortfolio({
        balance: newBalance,
        holdings: newHoldings,
        transactionHistory: [
          ...userPortfolio.transactionHistory,
          newTransaction,
        ],
      });

      setCurrentView("dashboard");
      return true;
    }
    return false;
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <Login onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard userPortfolio={userPortfolio} />;
      case "assets":
        return (
          <AssetsList
            onSelectAsset={handleSelectAsset}
            onSelectAssetForDetails={handleSelectAssetForDetails}
          />
        );
      case "buy":
        return (
          <BuyForm
            asset={selectedAsset}
            onBuyConfirm={handleBuyConfirm}
            onBack={() => setCurrentView("assets")}
          />
        );
      case "history":
        return (
          <TransactionHistory
            transactionHistory={userPortfolio.transactionHistory}
          />
        );
      case "details":
        return (
          <AssetsDetails
            asset={selectedAsset}
            onBack={() => setCurrentView("assets")}
          />
        );
      case "portfolio":
        return (
          <Portfolio
            userPortfolio={userPortfolio}
            onBuy={handleSelectAsset}
            onSell={handleSelectAssetForSell}
            onBack={() => setCurrentView("dashboard")}
          />
        );
      case "sell":
        return (
          <SellForm
            asset={selectedAsset}
            onSellConfirm={handleSellConfirm}
            onBack={() => setCurrentView("portfolio")}
          />
        );
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
              onClick={() => setCurrentView("assets")}
              className={`btn btn-filter ${
                currentView === "assets" ? "active" : ""
              }`}>
              Consultar Ativos
            </button>
            <button
              onClick={() => setCurrentView("portfolio")}
              className={`btn btn-filter ${
                currentView === "portfolio" ? "active" : ""
              }`}>
              Minha Carteira
            </button>
            <button
              onClick={() => setCurrentView("history")}
              className={`btn btn-filter ${
                currentView === "history" ? "active" : ""
              }`}>
              Histórico
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
