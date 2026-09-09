import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { StatusPill } from '../../components/StatusPill.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { Link } from 'react-router-dom';
import { Plus, Download, ArrowUpRight } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { deliveries, drivers, vehicles, addRouteWithDeliveries, exportDeliveriesCSV } = useData();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Route Form State
  const [routeName, setRouteName] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('');
  const [stopsInput, setStopsInput] = useState('');

  const activeDriversCount = drivers.filter((d) => d.status === 'active').length;
  const totalDeliveries = deliveries.length;
  const deliveredCount = deliveries.filter((d) => d.status === 'delivered').length;
  const completionRate = totalDeliveries > 0 ? Math.round((deliveredCount / totalDeliveries) * 100) : 0;
  const failedStopsCount = deliveries.filter((d) => d.status === 'failed').length;

  const filteredDeliveries = filter === 'All'
    ? deliveries
    : deliveries.filter((d) => d.status.toLowerCase() === filter.toLowerCase().replace(' ', '_'));

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
            <h1>Good morning, {user?.name.split(' ')[0] || 'Maya'}</h1>
            <div className="date-sub">
              Wednesday, September 9 · {activeDriversCount} drivers active
            </div>
          </div>
          <div className="topbar-actions-dashboard">
            <button onClick={() => exportDeliveriesCSV(filter)} className="btn btn-white" title="Export CSV">
              <Download size={15} /> Export CSV
            </button>
            <Link to="/driver" className="btn btn-white">
              Driver view <ArrowUpRight size={14} />
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create route
            </button>
          </div>
        </div>

        <div className="stats-grid-dashboard">
          <div className="stat-card-dash">
            <div className="k">Deliveries today</div>
            <div className="v">{totalDeliveries}</div>
          </div>
          <div className="stat-card-dash">
            <div className="k">Completion rate</div>
            <div className="v">
              {completionRate}%<span className="delta up">▲ 3%</span>
            </div>
          </div>
          <div className="stat-card-dash">
            <div className="k">Active drivers</div>
            <div className="v">{activeDriversCount}</div>
          </div>
          <div className="stat-card-dash">
            <div className="k">Delayed / Failed stops</div>
            <div className="v">
              {failedStopsCount}<span className="delta down">▲ 1</span>
            </div>
          </div>
        </div>

        <div className="grid-2-dashboard">
          <div className="card-dashboard">
            <div className="card-head-dashboard">
              <h3>Deliveries this week</h3>
              <div className="legend-dashboard">
                <span><span className="sw-legend" style={{ background: 'var(--transit)' }}></span>Delivered</span>
                <span><span className="sw-legend" style={{ background: 'var(--signal)' }}></span>In transit</span>
                <span><span className="sw-legend" style={{ background: 'var(--alert)' }}></span>Failed</span>
              </div>
            </div>
            <div className="bars-dashboard">
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '110px' }}><div className="bar-seg delivered" style={{ height: '70px' }}></div><div className="bar-seg transit" style={{ height: '28px' }}></div><div className="bar-seg failed" style={{ height: '12px' }}></div></div><div className="bar-label">MON</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '132px' }}><div className="bar-seg delivered" style={{ height: '90px' }}></div><div className="bar-seg transit" style={{ height: '32px' }}></div><div className="bar-seg failed" style={{ height: '10px' }}></div></div><div className="bar-label">TUE</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '96px' }}><div className="bar-seg delivered" style={{ height: '60px' }}></div><div className="bar-seg transit" style={{ height: '26px' }}></div><div className="bar-seg failed" style={{ height: '10px' }}></div></div><div className="bar-label">WED</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '150px' }}><div className="bar-seg delivered" style={{ height: '108px' }}></div><div className="bar-seg transit" style={{ height: '30px' }}></div><div className="bar-seg failed" style={{ height: '12px' }}></div></div><div className="bar-label">THU</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '120px' }}><div className="bar-seg delivered" style={{ height: '82px' }}></div><div className="bar-seg transit" style={{ height: '28px' }}></div><div className="bar-seg failed" style={{ height: '10px' }}></div></div><div className="bar-label">FRI</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '70px' }}><div className="bar-seg delivered" style={{ height: '48px' }}></div><div className="bar-seg transit" style={{ height: '14px' }}></div><div className="bar-seg failed" style={{ height: '8px' }}></div></div><div className="bar-label">SAT</div></div>
              <div className="bar-col-dash"><div className="bar-stack-dash" style={{ height: '40px' }}><div className="bar-seg delivered" style={{ height: '28px' }}></div><div className="bar-seg transit" style={{ height: '8px' }}></div><div className="bar-seg failed" style={{ height: '4px' }}></div></div><div className="bar-label">SUN</div></div>
            </div>
          </div>

          <div className="card-dashboard">
            <div className="card-head-dashboard">
              <h3>Drivers on shift</h3>
            </div>
            <div className="drv-list-dashboard">
              {drivers.map((drv) => {
                const initials = drv.name.split(' ').map((n) => n[0]).join('');
                return (
                  <div key={drv._id} className="drv-row-dashboard">
                    <div className="av-dash">{initials}</div>
                    <div className="info-dash">
                      <div className="name-dash">{drv.name}</div>
                      <div className="sub-dash">
                        {drv.currentRouteCode || 'No route'} · {drv.completedStopsToday}/{drv.totalStopsToday || 5} stops
                      </div>
                    </div>
                    <div className={`status-dash ${drv.status}`}>
                      {drv.status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="table-card-dashboard">
          <div className="table-head-dashboard">
            <h3>Deliveries</h3>
            <div className="table-tools-dashboard">
              {['All', 'Pending', 'In transit', 'Delivered', 'Failed'].map((tab) => (
                <span
                  key={tab}
                  className={`filter-pill-dash ${filter === tab ? 'active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
          <table className="table-dash">
            <thead>
              <tr>
                <th>Route</th>
                <th>Customer / Location</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((del) => (
                <tr key={del._id}>
                  <td className="code-dash">{del.routeCode}</td>
                  <td className="customer-cell">
                    <strong>{del.customerName}</strong>
                    <div className="addr-sub">{del.address}</div>
                  </td>
                  <td>{del.driverName || 'Unassigned'}</td>
                  <td>
                    <StatusPill status={del.status} />
                  </td>
                  <td className="code-dash">{del.updatedAt || '—'}</td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
                    No deliveries match the selected filter.
                  </td>
                </tr>
              )}
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
              placeholder="e.g. Downtown Morning Route"
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
                    {d.name} ({d.status})
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
            <label>Delivery Stops (One per line, Format: Customer - Address)</label>
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
