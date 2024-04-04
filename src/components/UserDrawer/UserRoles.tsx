import { FormControl, FormLabel, HStack, Spinner, Tag } from '@chakra-ui/react';
import { getUserRoles } from '../../api/users';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  userId: number;
}

export const UserRoles = (props: IProps) => {
  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles', props.userId],
    queryFn: getUserRoles.bind(null, props.userId),
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <Tag colorScheme="red">{error.message}</Tag>;
  }

  return (
    <FormControl>
      <FormLabel htmlFor="user-roles">Roles</FormLabel>

      <HStack id="user-roles" spacing={4}>
        {roles?.map((role) => (
          <Tag size={'md'} key={role.id} variant="solid" colorScheme="teal">
            {role.name}
          </Tag>
        ))}
      </HStack>
    </FormControl>
  );
};
