import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom"; // 1. Importar useNavigate e Link

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 2. Inicializar o hook de navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      let userData;
      if (email === "simulador@email.com".toLowerCase() && password === "123") {
        // Simula a resposta localmente para o utilizador mockado
        // eslint-disable-next-line no-unused-vars
        userData = await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: "mock-1",
                name: "Utilizador Simulador",
                email: "simulador@email.com",
              }),
            500
          )
        );
        onLogin(true);
      } else {
        const response = await fetch("http://localhost:3333/user/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          // tentar ler a mensagem de erro da API se houver
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              "Falha na autenticação. Verifique as suas credenciais."
          );
        }
        // eslint-disable-next-line no-unused-vars
        userData = await response.json();
      }
      onLogin(userData); // Atualiza o estado no App.jsx
      navigate("/dashboard"); // 3. Redireciona para o dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.infoPanel}>
        <div className={styles.infoContent}>
          <div className={styles.seal}>
            <span className={styles.sealIcon}>★</span>
            THE INVESTMENT GAME
          </div>
          <p className={styles.quote}>
            "O maior risco de todos é não correr nenhum risco."
          </p>
          <span className={styles.author}>- Um Sábio Investidor</span>
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Acesso ao Clube</h1>
          <p>Edição de Luxo</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email do Jogador
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          {error && <p className={styles.textDanger}>{error}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}>
            {isLoading ? "Validando..." : "Iniciar Jogo"}
          </button>
        </form>
        <p className={styles.signUpLink}>
          Primeira vez aqui? <Link to="/signup">Crie sua conta</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
