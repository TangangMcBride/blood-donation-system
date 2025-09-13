import User from '../models/User.js';

export const findCompatibleDonors = async (bloodType, location, maxDistance = 50000, limit = 10) => {
  try {
    const query = {
      role: 'Donor',
      bloodType: bloodType,
      availability: true,
      isActive: true,
    };

    if (location && location.coordinates) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates,
          },
          $maxDistance: maxDistance,
        },
      };
    }

    const donors = await User.find(query)
      .select('name email phone bloodType location availability')
      .limit(limit);

    return donors;
  } catch (error) {
    console.error('Error in matching engine:', error.message);
    throw error;
  }
};