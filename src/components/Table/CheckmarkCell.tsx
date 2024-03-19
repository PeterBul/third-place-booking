import { Center, Checkbox } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';

import { IUser } from '../../api/users';
import { useEffect, useState } from 'react';

export const CheckmarkCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<IUser, boolean>) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (value: boolean) => {
    table.options.meta?.updateData(row.index, column.id, value);
    setValue(value);
  };

  return (
    <Center w="100%">
      <Checkbox
        isChecked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </Center>
  );
};
