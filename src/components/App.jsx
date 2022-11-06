import AppShell from "./AppShell";
import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom';
import Home from "./Home";
import Texts from "./Texts";
import Words from "./Words";

function App() {
  return (
    <>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" exact={true} element={ <Home /> } />
            <Route path="/texts" element={<Texts />} />
            <Route path="/words" element={<Words />} />
          </Routes>
        </AppShell>
      </Router>
    </>
  );
}

export default App;
