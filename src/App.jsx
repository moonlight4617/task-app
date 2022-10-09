import React from "react";
import "./styles.css";
import { Daily } from "./components/Daily";
import { Progress } from "./components/Progress";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

export const App = () => {

  return (
    <>
      <Router>
        <nav>
          <Link to="/daily">Daily</Link>
          <Link to="/progress">Progress</Link>
        </nav>

        <Routes>
          <Route path="/daily" element={<Daily />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </Router>
    </>
  );
};
