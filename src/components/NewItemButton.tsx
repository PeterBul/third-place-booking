import { Flex, Button } from '@chakra-ui/react';

export const newId = 1000000000;

interface IProps<T> {
  onStartAddingItem: () => void;
  onCancelAddingItem: () => void;
  onSave: () => void;
  newItem: T;
}
export function NewItemButton<T>(props: IProps<T>) {
  return props.newItem ? (
    <Flex mt={4} gap={4}>
      <Button onClick={props.onCancelAddingItem}>Cancel</Button>
      <Button onClick={props.onSave}>Save</Button>
    </Flex>
  ) : (
    <Button mt={4} onClick={props.onStartAddingItem}>
      Add Item
    </Button>
  );
}
