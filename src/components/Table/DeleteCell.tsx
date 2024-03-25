import { CellContext } from '@tanstack/react-table';
import { TValue } from './types';
import { DeleteItemButton } from '../DeleteButton';

export function DeleteCell<T>(context: CellContext<T, TValue>) {
  return <DeleteItemButton value={context.getValue()} />;
}
