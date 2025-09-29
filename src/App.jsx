import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Componentes importados:
import Login from "./components/Login/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Portfolio from "./components/Portfolio/Portfolio.jsx";
import AssetsList from "./components/AssetsList/AssetsList.jsx";
import AssetsDetails from "./components/AssetsDetails/AssetsDetails.jsx";
import BuyForm from "./components/BuyForm/BuyForm.jsx";
import TransactionHistory from "./components/TransactionHistory/TransactionHistory.jsx";
import styles from "./App.module.css"; // Importa o CSS Module
import SellForm from "./components/SellForm/SellForm.jsx";
import Profile from "./components/Profile/Profile.jsx";
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
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

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("userPortfolio", JSON.stringify(userPortfolio));
  }, [userPortfolio]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("userPortfolio");
    localStorage.removeItem("isLoggedIn");
    setUserPortfolio({
      balance: 10000.0,
      holdings: {},
      transactionHistory: [],
    });
    navigate("/");
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    navigate("/buy");
  };

  const handleSelectAssetForSell = (asset) => {
    setSelectedAsset(asset);
    navigate("/sell");
  };

  const handleSelectAssetForDetails = (asset) => {
    setSelectedAsset(asset);
    navigate("details");
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

      navigate("dashboard");
      return true;
    }
    return false;
  };

  const handleSellConfirm = (asset, quantity) => {
    const revenue = asset.price * quantity;
    const newHoldings = { ...userPortfolio.holdings };
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

      navigate("portfolio");
      return true;
    }
    return false;
  };

  return (
    <Routes>
      {/* Rota pública de login */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      {/* Rotas Protegidas dentro do Layout Principal */}
      <Route
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MainLayout handleLogout={handleLogout} />
          </ProtectedRoute>
        }>
        <Route
          path="/dashboard"
          element={
            <Dashboard
              userPortfolio={userPortfolio}
              currentUser={currentUser}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
