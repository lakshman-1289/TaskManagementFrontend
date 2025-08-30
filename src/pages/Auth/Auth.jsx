import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import './Auth.css';

function Auth() {
  const [isRegister, setIsRegister] = useState(false);

  const togglePanel = () => {
    setIsRegister(prev => !prev);
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-box ${isRegister ? "active" : ""}`}>

        {/* Left side */}
        <div className="left-side">
          <div className="form-container">
            <SignInForm togglePanel={togglePanel} />
          </div>
          <div className="cover-container">
            <div className="cover">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60" alt="Background" />
              <div className="text">
                <span className="text-1">Get Started Today</span><br></br>
                <span className="text-2">Create your account and manage tasks smarter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="right-side">
          <div className="form-container">
            <SignUpForm togglePanel={togglePanel} setIsRegister={setIsRegister} />
          </div>
          <div className="cover-container">
            <div className="cover">
              <img src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_1280.jpg" alt="Background" />
              <div className="text">
                <span className="text-1">Focus. Organize. Achieve.</span><br></br>
                <span className="text-2">Log in to manage your tasks</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;