import React, { useState } from "react";
import styles from "./Login.module.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (username === "simulador" && password === "123") {
      onLogin(true);
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Acesse sua conta</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="username">
            Usuário
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </button>
        <p
          className={`${styles.textCenter} ${styles.textMuted}`}
          style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
          Use 'simulador' para usuário e '123' para a senha.
        </p>
      </form>
    </div>
  );
}

export default Login;
