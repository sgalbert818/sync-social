import './App.css';
import React from "react"
import Calendar from "./components/Calendar"
import Focus from "./components/Focus"
import Login from "./components/Login"
import User from "./components/User"
import { AuthContext } from "./AuthContext"

function App() {

  const { auth } = React.useContext(AuthContext);

  return (
    <div>
      {!auth && <Login></Login>}
      {auth && <div>
        <div className="App">
          <User></User>
          <div className="app-body">
            <Calendar></Calendar>
            <Focus></Focus>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
