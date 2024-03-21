import {
  Avatar,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { IBooking } from '../../../api/bookings';
import { HorizontalDateLine } from './HorozontalDateLine';
import { Gravatar } from '../../Gravatar';
import { BookingDrawer } from './BookingDrawer/BookingDrawer';
import { useRef } from 'react';

interface IProps {
  booking: IBooking;
}
export const BookingCard = (props: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <Card>
      <CardBody>
        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
          {props.booking.user?.email ? (
            <Gravatar email={props.booking.user?.email} size="sm" />
          ) : (
            <Avatar size="sm" />
          )}
          <Heading size="sm">
            {props.booking.user?.firstName} {props.booking.user?.lastName}
          </Heading>
        </Flex>
        <Stack divider={<StackDivider />} gap={4} mt={4}>
          <HorizontalDateLine
            fromDate={props.booking.pickupDate}
            toDate={props.booking.returnDate}
          />
          <Text textAlign="left">{props.booking.comment}</Text>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            Show full booking
          </Button>
        </Stack>
        <BookingDrawer
          booking={props.booking}
          isOpen={isOpen}
          onClose={onClose}
          btnRef={btnRef}
        />
      </CardBody>
    </Card>
  );
};
