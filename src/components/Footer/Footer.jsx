import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} The Investment Game. Uma simulação por
        sua conta e risco.
      </p>
    </footer>
  );
}

export default Footer;
