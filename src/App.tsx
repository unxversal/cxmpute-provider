import { useState, useEffect } from "react";
import "./App.css";
import Menu from "./components/menu/Menu";
import { Bell, Circle, ToggleLeft, ToggleRight, Users, Wifi } from "lucide-react";
import EarningsStatisticsChart from "./components/EarningsStatisticsChart/EarningsStatisticsChart";
import { platform, arch } from '@tauri-apps/plugin-os';
import Diagnostics from "./components/Diagnostics/Diagnostics";
import { DiagnosticsType } from "./lib/interfaces";

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

  const [username, setUsername] = useState("");
  const [screen, setScreen] = useState("diagnostics");
  const [diagnostics, setDiagnostics] = useState<DiagnosticsType | null>(null);

  const currentPlatform = platform();
  console.log(currentPlatform);




  return (
    <main className="container">
      {}{screen==="diagnostics" && 
        <div className="diagnostics">
          <Diagnostics />
        </div>
      }
      {screen==="dashboard" && <>
        <Menu />
        <div className="main">
          <div className="header">
            <div className="header__left">
              <h2>Dashboard</h2>
              <div className="referrals__container">
                <div className="referrals__text">
                  <Users size={20}/>
                  <p>Referrals: </p>
                  <span>0</span>
                </div>
                <button className="referrals__button">COPY REFERRAL CODE</button>
              </div>
            </div>
            <div className="headeractions">
              <div className="profile__container">
                <div className="profile__username">Hello, {username}!</div>
                {/* <div className="profile__image">
                  <img src="/six.png" alt="logo" height={50} width={50}/>
                </div> */}
              </div>
              <div className="notifications__container">
                <Bell size={20}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row__card earnings">
              <div className="row__header">
                <h2>Earnings</h2>
                <button className="earnings__button">View Referral Earnings</button>
              </div>
              <div className="row__content">
                <div className="earnings__container">
                  <div className="earnings__card">
                    <h2>Lifetime Earnings:</h2>
                    <div className="earnings__right">
                      <img src="/six.png" alt="logo" height={40} width={40}/>
                      <h3>234.50</h3>
                    </div>
                  </div>
                  <p>Last updated: 1/1/2023 12:00AM</p>
                </div>
                <div className="earnings__container">
                  <div className="earnings__card">
                    <h2>Today's Earnings:</h2>
                    <div className="earnings__right">
                      <img src="/six.png" alt="logo" height={40} width={40}/>
                      <h3>11.50</h3>
                    </div>
                  </div>
                  <p>Last updated: 1/1/2023 12:00AM</p>
                </div>
              </div>
            </div>
            <div className="row__card connectivity">
              <div className="row__header">
                <Wifi size={60}/>
                <button className="connectivity__button">
                  <Circle size={20} fill={cxmputeGreen}/>
                  Connected
                </button>
              </div>
              <div className="connectivity__row">
                <h3>Connect more devices to earn more.</h3>
                <p>You can always disconnect devices in the section below.</p>
              </div>
              <div className="row__footer">
                <span className="connectivity__text">Device Type: </span>
                <span>Blue Surf</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row__card statistics">
              <EarningsStatisticsChart />
            </div>
          </div>
          <div className="row"></div>
        </div>
      </>}
    </main>
  );
}

export default App;
