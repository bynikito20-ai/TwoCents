import React from "react";
import { MoonStars } from "./MoonStars";
import { Sun } from "./Sun";
import "./ThemeToggle.css";

export const ThemeToggle = ({ modoOscuro, cambiarTema }) => {
  return (
    <button
      onClick={cambiarTema}
      className={`toggle ${modoOscuro ? "dark" : "light"}`}
    >
      <div className="circle">
        {modoOscuro ? <MoonStars /> : <Sun />}
      </div>
    </button>
  );
};