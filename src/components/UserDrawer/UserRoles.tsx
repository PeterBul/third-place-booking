import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tag,
} from '@chakra-ui/react';
import {
  addRolesToUser,
  getUserRoles,
  removeRolesFromUser,
} from '../../api/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getRoles } from '../../api/roles';

interface IProps {
  userId: number;
}

export const UserRoles = (props: IProps) => {
  const {
    data: userRoles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles', props.userId],
    queryFn: getUserRoles.bind(null, props.userId),
  });

  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const queryClient = useQueryClient();

  const addRolesMutation = useMutation({
    mutationFn: addRolesToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', props.userId] });
    },
  });

  const removeRolesMutation = useMutation({
    mutationFn: removeRolesFromUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', props.userId] });
    },
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <Tag colorScheme="red">{error.message}</Tag>;
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="user-roles">Roles</FormLabel>

        <HStack id="user-roles" spacing={4}>
          {userRoles
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map((role) => (
              <Tag size={'md'} key={role.id} variant="solid" colorScheme="teal">
                {role.name}
              </Tag>
            ))}
        </HStack>
      </FormControl>
      <Menu>
        {/* Add roles menu */}
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Assign Role
        </MenuButton>
        <MenuList>
          {allRoles
            ?.filter((role) => {
              return !userRoles?.some((userRole) => userRole.id === role.id);
            })
            .map((role) => (
              <MenuItem
                key={role.id}
                onClick={() => {
                  addRolesMutation.mutate({
                    userId: props.userId,
                    roles: [role.id],
                  });
                }}
              >
                {role.name}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </>
  );
};
