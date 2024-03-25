import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';
import { DeleteItemButton } from '../DeleteButton';
import { Center } from '@chakra-ui/react';

export function DeleteCell<T>(context: CellContext<T, TValue>) {
  return (
    <Center flex={1}>
      <DeleteItemButton
        value={context.getValue()}
        mutation={context.column.columnDef.meta?.deleteCell?.mutation}
        invalidateKey={context.column.columnDef.meta?.deleteCell?.invalidateKey}
      />
    </Center>
  );
}
