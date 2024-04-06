import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { IUser, getUserRoles } from '../../api/users';
import 'yup-phone';
import { UserDrawerContent } from './UserDrawerContent';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLButtonElement>;
  user: IUser | undefined;
  isLoading?: boolean;
  canEditRoles?: boolean;
}

export const UserDrawer = (props: IProps) => {
  const { data: userRoles } = useQuery({
    queryKey: ['roles', props.user?.id],
    queryFn: getUserRoles.bind(null, props.user?.id),
  });

  if (!props.user || !userRoles) {
    return null;
  }
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
        <UserDrawerContent
          user={props.user}
          onClose={props.onClose}
          isLoading={props.isLoading}
          userRoles={userRoles}
          canEditRoles={props.canEditRoles}
        />
      </DrawerContent>
    </Drawer>
  );
};
