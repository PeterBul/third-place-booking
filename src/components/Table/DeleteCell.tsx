import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';
import { IconButton } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '../../api/items';
import { newId } from '../ItemsAdmin';

export function DeleteCell<T>(context: CellContext<T, TValue>) {
  const value = context.getValue();
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
}
