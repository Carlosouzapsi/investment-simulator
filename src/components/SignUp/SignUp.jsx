import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

const API_BASE_URL = 'http://localhost:3333';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar a conta.');
      }

      // Redireciona para a página de login após o sucesso
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signUpPage}>
      <div className={styles.infoPanel}>
        <div className={styles.infoContent}>
          <div className={styles.seal}>
            <span className={styles.sealIcon}>★</span>
            THE INVESTMENT GAME
          </div>
          <p className={styles.quote}>
            "O primeiro passo para a riqueza é a sua inscrição."
          </p>
          <span className={styles.author}>- O Fundador</span>
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Solicitação de Membro</h1>
          <p>Preencha sua Ficha</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Defina sua Palavra-Chave
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">
              Confirme a Palavra-Chave
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          {error && <p className={styles.textDanger}>{error}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}>
            {isLoading ? "Enviando..." : "Tornar-se Membro"}
          </button>
        </form>
        <p className={styles.loginLink}>
          Já é um membro? <Link to="/">Retornar ao Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;