import {
  ClientLoaderFunctionArgs,
  Link,
  Outlet,
  redirect,
} from "@remix-run/react";
import styles from "./_layout.module.css";
import type { MetaFunction, LinksFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Maddie Buddy" },

    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-title", content: "Maddie Buddy" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    { name: "application-name", content: "Maddie Buddy" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "theme-color", content: "#bada55" },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "apple-touch-icon",
      sizes: "192x192",
      href: "/icons/maddie-192.jpg",
    },
    { rel: "apple-touch-startup-image", href: "/icons/maddie-512.jpg" },
    { rel: "manifest", href: "/manifest.json" },
  ];
};

export default function Layout() {
  return (
    <>
      <header className={styles.header}>
        <nav>
          <ul>
            <li>
              <img src={"/icons/maddie-40.jpg"} alt="Maddie" />
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chart">Charts</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
