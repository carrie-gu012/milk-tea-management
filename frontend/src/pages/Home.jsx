// src/pages/Home.jsx
import React, { useEffect } from "react";
import { api } from "../api/client.jsx";

export default function Home() {
  useEffect(() => {
    api("/products")
      .then((data) => console.log("products:", data))
      .catch((err) => console.error(err));
  }, []);

  return <div style={{ padding: 20 }}>Home Page</div>;
}
