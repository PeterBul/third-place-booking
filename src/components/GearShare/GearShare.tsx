import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '../../api/items';
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
  List,
  ListItem,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Field, Formik, FormikProps } from 'formik';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { createBooking } from '../../api/bookings';

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
  const items = useQuery({ queryKey: ['items'], queryFn: getItems });
  const queryClient = useQueryClient();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const postBooking = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  return (
    <>
      <Container
        minH="40vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        pt="100px"
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
                for pickup and deliver.
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
        <Formik
          initialValues={{
            pickupDate: '',
            returnDate: '',
            comment: '',
            itemIds: [] as number[],
          }}
          validationSchema={toFormikValidationSchema(Schema)}
          onSubmit={(values, helpers) => {
            postBooking.mutate(values);
            helpers.resetForm();
          }}
        >
          {(formik) => {
            const handleSelectItem = (id: number) => {
              formik.setFieldValue('itemIds', [
                ...formik.values.itemIds.filter((v) => v !== id),
                id,
              ]);
            };

            const handleUnselectItem = (id: number) => {
              formik.setFieldValue(
                'itemIds',
                formik.values.itemIds.filter((v) => v !== id)
              );
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
              formik.getFieldMeta('pickupDate').touched &&
              formik.errors.pickupDate;

            return (
              <form onSubmit={formik.handleSubmit}>
                <Box
                  display={'grid'}
                  gridTemplateColumns={'repeat( auto-fit, minmax(250px, 1fr) )'}
                  mt="20px"
                  gap="50px"
                >
                  {items.data
                    ?.sort((a, b) => a.id - b.id)
                    .map((item) => (
                      <BookingItem
                        key={item.id}
                        item={item}
                        isSelected={formik.values.itemIds.includes(item.id)}
                        handleSelectionChange={handleSelectionChange}
                      />
                    ))}
                </Box>
                <Container mt="50px">
                  <Stack gap={4}>
                    <Heading as="h2" size="lg">
                      Booking summary
                    </Heading>
                    <FormControl isInvalid={!!formik.errors.itemIds}>
                      <Text>
                        You have selected{' '}
                        <strong>{formik.values.itemIds.length}</strong> items
                      </Text>

                      <FormErrorMessage>
                        {formik.errors.itemIds}
                      </FormErrorMessage>
                    </FormControl>
                    <List>
                      {formik.values.itemIds.map((id) => (
                        <ListItem key={id} display="flex">
                          <Checkbox
                            isChecked
                            onChange={() => handleUnselectItem(id)}
                            mr={4}
                          >
                            {items.data?.find((i) => i.id === id)?.title}
                          </Checkbox>
                        </ListItem>
                      ))}
                    </List>
                    <Flex gap={4}>
                      <FormControl isRequired isInvalid={!!pickupDateError}>
                        <FormLabel htmlFor="pickupDate">Pickup Date</FormLabel>
                        <Field
                          as={Input}
                          type="date"
                          size="md"
                          id="pickupDate"
                          onChange={formik.handleChange}
                          value={formik.values.pickupDate}
                        />

                        <FormErrorMessage>{pickupDateError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={!!returnError}>
                        <FormLabel htmlFor="returnDate">Return Date</FormLabel>
                        <Field
                          as={Input}
                          type="date"
                          size="md"
                          id="returnDate"
                          onChange={formik.handleChange}
                          value={formik.values.returnDate}
                        />

                        <FormErrorMessage>{returnError}</FormErrorMessage>
                      </FormControl>
                    </Flex>
                    <FormControl>
                      <FormLabel htmlFor="comment">Comment</FormLabel>
                      <Field
                        as={Textarea}
                        id="comment"
                        onChange={formik.handleChange}
                        value={formik.values.comment}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="yellow"
                      size="lg"
                      isDisabled={!zSafeParsed.success}
                    >
                      Book
                    </Button>
                  </Stack>
                </Container>
              </form>
            );
          }}
        </Formik>
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
