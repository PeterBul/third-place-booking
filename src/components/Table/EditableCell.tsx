import { Input } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { IUser } from '../../api/users';
import { TValue } from './types';

export const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<IUser, TValue>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="filled"
      size="sm"
      w="85%"
      onBlur={onBlur}
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    />
  );
};
