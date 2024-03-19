import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import useAuth from '../hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editUser, getUsers } from '../api/users';
import { Box, Icon } from '@chakra-ui/react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const {
    isError,
    data: users,
    error,
  } = useQuery({ queryKey: ['users'], queryFn: getUsers });

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
    meta: {
      updateData: (
        rowIndex: number,
        columnId: string,
        value: TValue | boolean
      ) => {
        const user = users?.[rowIndex];
        if (!user) return;
        userMutation.mutate({
          id: user.id,
          [columnId]: value,
        });
      },
    },
  });

  if (isError) {
    if (error instanceof AxiosError) {
      // TODO: Make a shared axios error handler
      if (error?.response?.status === 401) {
        setAuth({});
      }
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box className="th" w={header.getSize()} key={header.id}>
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
          <Box className="tr" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box className="td" w={cell.column.getSize()} key={cell.id}>
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
