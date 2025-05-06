import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Landing from "./pages/Landing/Landing";
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import Search from "./pages/Search/Search";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import { restoreSession } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<ProtectedRoute component={FavoritesPage} />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;