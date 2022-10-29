import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { firebaseConfig } from './config';
import Login from './Components/Login'
import './App.css';
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} exact/>
          <Route path="/dashboard" element={<Dashboard />} exact/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
