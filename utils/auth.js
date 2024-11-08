export function generateToken(userId) {
  return Buffer.from(`${userId}-${Date.now()}`).toString('base64');
}

export function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const userId = decoded.split('-')[0];
    return userId;
  } catch (error) {
    return null;
  }
}