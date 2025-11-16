import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInForm from './component/SignInForm';
import SignUpForm from './component/SignUpForm';
import Home from './component/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
