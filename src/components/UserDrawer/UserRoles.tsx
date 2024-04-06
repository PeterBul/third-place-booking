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
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { getRoles } from '../../api/roles';
import { IRole } from '../../types/IRole';

interface IProps {
  userId: number;
  userRoles: number[];
  onChange: (roles: number[]) => void;
  editable?: boolean;
}

export const UserRoles = (props: IProps) => {
  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  if (!allRoles) {
    return <Spinner />;
  }

  const roleMap = allRoles?.reduce((acc, role) => {
    acc[role.id] = role;
    return acc;
  }, {} as Record<number, IRole>);

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="user-roles">Roles</FormLabel>

        <HStack id="user-roles" spacing={4}>
          {props.userRoles
            .map((roleId) => roleMap[roleId])
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map((role) => (
              <Tag size={'md'} key={role.id} variant="solid" colorScheme="teal">
                <TagLabel>{role.name}</TagLabel>
                {props.editable && (
                  <TagCloseButton
                    onClick={() => {
                      props.onChange(
                        props.userRoles.filter((r) => r !== role.id)
                      );
                    }}
                  />
                )}
              </Tag>
            ))}
        </HStack>
      </FormControl>
      {props.editable && (
        <Menu>
          {/* Add roles menu */}
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Assign Role
          </MenuButton>
          <MenuList>
            {allRoles
              ?.filter((role) => {
                return !props.userRoles?.some(
                  (userRole) => userRole === role.id
                );
              })
              .map((role) => (
                <MenuItem
                  key={role.id}
                  onClick={() => {
                    props.onChange([...props.userRoles, role.id]);
                  }}
                >
                  {role.name}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
      )}
    </>
  );
};
