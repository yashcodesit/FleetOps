import React, { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_DRIVERS = [
  { _id: 'drv_1', name: 'Aleks Novak', email: 'aleks.novak@fleetops.io', phone: '+1 (555) 234-5678', assignedVehiclePlate: 'VAN-9082', status: 'active', currentRouteCode: 'RT-142', completedStopsToday: 2, totalStopsToday: 5 },
  { _id: 'drv_2', name: 'Ramon Ibarra', email: 'ramon.ibarra@fleetops.io', phone: '+1 (555) 345-6789', assignedVehiclePlate: 'TRK-4102', status: 'active', currentRouteCode: 'RT-138', completedStopsToday: 4, totalStopsToday: 4 },
  { _id: 'drv_3', name: 'Joseph Okafor', email: 'joseph.okafor@fleetops.io', phone: '+1 (555) 456-7890', assignedVehiclePlate: 'VAN-3319', status: 'inactive', currentRouteCode: 'RT-151', completedStopsToday: 0, totalStopsToday: 3 },
  { _id: 'drv_4', name: 'Soo-Jin Kim', email: 'soojin.kim@fleetops.io', phone: '+1 (555) 567-8901', assignedVehiclePlate: 'CAR-1120', status: 'active', currentRouteCode: 'RT-146', completedStopsToday: 3, totalStopsToday: 8 },
];

const INITIAL_VEHICLES = [
  { _id: 'veh_1', plateNumber: 'VAN-9082', type: 'van', capacityKg: 1200, status: 'in_use', assignedDriverName: 'Aleks Novak', assignedDriverId: 'drv_1' },
  { _id: 'veh_2', plateNumber: 'TRK-4102', type: 'truck', capacityKg: 3500, status: 'in_use', assignedDriverName: 'Ramon Ibarra', assignedDriverId: 'drv_2' },
  { _id: 'veh_3', plateNumber: 'VAN-3319', type: 'van', capacityKg: 1000, status: 'available', assignedDriverName: 'Joseph Okafor', assignedDriverId: 'drv_3' },
  { _id: 'veh_4', plateNumber: 'CAR-1120', type: 'car', capacityKg: 400, status: 'in_use', assignedDriverName: 'Soo-Jin Kim', assignedDriverId: 'drv_4' },
  { _id: 'veh_5', plateNumber: 'BKE-004', type: 'bike', capacityKg: 50, status: 'maintenance' },
];

const INITIAL_ROUTES = [
  { _id: 'rt_1', code: 'RT-142', name: 'Maple & 5th District', driverId: 'drv_1', driverName: 'A. Novak', vehiclePlate: 'VAN-9082', status: 'active', scheduledDate: '2026-09-09', etaText: 'ETA 12m' },
  { _id: 'rt_2', code: 'RT-138', name: 'Harbor Warehouse', driverId: 'drv_2', driverName: 'R. Ibarra', vehiclePlate: 'TRK-4102', status: 'completed', scheduledDate: '2026-09-09', etaText: '09:41 AM' },
  { _id: 'rt_3', code: 'RT-151', name: 'Northside Retail', driverId: 'drv_3', driverName: 'J. Okafor', vehiclePlate: 'VAN-3319', status: 'planned', scheduledDate: '2026-09-09', etaText: 'Dispatch 2:00' },
  { _id: 'rt_4', code: 'RT-149', name: 'Unit 4, Riverside', driverId: 'drv_1', driverName: 'A. Novak', vehiclePlate: 'VAN-9082', status: 'active', scheduledDate: '2026-09-09', etaText: 'Retry queued' },
  { _id: 'rt_5', code: 'RT-146', name: 'Fairview Apartments', driverId: 'drv_4', driverName: 'S. Kim', vehiclePlate: 'CAR-1120', status: 'active', scheduledDate: '2026-09-09', etaText: 'ETA 25m' },
  { _id: 'rt_6', code: 'RT-144', name: 'Oakview Clinic', driverId: 'drv_4', driverName: 'S. Kim', vehiclePlate: 'CAR-1120', status: 'completed', scheduledDate: '2026-09-09', etaText: '10:15 AM' },
];

const INITIAL_DELIVERIES = [
  { _id: 'del_1', routeCode: 'RT-142', customerName: 'Maple & 5th District', address: '501 Maple St, Suite 300', driverId: 'drv_1', driverName: 'A. Novak', status: 'in_transit', sequenceOrder: 1, distanceMiles: 0.4, timeWindow: '12:00-1:00 PM', updatedAt: '12:04 PM' },
  { _id: 'del_2', routeCode: 'RT-138', customerName: 'Harbor Warehouse', address: '88 Pier Terminal Blvd', driverId: 'drv_2', driverName: 'R. Ibarra', status: 'delivered', sequenceOrder: 1, deliveredAt: '09:41 AM', updatedAt: '09:41 AM', proofImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
  { _id: 'del_3', routeCode: 'RT-151', customerName: 'Northside Retail', address: '1200 Northside Pkwy', driverId: 'drv_3', driverName: 'J. Okafor', status: 'pending', sequenceOrder: 1, timeWindow: '2:00-3:00 PM', updatedAt: '—' },
  { _id: 'del_4', routeCode: 'RT-149', customerName: 'Unit 4, Riverside', address: '9 Riverside Ct, Gate 4471', driverId: 'drv_1', driverName: 'A. Novak', status: 'failed', sequenceOrder: 2, notes: 'Customer unavailable at location', updatedAt: '11:52 AM' },
  { _id: 'del_5', routeCode: 'RT-146', customerName: 'Fairview Apartments', address: '118 Fairview Rd, Unit 4B', driverId: 'drv_4', driverName: 'S. Kim', status: 'in_transit', sequenceOrder: 3, distanceMiles: 0.4, timeWindow: '1:00-2:00 PM', updatedAt: '12:10 PM', notes: 'Leave with front desk if no answer' },
  { _id: 'del_6', routeCode: 'RT-144', customerName: 'Oakview Clinic', address: '44 Oakview Ave', driverId: 'drv_4', driverName: 'S. Kim', status: 'delivered', sequenceOrder: 2, deliveredAt: '10:15 AM', updatedAt: '10:15 AM', proofImageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80' },
];

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('fleetops_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('fleetops_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem('fleetops_routes');
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('fleetops_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  useEffect(() => {
    localStorage.setItem('fleetops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('fleetops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('fleetops_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('fleetops_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // Drivers CRUD
  const addDriver = (driverData) => {
    const newDrv = {
      ...driverData,
      _id: `drv_${Date.now()}`,
      completedStopsToday: 0,
      totalStopsToday: 0,
    };
    setDrivers((prev) => [newDrv, ...prev]);
  };

  const updateDriver = (id, updates) => {
    setDrivers((prev) => prev.map((d) => (d._id === id ? { ...d, ...updates } : d)));
  };

  const deleteDriver = (id) => {
    setDrivers((prev) => prev.filter((d) => d._id !== id));
  };

  // Vehicles CRUD
  const addVehicle = (vehicleData) => {
    const newVeh = {
      ...vehicleData,
      _id: `veh_${Date.now()}`,
    };
    setVehicles((prev) => [newVeh, ...prev]);
  };

  const updateVehicle = (id, updates) => {
    setVehicles((prev) => prev.map((v) => (v._id === id ? { ...v, ...updates } : v)));
  };

  const deleteVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  // Route & Delivery Creation
  const addRouteWithDeliveries = (routeData, deliveriesList) => {
    const routeCode = `RT-${Math.floor(100 + Math.random() * 900)}`;
    const newRoute = {
      ...routeData,
      _id: `rt_${Date.now()}`,
      code: routeCode,
      status: 'planned',
    };

    const createdDeliveries = deliveriesList.map((del, idx) => ({
      ...del,
      _id: `del_${Date.now()}_${idx}`,
      routeCode: routeCode,
      driverId: routeData.driverId,
      driverName: routeData.driverName,
      status: 'pending',
      sequenceOrder: idx + 1,
      updatedAt: '—',
    }));

    setRoutes((prev) => [newRoute, ...prev]);
    setDeliveries((prev) => [...createdDeliveries, ...prev]);
  };

  // Delivery status update
  const updateDeliveryStatus = (deliveryId, status, proofUrl) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDeliveries((prev) =>
      prev.map((del) => {
        if (del._id === deliveryId) {
          return {
            ...del,
            status,
            proofImageUrl: proofUrl || del.proofImageUrl,
            updatedAt: nowStr,
            deliveredAt: status === 'delivered' ? nowStr : del.deliveredAt,
          };
        }
        return del;
      })
    );
  };

  // Export CSV
  const exportDeliveriesCSV = (filteredStatus) => {
    const target = filteredStatus && filteredStatus !== 'All'
      ? deliveries.filter((d) => d.status.toLowerCase() === filteredStatus.toLowerCase())
      : deliveries;

    const headers = ['Delivery ID', 'Route Code', 'Customer', 'Address', 'Driver', 'Status', 'Updated At'];
    const rows = target.map((d) => [
      d._id,
      d.routeCode,
      `"${d.customerName.replace(/"/g, '""')}"`,
      `"${d.address.replace(/"/g, '""')}"`,
      `"${(d.driverName || 'Unassigned').replace(/"/g, '""')}"`,
      d.status.toUpperCase(),
      d.updatedAt || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fleetops_deliveries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        drivers,
        vehicles,
        routes,
        deliveries,
        addDriver,
        updateDriver,
        deleteDriver,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addRouteWithDeliveries,
        updateDeliveryStatus,
        exportDeliveriesCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
