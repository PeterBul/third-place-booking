import {
  Avatar,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { IBooking } from '../../../api/bookings';
import { HorizontalDateLine } from './HorozontalDateLine';
import { Gravatar } from '../../Gravatar';

interface IProps {
  booking: IBooking;
}
export const BookingCard = (props: IProps) => {
  return (
    <Card>
      <CardBody>
        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
          {props.booking.user?.email ? (
            <Gravatar email={props.booking.user?.email} size="sm" />
          ) : (
            <Avatar size="sm" />
          )}
          <Heading size="sm">{props.booking.user?.firstName}</Heading>
        </Flex>
        <Stack divider={<StackDivider />} gap={4} mt={4}>
          <HorizontalDateLine
            fromDate={props.booking.pickupDate}
            toDate={props.booking.returnDate}
          />
          <Text textAlign="left">{props.booking.comment}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};
