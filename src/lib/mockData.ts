export const mockStats = {
    totalMailboxes: 1250,
    activeUsers: 842,
    storageUsed: 65, // percentage
    trafficData: [
        { day: 'Mon', sent: 450, received: 600 },
        { day: 'Tue', sent: 520, received: 700 },
        { day: 'Wed', sent: 480, received: 650 },
        { day: 'Thu', sent: 610, received: 800 },
        { day: 'Fri', sent: 580, received: 750 },
        { day: 'Sat', sent: 300, received: 400 },
        { day: 'Sun', sent: 200, received: 300 },
    ]
};

export const mockMailboxes = [
    { id: '1', email: 'admin@ksamail.com', domain: 'ksamail.com', quota: '5GB', used: '1.2GB', status: 'active', lastLogin: '10 mins ago' },
    { id: '2', email: 'info@ksamail.com', domain: 'ksamail.com', quota: '2GB', used: '1.8GB', status: 'active', lastLogin: '2 hours ago' },
    { id: '3', email: 'support@ksamail.com', domain: 'ksamail.com', quota: '10GB', used: '0.4GB', status: 'active', lastLogin: 'Yesterday' },
    { id: '4', email: 'test@ksamail.com', domain: 'ksamail.com', quota: '1GB', used: '0.9GB', status: 'suspended', lastLogin: '1 week ago' },
];

export const mockLogs = [
    { id: '1', type: 'LOGIN', user: 'admin@google.com', ip: '192.168.1.1', time: '2026-03-03 12:45:01', status: 'success' },
    { id: '2', type: 'AUTH', user: 'info@apple.com', ip: '10.0.0.42', time: '2026-03-03 12:44:22', status: 'failed' },
    { id: '3', type: 'ADMIN', user: 'superadmin', ip: '127.0.0.1', time: '2026-03-03 12:40:00', status: 'success', action: 'Created Domain amazon.sa' },
];
