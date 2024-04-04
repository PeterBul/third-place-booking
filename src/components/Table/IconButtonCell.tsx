import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';
import { Center, IconButton } from '@chakra-ui/react';

export function IconButtonCell<T>(context: CellContext<T, TValue>) {
  const meta = context.column.columnDef.meta?.iconButtonCell;
  if (!meta) {
    throw new Error('No meta provided for IconButtonCell');
  }
  return (
    <Center flex={1}>
      <IconButton
        variant="inline"
        {...meta}
        onClick={() => meta.onClick(+context.row.id, context.getValue())}
      />
    </Center>
  );
}
