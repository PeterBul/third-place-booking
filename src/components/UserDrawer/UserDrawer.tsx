import { Drawer, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { IUser } from '../../api/users';
import 'yup-phone';
import { UserDrawerContent } from './UserDrawerContent';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLButtonElement>;
  user: IUser | undefined;
  isLoading?: boolean;
}

export const UserDrawer = (props: IProps) => {
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
        />
      </DrawerContent>
    </Drawer>
  );
};
