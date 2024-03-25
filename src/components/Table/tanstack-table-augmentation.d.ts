import { TableMeta as OriginalTableMeta } from '@tanstack/table-core';
import { ColumnMeta as OriginalColumnMeta } from '@tanstack/table-core';
import { TValue } from './types';
import { CheckboxProps, TextProps } from '@chakra-ui/react';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> extends OriginalTableMeta<TData> {
    updateData: (
      rowId: string,
      columnId: string,
      value: TValue | boolean
    ) => void;
  }
  export interface ColumnMeta<TData extends RowData, TValue>
    extends OriginalColumnMeta<TData, TValue> {
    options?: {
      id: string | number;
      displayValue: string;
    }[];
    allowNull?: boolean;
    renderType?: RT;
    props?: TValue extends boolean ? CheckboxProps : TextProps;
    center?: boolean;
    deleteCell?: {
      mutation: (id: number) => Promise<void>;
      invalidateKey?: string;
    };
  }
}
