import { BrowserRouter,Routes,Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reels from "./pages/Reels";
import Upload from "./pages/upload";

function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Reels" element={<Reels/>}/>
            <Route path="/upload" element={<Upload/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default App;