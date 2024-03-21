import { Center, Checkbox } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';

import { useEffect, useState } from 'react';

export function CheckmarkCell<T>({
  getValue,
  row,
  column,
  table,
}: CellContext<T, boolean>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (value: boolean) => {
    table.options.meta?.updateData(row.id, column.id, value);
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
}
