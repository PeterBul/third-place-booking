import {
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Flex,
  Icon,
  FormControl,
  FormLabel,
  AlertDialogFooter,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';
import { MdArchive } from 'react-icons/md';
import {
  SeriousConfirmDialog,
  SeriousConfirmInput,
  SeriousConfirmDestructButton,
} from './SeriousConfirmDialog';
import { useRef } from 'react';

interface ISeriousDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  whatToDelete: string;
  canArchive?: boolean;
}

export const SeriousDeleteDialog = (props: ISeriousDeleteDialogProps) => {
  const cancelRef = useRef(null);
  return (
    <SeriousConfirmDialog
      confirmString="delete"
      isOpen={props.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={props.onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            textTransform={'capitalize'}
          >
            Delete {props.whatToDelete}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Flex flexDir={'column'} gap={4}>
              <Text>
                {`Are you sure you want to delete this ${props.whatToDelete}? This is a destructive action and can't be undone.`}
              </Text>
              {props.canArchive && (
                <Text>
                  You can also archive the booking by clicking{' '}
                  <Box
                    as="span"
                    display={'inline-block'}
                    verticalAlign={'middle'}
                  >
                    <Icon as={MdArchive} cursor={'text'} boxSize={5} />
                  </Box>
                  .
                </Text>
              )}
              <FormControl>
                <FormLabel htmlFor="delete-booking">
                  Type "delete" to confirm
                </FormLabel>
                <SeriousConfirmInput id="delete-booking" />
              </FormControl>
            </Flex>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose}>
              Cancel
            </Button>
            <SeriousConfirmDestructButton
              colorScheme="red"
              onClick={() => {
                props.onDelete();
                props.onClose();
              }}
              ml={3}
            >
              Delete
            </SeriousConfirmDestructButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </SeriousConfirmDialog>
  );
};
