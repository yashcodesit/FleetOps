import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useData } from '../../context/DataContext.jsx';
import { Plus, Trash2, Edit2, Phone, Mail } from 'lucide-react';

export const DriversPage = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [status, setStatus] = useState('active');

  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setName('');
    setEmail('');
    setPhone('');
    setVehiclePlate('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drv) => {
    setEditingDriver(drv);
    setName(drv.name);
    setEmail(drv.email);
    setPhone(drv.phone);
    setVehiclePlate(drv.assignedVehiclePlate || '');
    setStatus(drv.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDriver) {
      updateDriver(editingDriver._id, {
        name,
        email,
        phone,
        assignedVehiclePlate: vehiclePlate || undefined,
        status,
      });
    } else {
      addDriver({
        name,
        email,
        phone,
        assignedVehiclePlate: vehiclePlate || undefined,
        status,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-app-layout">
      <Sidebar />

      <main className="main-content-dashboard">
        <div className="topbar-dashboard">
          <div>
            <h1>Drivers Management</h1>
            <div className="date-sub">Manage driver accounts, contact info, and assigned vehicles</div>
          </div>
          <div className="topbar-actions-dashboard">
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Driver
            </button>
          </div>
        </div>

        <div className="table-card-dashboard">
          <div className="table-head-dashboard">
            <h3>All Drivers ({drivers.length})</h3>
          </div>
          <table className="table-dash">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Contact</th>
                <th>Assigned Vehicle</th>
                <th>Status</th>
                <th>Today's Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((drv) => (
                <tr key={drv._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="av-dash">{drv.name.split(' ').map((n) => n[0]).join('')}</div>
                      <strong>{drv.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
                      <div><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{drv.email}</div>
                      <div><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{drv.phone}</div>
                    </div>
                  </td>
                  <td className="code-dash">{drv.assignedVehiclePlate || 'Unassigned'}</td>
                  <td>
                    <span className={`status-dash ${drv.status}`}>
                      {drv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="code-dash">
                    {drv.completedStopsToday} / {drv.totalStopsToday || 5} stops
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-white btn-sm"
                        onClick={() => handleOpenEditModal(drv)}
                        title="Edit Driver"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteDriver(drv._id)}
                        title="Delete Driver"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver Details' : 'Add New Driver'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Aleks Novak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="aleks.novak@fleetops.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-field">
              <label>Assigned Vehicle Plate</label>
              <input
                type="text"
                placeholder="e.g. VAN-9082"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDriver ? 'Save Changes' : 'Add Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
