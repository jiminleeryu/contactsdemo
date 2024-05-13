import "../styles/App.css";
import AuthRoute from "./auth/AuthRoute"
import Home from "./Home"

function App() {
  return (
    <div>
      <div className="header-container">
      <h1>Contacts List</h1>
      </div>
      <AuthRoute gatedContent={<Home/>}/>
    </div>
  );
}

export default App;