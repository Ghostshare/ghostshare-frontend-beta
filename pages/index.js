import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ghostshare</title>
        <meta name="description" content="Private File Transfer. Simplified." />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👻</text></svg>"
        ></link>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Ghostshare! 👻</a>
        </h1>
      </main>

      <footer className={styles.footer}>Created with 🖤</footer>
    </div>
  );
}
