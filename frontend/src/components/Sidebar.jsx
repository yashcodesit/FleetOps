import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutDashboard, MapPin, Truck, Users, Car, BarChart3, Clock, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar-app">
      <NavLink to="/admin/dashboard" className="brand-sidebar">
        <span className="dot"></span>FleetOps
      </NavLink>

      <div className="nav-group">
        <div className="nav-label">Operations</div>
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={16} className="ic-icon" /> Dashboard
        </NavLink>
        <NavLink to="/admin/routes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MapPin size={16} className="ic-icon" /> Routes
        </NavLink>
        <NavLink to="/admin/deliveries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Truck size={16} className="ic-icon" /> Deliveries
        </NavLink>
      </div>

      <div className="nav-group">
        <div className="nav-label">Fleet</div>
        <NavLink to="/admin/drivers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={16} className="ic-icon" /> Drivers
        </NavLink>
        <NavLink to="/admin/vehicles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Car size={16} className="ic-icon" /> Vehicles
        </NavLink>
      </div>

      <div className="nav-group">
        <div className="nav-label">Reports</div>
        <NavLink to="/admin/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 size={16} className="ic-icon" /> Analytics
        </NavLink>
        <NavLink to="/admin/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Clock size={16} className="ic-icon" /> Activity log
        </NavLink>
      </div>

      <div className="sidebar-foot">
        <div className="avatar">{getInitials(user?.name)}</div>
        <div className="who">
          <div className="name">{user?.name || 'Maya Patel'}</div>
          <div className="role">{user?.role === 'admin' ? 'Dispatcher' : 'Driver'}</div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
