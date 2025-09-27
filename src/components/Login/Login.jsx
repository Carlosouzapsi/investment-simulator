import React, { useState } from "react";
import styles from "./Login.module.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      onLogin(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Acesse sua conta</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div>
          <label className={styles.formLabel} htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
          />
        </div>
        {error && (
          <p className={`${styles.formMessage} ${styles.textDanger}`}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          style={{ marginTop: "1rem" }}>
          Entrar
          {isLoading ? "A processar..." : "Entrar"}
        </button>
        <p
          className={`${styles.textCenter} ${styles.textMuted}`}
          style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
          Use 'simulador@email.com' para email e '123' para a senha. Para usar o
          usuário mockado
        </p>
      </form>
    </div>
  );
}

export default Login;
