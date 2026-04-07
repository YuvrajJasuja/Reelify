import { BrowserRouter,Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reels from "./pages/Reels";

function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Reels" element={<Reels/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default App;