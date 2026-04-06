import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from "./pages/home";
import AddEmployee from "./pages/add_employee";
import EditEmployee from "./pages/edit_employee";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/edit/:id" element={<EditEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
