export const logSecurityEvent = (eventType, userId, message, ipAddress) => {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} | Event: ${eventType} | User: ${userId || 'Unknown'} | IP: ${ipAddress} | ${message}`);
};
