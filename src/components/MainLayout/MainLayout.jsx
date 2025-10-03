import React from "react";
import styles from "./MainLayout.module.css";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../Footer/Footer"; // Importa o Footer

function MainLayout({ handleLogout }) {
  return (
    <div className={styles.appContainer}>
      <nav className={styles.appNav}>
        <h1 className={styles.logo}>The Investment Game</h1>
        <div className={styles.navLinks}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }>
            Painel
          </NavLink>
          <NavLink
            to="/assets"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }>
            Mercado
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }>
            Carteira
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }>
            Registros
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }>
            Perfil
          </NavLink>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Encerrar Sessão
          </button>
        </div>
      </nav>
      <main className={styles.appMain}>
        <div className={styles.mainContentWrapper}>
          <Outlet /> {/* As páginas serão renderizadas aqui */}
        </div>
      </main>
      <Footer /> {/* Adiciona o Footer aqui */}
    </div>
  );
}

export default MainLayout;
