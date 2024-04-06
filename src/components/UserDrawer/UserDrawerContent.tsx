import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Skeleton,
  SkeletonText,
  Stack,
} from '@chakra-ui/react';
import {
  IUser,
  addRolesToUser,
  editUser,
  removeRolesFromUser,
} from '../../api/users';
import { UserRoles } from './UserRoles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PhoneNumberInput } from '../PhoneNumberInput';
import { zPhone } from '../../schema';
import { BasicInput } from '../forms/BasicInput';
import { z } from 'zod';
import { useFormik } from '../../validation';
import { IRole } from '../../types/IRole';

const Schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: zPhone,
});

interface IProps {
  onClose: () => void;
  user: IUser;
  isLoading: boolean | undefined;
  userRoles: IRole[];
  canEditRoles?: boolean;
}

export const UserDrawerContent = ({
  user,
  isLoading,
  onClose,
  userRoles,
  canEditRoles,
}: IProps) => {
  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: editUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const addRolesMutation = useMutation({
    mutationFn: addRolesToUser,
    onSuccess: (_, { userId }) => {
      queryClient.removeQueries({ queryKey: ['roles', userId] });
    },
  });

  const removeRolesMutation = useMutation({
    mutationFn: removeRolesFromUser,
    onSuccess: (_, { userId }) => {
      queryClient.removeQueries({ queryKey: ['roles', userId] });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      roles: userRoles?.map((r) => r.id) || [],
    },
    onSubmit: (values) => {
      if (!user) {
        return;
      }
      userMutation.mutate({
        id: user.id,
        name: values.name,
        phone: values.phone,
      });
      if (!canEditRoles) {
        return;
      }
      const rolesToAdd = values.roles.filter(
        (r) => !userRoles?.map((ur) => ur.id).includes(r)
      );
      const rolesToRemove = userRoles
        ?.map((ur) => ur.id)
        .filter((r) => !values.roles.includes(r));

      if (rolesToAdd.length) {
        addRolesMutation.mutate({ userId: user.id, roles: rolesToAdd });
      }
      if (rolesToRemove?.length) {
        removeRolesMutation.mutate({ userId: user.id, roles: rolesToRemove });
      }
      onClose();
    },
    zodSchema: Schema,
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
    <form onSubmit={formik.handleSubmit}>
      <DrawerCloseButton />
      <DrawerHeader>User</DrawerHeader>

      <DrawerBody>
        <Stack gap={12}>
          <Stack spacing={4}>
            <BasicInput
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.errors.name}
              onBlur={formik.handleBlur}
            />
            <FormControl isInvalid={!!formik.errors.phone}>
              <FormLabel htmlFor="phone">Phone Number:</FormLabel>
              <PhoneNumberInput
                value={formik.values.phone}
                onChange={async (v: string) => {
                  await formik.setFieldValue('phone', v);
                  formik.setFieldTouched('phone', true);
                }}
                onBlur={formik.handleBlur}
                placeholder="Enter your phone number"
              />
              <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
            </FormControl>
            <UserRoles
              userId={user.id}
              userRoles={formik.values.roles}
              onChange={async (roles: number[]) => {
                await formik.setFieldValue('roles', roles);
                formik.setFieldTouched('roles', true);
              }}
              editable={canEditRoles}
            />
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
    </form>
  );
};
