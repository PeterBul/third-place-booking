import { useMutation, useQuery } from '@tanstack/react-query';
import { editUser, getUsers } from '../api/users';
import { Box, Icon, Table, Td, Th, Tr } from '@chakra-ui/react';
import {
  SortDirection,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EditableCell } from './Table/EditableCell';
import { TValue } from './Table/types';
import { StaticCell } from './Table/StaticCell';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { useState } from 'react';
import { Filters } from './Table/Filters';
import { MdArrowDownward, MdArrowUpward, MdSwapVert } from 'react-icons/md';

const columns = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
    cell: EditableCell,
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
    cell: EditableCell,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: StaticCell,
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
    cell: StaticCell,
  },
  {
    header: 'Member Third Place',
    accessorKey: 'isMemberThirdPlace',
    cell: CheckmarkCell,
  },
  {
    header: 'Member Bloom',
    accessorKey: 'isMemberBloom',
    cell: CheckmarkCell,
  },
];
const Users = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const [globalFilter, setGlobalFilter] = useState('');
  const userMutation = useMutation({ mutationFn: editUser });
  const table = useReactTable({
    data: users ?? [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    getRowId: (row) => row.id.toString(),
    meta: {
      updateData: (
        rowId: string,
        columnId: string,
        value: TValue | boolean
      ) => {
        const user = users?.find((user) => user.id === +rowId);
        if (!user) return;
        userMutation.mutate({
          id: user.id,
          [columnId]: value,
        });
      },
    },
  });

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Box as={Table} w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box as={Tr} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box as={Th} w={header.getSize()} key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.getCanSort() && (
                  <Icon
                    as={getSortIcon(header.column.getIsSorted())}
                    mx={3}
                    fontSize={14}
                    onClick={header.column.getToggleSortingHandler()}
                  />
                )}
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${
                    header.column.getIsResizing() ? 'isResizing' : ''
                  }`}
                ></Box>
              </Box>
            ))}
          </Box>
        ))}
        {table.getRowModel().rows.map((row) => (
          <Box as={Tr} key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box as={Td} w={cell.column.getSize()} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Users;

const getSortIcon = (dir: SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
