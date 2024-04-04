import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { IUser, editUser } from '../../api/users';
import { UserRoles } from './UserRoles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PhoneNumberInput } from '../PhoneNumberInput';
import { yupPhone } from '../../schema';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import 'yup-phone';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLButtonElement>;
  user: IUser;
}

const Schema2 = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yupPhone.required('Phone number is required'),
});

export const UserDrawer = (props: IProps) => {
  // if (isLoading || !booking) {
  //   return (
  //     <Center h="100vh">
  //       <Spinner
  //         thickness="4px"
  //         speed="0.65s"
  //         emptyColor="gray.200"
  //         color="blue.500"
  //         size="xl"
  //       />
  //     </Center>
  //   );
  // }

  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return (
    <Drawer
      isOpen={props.isOpen}
      placement="right"
      onClose={props.onClose}
      finalFocusRef={props.btnRef}
      size={'sm'}
    >
      <DrawerOverlay />
      <DrawerContent padding={2}>
        <Formik
          initialValues={{
            name: props.user.name,
            phone: props.user.phone,
          }}
          validationSchema={Schema2}
          onSubmit={(values) => {
            userMutation.mutate({
              id: props.user.id,
              name: values.name,
              phone: values.phone,
            });
            props.onClose();
          }}
        >
          {(formik) => {
            return (
              <Form>
                <DrawerCloseButton />
                <DrawerHeader>User</DrawerHeader>

                <DrawerBody>
                  <Stack gap={12}>
                    <Stack spacing={4}>
                      <FormControl isInvalid={!!formik.errors.name}>
                        <FormLabel htmlFor="name">Name:</FormLabel>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                        ></Field>
                        <FormErrorMessage>
                          {formik.errors.name}
                        </FormErrorMessage>
                      </FormControl>
                      {/* <Field>
                        {(props) => (
                          <PhoneNumberInput
                            {...props.field}
                            value={formik.values.phone}
                            onChange={(v) => {
                              formik.handleChange(v);
                            }}
                          />
                        )}
                      </Field> */}
                      <FormControl isInvalid={!!formik.errors.phone}>
                        <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                        <Field
                          as={PhoneNumberInput}
                          id="phone"
                          value={formik.values.phone}
                          onChange={async (v: string) => {
                            await formik.setFieldValue('phone', v);
                            formik.setFieldTouched('phone', true);
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.phone}
                        </FormErrorMessage>
                      </FormControl>
                      <UserRoles userId={props.user.id} />
                    </Stack>
                  </Stack>
                </DrawerBody>

                <DrawerFooter>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    mr={3}
                    onClick={formik.submitForm}
                    isDisabled={!formik.isValid}
                  >
                    Save
                  </Button>
                  <Button variant="outline" mr={3} onClick={props.onClose}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </Form>
            );
          }}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};
