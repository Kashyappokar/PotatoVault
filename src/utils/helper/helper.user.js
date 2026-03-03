import { User } from '../../models/user.model.js';
import logger from '../../utils/logger.js';

export async function generateFarmerCode(farmerName) {
  if (!farmerName) {
    logger.error('Farmer name is required for code generation');
    throw new Error('Farmer name is required');
  }

  const initial = farmerName.trim().charAt(0).toUpperCase();

  // Get last inserted user sorted by farmerCode descending
  const lastFarmer = await User.findOne().sort({ createdAt: -1 }).lean();
  let nextNumber = 1;

  if (lastFarmer && lastFarmer.farmerCode) {
    const numberPart = parseInt(lastFarmer.farmerCode.slice(1));
    nextNumber = numberPart + 1;
  }

  const farmerCode = `${initial}${String(nextNumber).padStart(4, '0')}`;

  return farmerCode;
}
