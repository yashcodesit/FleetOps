import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { StatusPill } from '../../components/StatusPill.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Camera, Clock, User, Calendar } from 'lucide-react';

export const DriverViewPage = () => {
  const { user } = useAuth();
  const { deliveries, updateDeliveryStatus } = useData();

  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [simulatedPhotoUrl, setSimulatedPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
  );
  const [issueNote, setIssueNote] = useState('');

  const driverDeliveries = deliveries.filter((d) => d.driverId === 'drv_1' || d.routeCode === 'RT-142');

  const pendingOrTransit = driverDeliveries.filter((d) => d.status === 'pending' || d.status === 'in_transit');
  const completedDeliveries = driverDeliveries.filter((d) => d.status === 'delivered');
  const failedDeliveries = driverDeliveries.filter((d) => d.status === 'failed');

  const totalStops = driverDeliveries.length || 5;
  const completedCount = completedDeliveries.length;
  const progressPercent = Math.round((completedCount / totalStops) * 100);

  const currentStop = pendingOrTransit[0] || null;
  const upcomingStops = pendingOrTransit.slice(1);

  const handleOpenMarkDelivered = (deliveryId) => {
    setSelectedDeliveryId(deliveryId);
    setIsProofModalOpen(true);
  };

  const handleOpenReportIssue = (deliveryId) => {
    setSelectedDeliveryId(deliveryId);
    setIssueNote('');
    setIsIssueModalOpen(true);
  };

  const handleConfirmDelivered = (e) => {
    e.preventDefault();
    if (selectedDeliveryId) {
      updateDeliveryStatus(selectedDeliveryId, 'delivered', simulatedPhotoUrl);
    }
    setIsProofModalOpen(false);
    setSelectedDeliveryId(null);
  };

  const handleConfirmIssue = (e) => {
    e.preventDefault();
    if (selectedDeliveryId) {
      updateDeliveryStatus(selectedDeliveryId, 'failed');
    }
    setIsIssueModalOpen(false);
    setSelectedDeliveryId(null);
  };

  return (
    <div className="driver-viewport-container">
      <div className="phone-wrapper-driver">
        <div className="top-header-driver">
          <div className="top-row-driver">
            <div className="brand-driver">
              <span className="dot-driver"></span>FleetOps
            </div>
            <Link to="/" className="back-link-driver">
              Exit driver view
            </Link>
          </div>
          <div className="greeting-driver">Hey, {user?.name.split(' ')[0] || 'Aleks'} 👋</div>
          <div className="sub-driver">Route RT-142 · {totalStops} stops today</div>
          <div className="progress-wrap-driver">
            <div className="progress-labels-driver">
              <span>{completedCount} of {totalStops} delivered</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar-driver">
              <div className="progress-fill-driver" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="content-driver">
          <div className="section-title-driver">Up next</div>

          {currentStop ? (
            <div className="stop-card-driver current">
              <div className="stop-top-driver">
                <div className="seq-driver">{currentStop.sequenceOrder}</div>
                <div className="stop-info-driver">
                  <div className="name-driver">{currentStop.customerName}</div>
                  <div className="addr-driver">{currentStop.address}</div>
                </div>
                <StatusPill status={currentStop.status} />
              </div>
              <div className="stop-meta-driver">
                <span>📍 {currentStop.distanceMiles || 0.4} mi away</span>
                <span>🕐 Window: {currentStop.timeWindow || '1:00–2:00 PM'}</span>
              </div>
              <div className="stop-actions-driver">
                <button
                  className="mini-btn-driver ghost"
                  onClick={() => handleOpenReportIssue(currentStop._id)}
                >
                  Report issue
                </button>
                <button
                  className="mini-btn-driver primary"
                  onClick={() => handleOpenMarkDelivered(currentStop._id)}
                >
                  Mark delivered
                </button>
              </div>
            </div>
          ) : (
            <div className="stop-card-driver" style={{ textAlign: 'center', padding: '24px' }}>
              <h3>All stops completed! 🎉</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>
                You have finished all assigned delivery stops for Route RT-142.
              </p>
            </div>
          )}

          {upcomingStops.map((stop) => (
            <div key={stop._id} className="stop-card-driver">
              <div className="stop-top-driver">
                <div className="seq-driver">{stop.sequenceOrder}</div>
                <div className="stop-info-driver">
                  <div className="name-driver">{stop.customerName}</div>
                  <div className="addr-driver">{stop.address}</div>
                </div>
                <StatusPill status={stop.status} />
              </div>
              <div className="stop-meta-driver">
                <span>📍 {stop.distanceMiles || 1.2} mi away</span>
                <span>🕐 Window: {stop.timeWindow || '2:00–3:00 PM'}</span>
              </div>
            </div>
          ))}

          <div className="section-title-driver">Completed today ({completedCount})</div>
          <div className="stop-card-driver" style={{ padding: '6px 16px' }}>
            {completedDeliveries.map((d) => (
              <div key={d._id} className="done-row-driver">
                <div className="check-driver">✓</div>
                <div className="name-driver">{d.customerName}</div>
                <div className="time-driver">{d.deliveredAt || '09:41 AM'}</div>
              </div>
            ))}
            {failedDeliveries.map((d) => (
              <div key={d._id} className="done-row-driver" style={{ opacity: 0.8 }}>
                <div className="check-driver" style={{ background: 'rgba(229,72,77,0.15)', color: 'var(--alert)' }}>✕</div>
                <div className="name-driver" style={{ color: 'var(--alert)' }}>{d.customerName} (Failed)</div>
                <div className="time-driver">{d.updatedAt || '11:52 AM'}</div>
              </div>
            ))}
            {completedDeliveries.length === 0 && failedDeliveries.length === 0 && (
              <div style={{ fontSize: '12.5px', color: 'var(--text-2)', padding: '10px 0' }}>
                No stops completed yet today.
              </div>
            )}
          </div>
        </div>

        <div className="bottom-nav-driver">
          <a href="#" className="active" onClick={(e) => e.preventDefault()}>
            <Calendar size={18} />
            Today
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Clock size={18} />
            History
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <User size={18} />
            Profile
          </a>
        </div>
      </div>

      {/* MARK DELIVERED & UPLOAD PROOF MODAL */}
      <Modal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        title="Proof of Delivery Upload"
      >
        <form onSubmit={handleConfirmDelivered}>
          <p style={{ fontSize: '13.5px', color: 'var(--text-2)', marginBottom: '16px' }}>
            Please attach or snap a photo of the package at the drop-off location as proof of delivery.
          </p>

          <div
            style={{
              border: '2px dashed var(--line)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '16px',
              background: '#F9FAFB',
            }}
          >
            <img
              src={simulatedPhotoUrl}
              alt="Dropoff Preview"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-white btn-sm"
                onClick={() =>
                  setSimulatedPhotoUrl(
                    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'
                  )
                }
              >
                <Camera size={14} /> Snap Photo
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsProofModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-signal">
              Confirm &amp; Complete Stop
            </button>
          </div>
        </form>
      </Modal>

      {/* REPORT ISSUE MODAL */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Report Delivery Issue"
      >
        <form onSubmit={handleConfirmIssue}>
          <div className="form-field">
            <label>Reason for Failed Delivery</label>
            <select required>
              <option value="customer_unavailable">Customer unavailable</option>
              <option value="access_denied">Gate / Door code failed</option>
              <option value="wrong_address">Incorrect address</option>
              <option value="package_damaged">Package damaged</option>
            </select>
          </div>
          <div className="form-field">
            <label>Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Provide context for dispatch..."
              value={issueNote}
              onChange={(e) => setIssueNote(e.target.value)}
            ></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Mark as Failed
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
