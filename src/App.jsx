import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Importar Componentes
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Bank from "./components/Bank/Bank.jsx";
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
        debt: 0, // Dívida total
        interestRate: 0, // Taxa de juros média
      }
  );
  const [gameDate, setGameDate] = useState({ day: 1, week: 1 });
  const navigate = useNavigate();

  // Game Loop para passagem de tempo e cobrança de juros
  useEffect(() => {
    const gameTick = setInterval(() => {
      setGameDate((prevDate) => {
        const newDay = prevDate.day + 1;
        if (newDay > 7) {
          // Nova semana
          return { day: 1, week: prevDate.week + 1 };
        }
        return { ...prevDate, day: newDay };
      });
    }, 5000); // 5 segundos por dia

    return () => clearInterval(gameTick);
  }, []);

  // Lógica de cobrança de juros
  useEffect(() => {
    if (gameDate.day === 4 && userPortfolio.debt > 0) {
      const interest = userPortfolio.debt * (userPortfolio.interestRate / 100);
      setUserPortfolio((prev) => ({
        ...prev,
        balance: prev.balance - interest,
        transactionHistory: [
          ...prev.transactionHistory,
          {
            type: "Juros",
            asset: "Pagamento de Juros",
            quantity: 1,
            price: interest,
            cost: interest,
            date: new Date().toISOString(),
          },
        ],
      }));
    }
  }, [gameDate.day]);

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

  const handleLoan = (amount, rate) => {
    setUserPortfolio((prev) => {
      const newDebt = prev.debt + amount;
      const newBalance = prev.balance + amount;
      // Recalcula a taxa de juros média ponderada
      const newInterestRate =
        (prev.debt * prev.interestRate + amount * rate) / newDebt;

      return {
        ...prev,
        balance: newBalance,
        debt: newDebt,
        interestRate: newInterestRate,
        transactionHistory: [
          ...prev.transactionHistory,
          {
            type: "Empréstimo",
            asset: "Crédito Bancário",
            quantity: 1,
            price: amount,
            cost: amount,
            date: new Date().toISOString(),
          },
        ],
      };
    });
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
              gameDate={gameDate}
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
        <Route
          path="/bank"
          element={<Bank onLoanRequest={handleLoan} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
