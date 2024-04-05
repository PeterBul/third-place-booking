import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Skeleton,
  SkeletonText,
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

const Schema2 = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yupPhone.required('Phone number is required'),
});

interface IProps {
  onClose: () => void;
  user: IUser | undefined;
  isLoading: boolean | undefined;
}

export const UserDrawerContent = ({ user, isLoading, onClose }: IProps) => {
  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) {
    return (
      <Stack p={8} spacing={4}>
        <Skeleton
          startColor="gray.500"
          endColor="gray.600"
          height="8"
          mt={8}
          w={64}
        />
        <SkeletonText
          pt={4}
          startColor="gray.500"
          endColor="gray.600"
          skeletonHeight="4"
          spacing={4}
          noOfLines={4}
        />
      </Stack>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Formik
      initialValues={{
        name: user.name,
        phone: user.phone,
      }}
      validationSchema={Schema2}
      onSubmit={(values) => {
        userMutation.mutate({
          id: user.id,
          name: values.name,
          phone: values.phone,
        });
        onClose();
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
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
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
                      placeholder="Enter your phone number"
                    />
                    <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
                  </FormControl>
                  <UserRoles userId={user.id} />
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
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </Form>
        );
      }}
    </Formik>
  );
};
