import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Menu from "./components/menu/Menu";

const cxmputeGreen = "#20a191";
const cxmputePink = "#fe91e8";
const cxmputeYellow = "#f8cb46";
const cxmputePurple = "#91a8eb";
// const cxmputeRed = "#d64989";
// const cxmputeSand = "#d4d4cb";
const cxmputeSlate = "#d4d4cb";
// const cxmputeBeige = "#f9f5f2";
// const cxmputeBeigerBeige = "#fdede3";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <Menu />
    </main>
  );
}

export default App;
