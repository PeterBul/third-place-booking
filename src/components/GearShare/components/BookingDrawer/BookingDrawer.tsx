import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Spinner,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { IBooking, getBooking } from '../../../../api/bookings';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { parsePhoneNumber } from 'libphonenumber-js/max';
import { getUsers } from '../../../../api/users';
import { BookingStatusTag } from './BookingStatusTag';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef: React.RefObject<HTMLButtonElement>;
  booking: IBooking;
}

export const BookingDrawer = (props: IProps) => {
  const labelBasis = 200;
  const {
    data: booking,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['bookings', props.booking.id],
    queryFn: () => getBooking(props.booking.id!),
  });

  const {
    data: users,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isError || userIsError) {
    return <Text>Something went wrong</Text>;
  }

  const user =
    props.booking.user || users?.find((u) => u.id === booking?.userId);

  return (
    <Drawer
      isOpen={props.isOpen}
      placement="right"
      onClose={props.onClose}
      finalFocusRef={props.btnRef}
      size={'sm'}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Booking</DrawerHeader>

        <DrawerBody>
          {isLoading || !booking || userIsLoading || !users ? (
            <Center h={'100%'}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          ) : (
            <Stack gap={12}>
              <Box>
                <Flex>
                  <Text flexBasis={labelBasis}>Rented from:</Text>
                  <Text>
                    {moment(booking.pickupDate).format('MMM Do YYYY')}
                  </Text>
                </Flex>
                <Flex>
                  <Text flexBasis={labelBasis}>Rented to:</Text>
                  <Text>
                    {moment(booking.returnDate).format('MMM Do YYYY')}
                  </Text>
                </Flex>
              </Box>

              <Flex>
                <Text flexBasis={labelBasis}>Status:</Text>
                <BookingStatusTag booking={booking} />
              </Flex>
              <Box>
                <Flex>
                  <Text flexBasis={labelBasis}>Name:</Text>
                  <Text>{user?.name}</Text>
                </Flex>
                <Flex>
                  <Text flexBasis={labelBasis}>Mail:</Text>
                  <Text>{user?.email}</Text>
                </Flex>
                <Flex>
                  <Text flexBasis={labelBasis}>Phone Number:</Text>
                  <Text>
                    {user?.phone &&
                      parsePhoneNumber(user.phone).formatInternational()}
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Text>Booking comment:</Text>
                {booking.comment && (
                  <Box
                    bg="yellow.200"
                    color="gray.800"
                    p="2"
                    borderRadius={10}
                    mt={2}
                  >
                    <Text>{booking.comment}</Text>
                  </Box>
                )}
              </Box>
              <Box>
                <Text>Items in booking:</Text>
                <HStack spacing={4} pt={2}>
                  {booking.items?.map((item) => (
                    <Tag
                      size={'md'}
                      key={item.id}
                      variant="solid"
                      colorScheme="teal"
                    >
                      {item.title}
                    </Tag>
                  ))}
                </HStack>
              </Box>
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={props.onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
