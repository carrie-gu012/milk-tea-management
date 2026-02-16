import React from "react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return <div style={{ padding: 20 }}>Home Page</div>;
}
