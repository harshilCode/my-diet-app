import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "./firebase";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import "./App.css";
import MainComponent from "./Components/MainComponent";
import DietLogs from "./Components/DietLogs";
import Groups from "./Components/Groups";
import Recipes from "./Components/Recipes";

function App() {
  const auth = getAuth();
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) getUser(currentUser?.email);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getUser = async (userEmail) => {
    if (userEmail) {
      const docRef = doc(db, "users", userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        addUser(userEmail);
      }
    }
  };

  const addUser = async (userEmail) => {
    try {
      const data = {
        firstName: "",
        lastName: "",
        about: "",
        created: serverTimestamp(),
        email: userEmail,
      };
      await setDoc(doc(db, "users", userEmail), data);
      getUser(userEmail);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="App">
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} exact />
            <Route element={<MainComponent user={user} />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard user={user} />
                  </ProtectedRoute>
                }
                exact
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile user={user} />
                  </ProtectedRoute>
                }
                exact
              />
              <Route
                path="diet-logs"
                element={
                  <ProtectedRoute>
                    <DietLogs user={user} />
                  </ProtectedRoute>
                }
                exact
              />
              <Route
                path="groups"
                element={
                  <ProtectedRoute>
                    <Groups user={user} />
                  </ProtectedRoute>
                }
                exact
              />
              <Route
                path="recipes"
                element={
                  <ProtectedRoute>
                    <Recipes user={user} />
                  </ProtectedRoute>
                }
                exact
              />
              {/* <Route path="*" element={<NoMatch />} /> */}
            </Route>
            <Route path="/profile" element={<Profile />} exact />
          </Routes>
        </Router>
      </AuthContextProvider>
    </div>
  );
}

export default App;
