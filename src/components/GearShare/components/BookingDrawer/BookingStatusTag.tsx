import { Tag } from '@chakra-ui/react';
import { IBooking } from '../../../../api/bookings';
import moment from 'moment';

interface IProps {
  booking: IBooking;
}

export const BookingStatusTag = ({ booking }: IProps) => {
  return (
    <Tag colorScheme={getTagColor(booking)}>{getPickupLabel(booking)}</Tag>
  );
};

const getPickupLabel = (booking: IBooking) => {
  const pickupDate = moment(booking.pickupDate);
  const returnDate = moment(booking.returnDate);

  if (booking.isReturned) return 'Returned';
  if (returnDate.isBefore(moment()) && !booking.isReturned) {
    if (booking.isPickedUp) return 'Picked up, not returned';
    return 'Not returned';
  }
  if (pickupDate.isSameOrAfter(moment())) {
    return booking.isPickedUp ? 'Picked up' : 'Not picked up';
  }
  return booking.isPickedUp ? 'Picked up' : 'Not picked up';
};

const getTagColor = (booking: IBooking) => {
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
