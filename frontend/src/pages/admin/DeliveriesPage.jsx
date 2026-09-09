import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar.jsx';
import { StatusPill } from '../../components/StatusPill.jsx';
import { Modal } from '../../components/Modal.jsx';
import { useData } from '../../context/DataContext.jsx';
import { Download, Search, Image as ImageIcon } from 'lucide-react';

export const DeliveriesPage = () => {
  const { deliveries, exportDeliveriesCSV, updateDeliveryStatus } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProofUrl, setViewingProofUrl] = useState(null);

  const filteredDeliveries = deliveries.filter((del) => {
    const matchesFilter =
      filter === 'All' || del.status.toLowerCase() === filter.toLowerCase().replace(' ', '_');
    const matchesSearch =
      del.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (del.driverName && del.driverName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-app-layout">
      <Sidebar />

      <main className="main-content-dashboard">
        <div className="topbar-dashboard">
          <div>
            <h1>Delivery Operations</h1>
            <div className="date-sub">Track real-time stop status, proof of delivery photos, and logs</div>
          </div>
          <div className="topbar-actions-dashboard">
            <button onClick={() => exportDeliveriesCSV(filter)} className="btn btn-white">
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        <div className="table-card-dashboard">
          <div className="table-head-dashboard" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3>Deliveries ({filteredDeliveries.length})</h3>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-2)' }} />
                <input
                  type="text"
                  placeholder="Search customer, route, driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '6px 12px 6px 30px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    fontSize: '13px',
                    width: '240px',
                  }}
                />
              </div>
            </div>

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
                <th>Stop #</th>
                <th>Customer &amp; Address</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Proof Photo</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((del) => (
                <tr key={del._id}>
                  <td className="code-dash">
                    <strong>{del.routeCode}</strong>
                  </td>
                  <td className="code-dash">Stop {del.sequenceOrder}</td>
                  <td>
                    <strong>{del.customerName}</strong>
                    <div className="addr-sub">{del.address}</div>
                    {del.notes && <div style={{ fontSize: '11.5px', color: 'var(--signal)', marginTop: '2px' }}>Note: {del.notes}</div>}
                  </td>
                  <td>{del.driverName || 'Unassigned'}</td>
                  <td>
                    <StatusPill status={del.status} />
                  </td>
                  <td>
                    {del.proofImageUrl ? (
                      <button
                        className="btn btn-white btn-sm"
                        onClick={() => setViewingProofUrl(del.proofImageUrl || null)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <ImageIcon size={13} /> View Photo
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>None</span>
                    )}
                  </td>
                  <td className="code-dash">{del.updatedAt || '—'}</td>
                  <td>
                    <select
                      value={del.status}
                      onChange={(e) => updateDeliveryStatus(del._id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                        fontSize: '12px',
                        background: '#fff',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-2)' }}>
                    No deliveries match the search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        isOpen={Boolean(viewingProofUrl)}
        onClose={() => setViewingProofUrl(null)}
        title="Proof of Delivery Image"
      >
        {viewingProofUrl && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={viewingProofUrl}
              alt="Proof of Delivery"
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '12px' }}
            />
            <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-2)' }}>
              Captured by driver at location drop-off.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
