import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IItem, getItems } from '../../api/items';
import './GearShare.css';
import { BookingItem } from './components/BookingItem';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  Link as ChakraLink,
  List,
  ListItem,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useState } from 'react';
import { z } from 'zod';
import { createBooking } from '../../api/bookings';
import { Link as ReactRouterLink } from 'react-router-dom';
import moment from 'moment';
import { FullPageCentered } from '../FullPageCentered';
import { AxiosError } from 'axios';
import { useFormik } from '../../validation';
import { getAvailableItems } from './getAvailableItems';

const Schema = z
  .object({
    pickupDate: z.coerce.date().min(new Date(), 'Must be a future date'),
    returnDate: z.coerce.date().min(new Date(), 'Must be a future date'),
    comment: z.string().optional(),
    itemIds: z.array(z.number()).nonempty('You must select at least one item'),
  })
  .refine(({ pickupDate, returnDate }) => {
    return pickupDate <= returnDate;
  }, 'Return date must be after or the same as pickup date');

const GearShare = () => {
  const today = moment().startOf('day').toISOString();
  const { data: items, isLoading } = useQuery({
    queryKey: ['items', today],
    queryFn: getItems({ from: today }),
  });

  const queryClient = useQueryClient();
  const toast = useToast();

  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  const formik = useFormik({
    initialValues: {
      pickupDate: '',
      returnDate: '',
      comment: '',
      itemIds: [] as number[],
    },
    zodSchema: Schema,
    onSubmit: (values) => {
      postBooking.mutate(values);
    },
  });

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const postBooking = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setShowBookingConfirmation(true);
      formik.resetForm();
    },
    onError: (error) => {
      toast({
        title: 'An error occurred',
        description: getMessage(error) || 'Unknown error',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const handleSelectItem = async (id: number) => {
    await formik.setFieldValue('itemIds', [
      ...formik.values.itemIds.filter((v) => v !== id),
      id,
    ]);
    formik.setFieldTouched('itemIds', true);
  };

  const handleUnselectItem = async (id: number) => {
    await formik.setFieldValue(
      'itemIds',
      formik.values.itemIds.filter((v) => v !== id)
    );
    formik.setFieldTouched('itemIds', true);
  };

  const handleSelectionChange = (id: number, isChecked: boolean) => {
    if (isChecked) {
      handleSelectItem(id);
    } else {
      handleUnselectItem(id);
    }
  };
  const zSafeParsed = Schema.safeParse(formik.values);

  const returnError = getError(formik, zSafeParsed);

  const pickupDateError =
    formik.getFieldMeta('pickupDate').touched && formik.errors.pickupDate;

  const itemsDict = items?.reduce((acc, item) => {
    return { ...acc, [item.id]: item };
  }, {} as Record<number, IItem>);

  if (showBookingConfirmation) {
    return (
      <FullPageCentered>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minHeight="250px"
        >
          <CloseButton
            alignSelf="flex-end"
            position="relative"
            right={0}
            top={-1}
            onClick={() => setShowBookingConfirmation(false)}
          />
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            And its booked!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {
              'Remember to reach out to any of us to make sure \
              you can pick up and deliver on your selected dates ❤️'
            }
          </AlertDescription>
          <AlertDescription maxWidth="sm" pt={2}>
            And please remember to update the booking when you take stuff out
            and when you return it 🙏
          </AlertDescription>
        </Alert>
      </FullPageCentered>
    );
  }

  if (isLoading) {
    return (
      <FullPageCentered>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </FullPageCentered>
    );
  }

  const availableItemIds = new Set(
    getAvailableItems(
      items,
      formik.values.pickupDate,
      formik.values.returnDate
    )?.map((item) => item.id)
  );

  const conflictingBookings = formik.values.itemIds.filter(
    (id) => !availableItemIds.has(id)
  );

  return (
    <>
      <Container
        minH="40vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box as="hgroup">
          <Text variant="fun">Welcome to</Text>
          <Heading as="h1" size="4xl" fontWeight="light" py={4}>
            Third place
          </Heading>
          <Text variant="fun" fontSize="small">
            What a day to rent some stuff!
          </Text>
        </Box>
        <Box mt="2rem">
          <Heading as="h2" size="sm">
            Pickup & delivery
          </Heading>
          <Text>
            Please remember to update the booking when you take stuff out and
            when you return it.
          </Text>
          <ChakraLink
            as={ReactRouterLink}
            to="/admin/bookings"
            fontSize={'large'}
            textDecoration={'underline'}
            pt={'1rem'}
            display={'block'}
          >
            Go to: Booking admin page
          </ChakraLink>
        </Box>
      </Container>
      <Container maxW="2xl">
        <Alert
          status="info"
          mt="2rem"
          flexDirection="column"
          alignItems="start"
          gap={4}
          p={6}
          onClick={() => setIsInfoOpen((v) => !v)}
          cursor="pointer"
        >
          <Flex justifyContent="start" alignItems="center" w="100%">
            <AlertIcon />
            <AlertTitle fontSize="lg">Information about this form</AlertTitle>
            <Icon
              as={isInfoOpen ? MdExpandLess : MdExpandMore}
              aria-label={
                isInfoOpen ? 'Collapse about info' : 'Expand about info'
              }
              ml="auto"
              boxSize={6}
            />
          </Flex>
          {isInfoOpen && (
            <>
              <Text>
                This is a form, so you need to check the boxes under every item
                you wish to book. At the bottom of this page you find the rest
                of the form where you need add your information and select dates
                for pickup and return.
              </Text>
              <Text>
                - Remember: Nothing happens other than filling out this form.
                After this is done you need to contact one of us to make a plan
                for the logistics og picking up and delivering all items.
              </Text>
            </>
          )}
        </Alert>
      </Container>
      <Container maxW="8xl" mt="50px">
        <form onSubmit={formik.handleSubmit}>
          <Box
            display={'grid'}
            gridTemplateColumns={'repeat( auto-fit, minmax(250px, 1fr) )'}
            mt="20px"
            gap="20px"
          >
            {items
              ?.sort((a, b) => a.id - b.id)
              .map((item) => (
                <BookingItem
                  key={item.id}
                  item={item}
                  isSelected={formik.values.itemIds.includes(item.id)}
                  isAvailable={availableItemIds.has(item.id)}
                  handleSelectionChange={handleSelectionChange}
                />
              ))}
          </Box>
          <Container mt="50px">
            <Stack gap={4}>
              <Heading as="h2" size="lg">
                Booking summary
              </Heading>
              <FormControl
                isInvalid={
                  !!formik.errors.itemIds || !!conflictingBookings?.length
                }
              >
                <Text>
                  You have selected{' '}
                  <strong>{formik.values.itemIds.length}</strong> items
                </Text>

                <FormErrorMessage>{formik.errors.itemIds}</FormErrorMessage>
                {!!conflictingBookings?.length && (
                  <FormErrorMessage>
                    One or more of the selected items are not available for the
                    chosen dates
                  </FormErrorMessage>
                )}
              </FormControl>
              <List>
                {formik.values.itemIds
                  .sort((a, b) => {
                    if (!itemsDict) {
                      return 0;
                    }
                    return itemsDict[a].title.localeCompare(itemsDict[b].title);
                  })
                  .map((id) => (
                    <ListItem key={id} display="flex">
                      <Checkbox
                        isChecked
                        onChange={() => handleUnselectItem(id)}
                        mr={4}
                      >
                        {items?.find((i) => i.id === id)?.title}{' '}
                        {!availableItemIds.has(id) && (
                          <Text
                            as={'span'}
                            ml={2}
                            fontStyle={'italic'}
                            color="gray.500"
                            fontSize={'sm'}
                          >
                            Not available
                          </Text>
                        )}
                      </Checkbox>
                    </ListItem>
                  ))}
              </List>
              <Flex gap={4}>
                <FormControl isRequired isInvalid={!!pickupDateError}>
                  <FormLabel htmlFor="pickupDate">Pickup Date</FormLabel>
                  <Input
                    type="date"
                    size="md"
                    id="pickupDate"
                    name="pickupDate"
                    onChange={formik.handleChange}
                    value={formik.values.pickupDate}
                    onBlur={formik.handleBlur}
                  />

                  <FormErrorMessage>{pickupDateError}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!returnError}>
                  <FormLabel htmlFor="returnDate">Return Date</FormLabel>
                  <Input
                    type="date"
                    size="md"
                    id="returnDate"
                    name="returnDate"
                    onChange={formik.handleChange}
                    value={formik.values.returnDate}
                    onBlur={formik.handleBlur}
                  />

                  <FormErrorMessage>{returnError}</FormErrorMessage>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel htmlFor="comment">Comment</FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  onChange={formik.handleChange}
                  value={formik.values.comment}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="yellow"
                size="lg"
                isDisabled={
                  !zSafeParsed.success || !!conflictingBookings?.length
                }
              >
                Book
              </Button>
            </Stack>
          </Container>
        </form>
      </Container>
    </>
  );
};

export default GearShare;
function getError(
  formik: FormikProps<{
    pickupDate: string;
    returnDate: string;
    comment: string;
    itemIds: number[];
  }>,
  zSafeParsed: z.SafeParseReturnType<
    {
      pickupDate: Date;
      returnDate: Date;
      itemIds: [number, ...number[]];
      comment?: string | undefined;
    },
    {
      pickupDate: Date;
      returnDate: Date;
      itemIds: [number, ...number[]];
      comment?: string | undefined;
    }
  >
) {
  if (!formik.getFieldMeta('returnDate').touched) {
    return null;
  }
  if (formik.errors.returnDate) {
    return formik.errors.returnDate;
  }
  if (!zSafeParsed.success) {
    return zSafeParsed.error.errors.find((v) => v.code === 'custom')?.message;
  }
}

const getMessage = (error: Error) => {
  if (error instanceof AxiosError) {
    if (error.response?.data.message) {
      return error.response?.data.message;
    }
  }
};
