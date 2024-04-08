import moment from 'moment';
import { IBooking } from '../api/bookings';

export const getPickupLabel = (
  booking: IBooking,
  verbosity: 'basic' | 'verbose' = 'verbose'
) => {
  const pickupDate = moment(booking.pickupDate);
  const returnDate = moment(booking.returnDate);

  if (booking.isReturned) return 'Returned';
  if (returnDate.isBefore(moment()) && !booking.isReturned) {
    if (booking.isPickedUp && verbosity === 'verbose')
      return 'Picked up, not returned';
    return 'Not returned';
  }
  if (pickupDate.isSameOrAfter(moment())) {
    return booking.isPickedUp ? 'Picked up' : 'Not picked up';
  }
  return booking.isPickedUp ? 'Picked up' : 'Not picked up';
};

export const getTagColor = (booking: IBooking) => {
  if (booking.isReturned) return 'green';

  const pickupDate = moment(booking.pickupDate);
  const returnDate = moment(booking.returnDate);

  if (pickupDate.isSameOrAfter(moment())) return 'green';
  if (returnDate.isAfter(moment())) {
    // During booking
    if (booking.isPickedUp) return 'green';
    return 'yellow';
  }
  return booking.isReturned ? 'green' : 'red';
};
