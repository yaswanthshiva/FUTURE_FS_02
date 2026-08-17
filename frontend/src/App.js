import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default page → Login */}
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

export default App;