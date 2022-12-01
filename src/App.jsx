import React from "react";
import "./styles.css";
import { Daily } from "./components/Daily";
import { Progress } from "./components/Progress";
import { Calendar } from "./components/Calendar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { SettingScreen } from "./components/SettingScreen";
import { ResponsiveAppBar } from "./components/header";

export const App = () => {

  return (
    <>
      <ResponsiveAppBar />
      {/* <Router>
        <nav>
          <Link to="/daily">Daily</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/setting">Setting</Link>
        </nav>

        <Routes>
          <Route path="/daily" element={<Daily />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/setting" element={<SettingScreen />} />
        </Routes>
      </Router> */}
    </>
  );
};
