import { TableMeta as OriginalTableMeta } from '@tanstack/table-core';
import { ColumnMeta as OriginalColumnMeta } from '@tanstack/table-core';
import { TValue } from './types';
import { CheckboxProps, IconButtonProps, TextProps } from '@chakra-ui/react';
import { e_CellType } from '../../enums';

interface IconButtonCellProps<TValue> extends IconButtonProps {
  onClick: (id: number, value: TValue) => void;
}

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
    type?: e_CellType;
    options?: {
      id: string | number;
      displayValue: string;
    }[];
    allowNull?: boolean;
    renderType?: RT;
    isInline?: boolean;
    props?: TValue extends boolean ? CheckboxProps : TextProps;
    center?: boolean;
    deleteCell?: {
      mutation: (id: number) => Promise<void>;
      invalidateKey?: string;
    };
    iconButtonCell?: IconButtonCellProps<TValue>;

    onChange?: (rowId: string, value: TValue | boolean) => void;
  }
}
