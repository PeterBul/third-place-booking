import { TableMeta as OriginalTableMeta } from '@tanstack/table-core';
import { TValue } from './types';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> extends OriginalTableMeta<TData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: TValue | boolean
    ) => void;
  }
}
