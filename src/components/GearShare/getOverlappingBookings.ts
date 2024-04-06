import moment, { Moment } from 'moment';
import { IItem } from '../../api/items';

export const getOverlappingItems = (
  allItems: IItem[] | undefined,
  selectedItemIds: number[],
  pickupDate: string,
  returnDate: string
) => {
  return allItems?.filter((item) => {
    return item.bookings.some((booking) => {
      const bookingStart = moment(booking.pickupDate);
      const bookingEnd = moment(booking.returnDate);
      const mPickupDate = moment(pickupDate);
      const mReturnDate = moment(returnDate);
      return (
        bookingStart.isSameOrBefore(mReturnDate, 'day') &&
        bookingEnd.isSameOrAfter(mPickupDate, 'day') &&
        selectedItemIds.includes(item.id)
      );
    });
  });
};

export const doEventsOverlap = (
  startA: Moment,
  endA: Moment,
  startB: Moment,
  endB: Moment
) => {
  return (
    startA.isSameOrBefore(endB, 'day') && endA.isSameOrAfter(startB, 'day')
  );
};
