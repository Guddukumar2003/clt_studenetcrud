import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import User from "./component/getuser/User.jsx";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Fixed: BrowserRouter (with 's')
import AddUser from "./component/adduser/AddUser.jsx";
import UpdateUser from "./component/updateuser/UpdateUser.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>  {/* Fixed: BrowserRouter */}
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/add" element={<AddUser/>} />
        <Route path="/update/:id" element={<UpdateUser/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;