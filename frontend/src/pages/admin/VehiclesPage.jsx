import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useData } from '../../context/DataContext.jsx';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const VehiclesPage = () => {
  const { vehicles, drivers, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState('van');
  const [capacityKg, setCapacityKg] = useState(1000);
  const [status, setStatus] = useState('available');
  const [assignedDriverId, setAssignedDriverId] = useState('');

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setPlateNumber('');
    setType('van');
    setCapacityKg(1000);
    setStatus('available');
    setAssignedDriverId('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (veh) => {
    setEditingVehicle(veh);
    setPlateNumber(veh.plateNumber);
    setType(veh.type);
    setCapacityKg(veh.capacityKg);
    setStatus(veh.status);
    setAssignedDriverId(veh.assignedDriverId || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const drvObj = drivers.find((d) => d._id === assignedDriverId);
    const drvName = drvObj ? drvObj.name : undefined;

    if (editingVehicle) {
      updateVehicle(editingVehicle._id, {
        plateNumber,
        type,
        capacityKg,
        status,
        assignedDriverId: assignedDriverId || undefined,
        assignedDriverName: drvName,
      });
    } else {
      addVehicle({
        plateNumber,
        type,
        capacityKg,
        status,
        assignedDriverId: assignedDriverId || undefined,
        assignedDriverName: drvName,
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
            <h1>Vehicles Management</h1>
            <div className="date-sub">Manage fleet assets, capacities, assigned drivers, and maintenance status</div>
          </div>
          <div className="topbar-actions-dashboard">
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Vehicle
            </button>
          </div>
        </div>

        <div className="table-card-dashboard">
          <div className="table-head-dashboard">
            <h3>All Vehicles ({vehicles.length})</h3>
          </div>
          <table className="table-dash">
            <thead>
              <tr>
                <th>License Plate</th>
                <th>Type</th>
                <th>Payload Capacity</th>
                <th>Assigned Driver</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((veh) => (
                <tr key={veh._id}>
                  <td className="code-dash">
                    <strong>{veh.plateNumber}</strong>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{veh.type}</td>
                  <td>{veh.capacityKg} kg</td>
                  <td>{veh.assignedDriverName || 'Unassigned'}</td>
                  <td>
                    <span className={`status-dash ${veh.status}`}>
                      {veh.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-white btn-sm"
                        onClick={() => handleOpenEditModal(veh)}
                        title="Edit Vehicle"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteVehicle(veh._id)}
                        title="Delete Vehicle"
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
        title={editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>License Plate Number</label>
            <input
              type="text"
              placeholder="e.g. VAN-9082"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-field">
              <label>Vehicle Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            <div className="form-field">
              <label>Capacity (kg)</label>
              <input
                type="number"
                value={capacityKg}
                onChange={(e) => setCapacityKg(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="form-field">
              <label>Assign Driver</label>
              <select value={assignedDriverId} onChange={(e) => setAssignedDriverId(e.target.value)}>
                <option value="">Unassigned</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
