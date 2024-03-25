import { IconButton } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import { deleteItem } from '../api/items';
import { newId } from './NewItemButton';

type TValue = number | string | undefined | readonly string[];

interface IProps<T extends TValue> {
  value: T;
  button?: T extends readonly string[] ? React.ReactNode[] : React.ReactNode;
}

export const DeleteItemButton = <T extends TValue>(props: IProps<T>) => {
  const { value } = props;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
  if (value === undefined) return null;
  if (value === newId) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map((v) => (
      <IconButton
        as={MdDelete}
        aria-label="Delete item"
        variant="inline"
        size={'xs'}
        color="red.400"
        onClick={() => deleteMutation.mutate(+v)}
      />
    ));
  }
  return (
    <IconButton
      as={MdDelete}
      aria-label="Delete item"
      variant="inline"
      size={'xs'}
      color="red.400"
      onClick={() => deleteMutation.mutate(+value)}
    />
  );
};
