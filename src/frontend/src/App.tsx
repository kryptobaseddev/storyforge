import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/theme-provider';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/auth/login';
import CreateProject from './pages/projects/create';
import './index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="storyforge-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/projects/create" element={<CreateProject />} />
          {/* Add more routes as they are developed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
