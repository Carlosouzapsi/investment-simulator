import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Importar Componentes
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AssetsList from "./components/AssetsList/AssetsList.jsx";
import BuyForm from "./components/BuyForm/BuyForm.jsx";
import SellForm from "./components/SellForm/SellForm.jsx";
import TransactionHistory from "./components/TransactionHistory/TransactionHistory.jsx";
import AssetDetails from "./components/AssetDetails/AssetDetails.jsx";
import Portfolio from "./components/Portfolio/Portfolio.jsx";
import Profile from "./components/Profile/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout/MainLayout.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [userPortfolio, setUserPortfolio] = useState(
    () =>
      JSON.parse(localStorage.getItem("userPortfolio")) || {
        balance: 10000.0,
        holdings: {},
        transactionHistory: [],
      }
  );
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
    localStorage.removeItem("userPortfolio");
    setUserPortfolio({
      balance: 10000.0,
      holdings: {},
      transactionHistory: [],
    });
    navigate("/");
  };

  const handleUpdateUser = (updatedUserData) => {
    setCurrentUser(updatedUserData);
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
    navigate("/details");
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

      navigate("/dashboard");
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

      navigate("/portfolio");
      return true;
    }
    return false;
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp />} />
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
        <Route
          path="/assets"
          element={
            <AssetsList
              onSelectAsset={handleSelectAsset}
              onSelectAssetForDetails={handleSelectAssetForDetails}
            />
          }
        />
        <Route
          path="/portfolio"
          element={
            <Portfolio
              userPortfolio={userPortfolio}
              onBuy={handleSelectAsset}
              onSell={handleSelectAssetForSell}
            />
          }
        />
        <Route
          path="/history"
          element={
            <TransactionHistory
              transactionHistory={userPortfolio.transactionHistory}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
            />
          }
        />
        <Route
          path="/buy"
          element={
            <BuyForm
              asset={selectedAsset}
              onBuyConfirm={handleBuyConfirm}
              onBack={() => navigate("/assets")}
            />
          }
        />
        <Route
          path="/sell"
          element={
            <SellForm
              asset={selectedAsset}
              onSellConfirm={handleSellConfirm}
              onBack={() => navigate("/portfolio")}
            />
          }
        />
        <Route
          path="/details"
          element={
            <AssetDetails
              asset={selectedAsset}
              onBack={() => navigate("/assets")}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
