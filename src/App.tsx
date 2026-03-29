import { useState } from 'react';
import './App.css';
import BookingForm from './components/BookingForm';
import StatusCheck from './components/StatusCheck';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

type View = 'home' | 'booking' | 'status' | 'admin' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
  };

  const renderView = () => {
    if (currentView === 'dashboard' && isAdminAuthenticated) {
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }

    if (currentView === 'admin') {
      return <AdminLogin onLoginSuccess={handleAdminLogin} />;
    }

    return (
      <>
        <header className="header">
          <div className="header-content">
            <h1 className="logo">MindCare</h1>
            <nav className="nav">
              <button
                className={currentView === 'home' ? 'active' : ''}
                onClick={() => setCurrentView('home')}
              >
                Home
              </button>
              <button
                className={currentView === 'booking' ? 'active' : ''}
                onClick={() => setCurrentView('booking')}
              >
                Book Appointment
              </button>
              <button
                className={currentView === 'status' ? 'active' : ''}
                onClick={() => setCurrentView('status')}
              >
                Check Status
              </button>
              <button
                className="admin-link"
                onClick={() => setCurrentView('admin')}
              >
                Admin
              </button>
            </nav>
          </div>
        </header>

        <main className="main-content">
          {currentView === 'home' && (
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">Your Mental Wellness Journey Starts Here</h1>
                <p className="hero-description">
                  Professional psychology support for mental health, emotional well-being, stress relief, and depression guidance.
                  We're here to listen, support, and guide you towards a healthier, happier life.
                </p>
                <div className="hero-buttons">
                  <button
                    className="primary-btn"
                    onClick={() => setCurrentView('booking')}
                  >
                    Book an Appointment
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => setCurrentView('status')}
                  >
                    Check Status
                  </button>
                </div>
              </div>
              <div className="features">
                <div className="feature-card">
                  <div className="feature-icon">💚</div>
                  <h3>Mental Health Support</h3>
                  <p>Professional guidance for your mental wellness journey</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🤝</div>
                  <h3>Emotional Support</h3>
                  <p>Compassionate care when you need it most</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🧘</div>
                  <h3>Stress Relief</h3>
                  <p>Techniques and support to manage daily stress</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌟</div>
                  <h3>Depression Guidance</h3>
                  <p>Expert support for overcoming depression</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'booking' && <BookingForm />}
          {currentView === 'status' && <StatusCheck />}
        </main>

        <footer className="footer">
          <p>© 2026 MindCare - Your partner in mental wellness</p>
        </footer>
      </>
    );
  };

  return <div className="app">{renderView()}</div>;
}

export default App;
