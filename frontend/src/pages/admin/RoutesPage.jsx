import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useData } from '../../context/DataContext.jsx';
import { StatusPill } from '../../components/StatusPill.jsx';
import { Plus } from 'lucide-react';

export const RoutesPage = () => {
  const { routes, drivers, vehicles, addRouteWithDeliveries } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [routeName, setRouteName] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('');
  const [stopsInput, setStopsInput] = useState('');

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!routeName || !selectedDriverId || !selectedVehiclePlate) return;

    const driverObj = drivers.find((d) => d._id === selectedDriverId);
    const driverName = driverObj ? driverObj.name : 'Unassigned';

    const stops = stopsInput
      .split('\n')
      .filter((s) => s.trim() !== '')
      .map((stopLine, idx) => {
        const parts = stopLine.split('-');
        return {
          customerName: parts[0]?.trim() || `Stop #${idx + 1}`,
          address: parts[1]?.trim() || stopLine.trim(),
          sequenceOrder: idx + 1,
        };
      });

    const fallbackStops = stops.length > 0 ? stops : [
      { customerName: 'Main Depot Stop', address: '100 Logistics Blvd', sequenceOrder: 1 }
    ];

    addRouteWithDeliveries(
      {
        name: routeName,
        driverId: selectedDriverId,
        driverName: driverName,
        vehiclePlate: selectedVehiclePlate,
        status: 'planned',
        scheduledDate: new Date().toISOString().slice(0, 10),
      },
      fallbackStops
    );

    setRouteName('');
    setSelectedDriverId('');
    setSelectedVehiclePlate('');
    setStopsInput('');
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-app-layout">
      <Sidebar />

      <main className="main-content-dashboard">
        <div className="topbar-dashboard">
          <div>
            <h1>Dispatch Routes</h1>
            <div className="date-sub">Manage active delivery routes, vehicle assignments, and stop sequencing</div>
          </div>
          <div className="topbar-actions-dashboard">
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create Route
            </button>
          </div>
        </div>

        <div className="table-card-dashboard">
          <div className="table-head-dashboard">
            <h3>All Routes ({routes.length})</h3>
          </div>
          <table className="table-dash">
            <thead>
              <tr>
                <th>Route Code</th>
                <th>Route Name</th>
                <th>Assigned Driver</th>
                <th>Vehicle Plate</th>
                <th>Scheduled Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((rt) => (
                <tr key={rt._id}>
                  <td className="code-dash">
                    <strong>{rt.code}</strong>
                  </td>
                  <td>{rt.name}</td>
                  <td>{rt.driverName}</td>
                  <td className="code-dash">{rt.vehiclePlate}</td>
                  <td>{rt.scheduledDate}</td>
                  <td>
                    <StatusPill status={rt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Dispatch Route">
        <form onSubmit={handleCreateRoute}>
          <div className="form-field">
            <label>Route Name</label>
            <input
              type="text"
              placeholder="e.g. Harbor &amp; Downtown Morning Route"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-field">
              <label>Assign Driver</label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Assign Vehicle</label>
              <select
                value={selectedVehiclePlate}
                onChange={(e) => setSelectedVehiclePlate(e.target.value)}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v.plateNumber}>
                    {v.plateNumber} ({v.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <label>Delivery Stops (Format per line: Customer - Address)</label>
            <textarea
              rows={4}
              placeholder="Fairview Apartments - 118 Fairview Rd&#10;Oakview Clinic - 44 Oakview Ave"
              value={stopsInput}
              onChange={(e) => setStopsInput(e.target.value)}
            ></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create &amp; Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
