import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusPill } from '../components/StatusPill.jsx';

export const LoginPage = () => {
  const [roleTab, setRoleTab] = useState('dispatcher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginAsDemoAdmin, loginAsDemoDriver } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email || (roleTab === 'dispatcher' ? 'maya.patel@fleetops.io' : 'aleks.novak@fleetops.io'), roleTab === 'dispatcher' ? 'admin' : 'driver');
    if (roleTab === 'dispatcher') {
      navigate('/admin/dashboard');
    } else {
      navigate('/driver');
    }
  };

  const handleDemoDispatcher = () => {
    loginAsDemoAdmin();
    navigate('/admin/dashboard');
  };

  const handleDemoDriver = () => {
    loginAsDemoDriver();
    navigate('/driver');
  };

  return (
    <div className="login-page-body">
      <div className="side-login">
        <Link to="/" className="brand-login">
          <span className="dot-login"></span>FleetOps
        </Link>
        <div className="side-quote-login">
          <p className="big-quote-login">
            "We stopped calling drivers to check status. It's just on the board now."
          </p>
          <div className="who-quote-login">— Dispatch lead, Harborway Logistics</div>
        </div>
        <div className="mini-board-login">
          <div className="mini-row-login">
            <span className="c-login">RT-142</span>
            <span>Maple &amp; 5th District</span>
            <StatusPill status="in_transit" isDark />
          </div>
          <div className="mini-row-login">
            <span className="c-login">RT-138</span>
            <span>Harbor Warehouse</span>
            <StatusPill status="delivered" isDark />
          </div>
          <div className="mini-row-login">
            <span className="c-login">RT-151</span>
            <span>Northside Retail</span>
            <StatusPill status="pending" isDark />
          </div>
        </div>
      </div>

      <div className="form-side-login">
        <div className="form-box-login">
          <h1>Welcome back</h1>
          <p className="sub-login">Log in to your dispatch board.</p>

          <div className="tabs-login">
            <button
              type="button"
              className={`tab-login ${roleTab === 'dispatcher' ? 'active' : ''}`}
              onClick={() => setRoleTab('dispatcher')}
            >
              Dispatcher
            </button>
            <button
              type="button"
              className={`tab-login ${roleTab === 'driver' ? 'active' : ''}`}
              onClick={() => setRoleTab('driver')}
            >
              Driver
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-login">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder={roleTab === 'dispatcher' ? 'maya.patel@fleetops.io' : 'aleks.novak@fleetops.io'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field-login">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="row-between-login">
              <label><input type="checkbox" defaultChecked /> Stay signed in</label>
              <a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <button type="submit" className="btn-full-login">
              Log in as {roleTab === 'dispatcher' ? 'Dispatcher' : 'Driver'}
            </button>
          </form>

          <div className="role-note-login">
            {roleTab === 'dispatcher'
              ? 'Logging in as a driver? Use the Driver tab above.'
              : 'Logging in as a dispatcher? Use the Dispatcher tab above.'}
          </div>

          <div className="foot-link-login">
            New to FleetOps? <a href="#create" onClick={(e) => e.preventDefault()}>Create an account</a>
          </div>

          <div className="demo-links-login">
            <button type="button" onClick={handleDemoDispatcher} className="demo-btn-login">
              Preview: Dashboard →
            </button>
            <button type="button" onClick={handleDemoDriver} className="demo-btn-login">
              Preview: Driver view →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
