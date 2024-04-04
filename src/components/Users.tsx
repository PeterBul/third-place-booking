import { useMutation, useQuery } from '@tanstack/react-query';
import { editUser, getUsers } from '../api/users';
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Show,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
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
import { useMemo, useState } from 'react';
import { Filters } from './Table/Filters';
import { MdArrowDownward, MdArrowUpward, MdSwapVert } from 'react-icons/md';
import { IconButtonCell } from './Table/IconButtonCell';
import { UserDrawer } from './UserDrawer/UserDrawer';
import parsePhoneNumberFromString from 'libphonenumber-js/max';
import { e_CellType } from '../enums';
import { EditIcon } from '@chakra-ui/icons';

const Users = () => {
  const emailPadding = useBreakpointValue({ base: 0, md: 2 });
  const centerCheckmark = useBreakpointValue({ base: false, md: true });

  const userMutation = useMutation({ mutationFn: editUser });

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: EditableCell,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: StaticCell,
      meta: {
        props: {
          p: emailPadding,
        },
      },
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
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Member Bloom',
      accessorKey: 'isMemberBloom',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Edit',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        isInline: true,
        type: e_CellType.iconButton,
        iconButtonCell: {
          // as: MdEdit,
          icon: <EditIcon />,
          onClick: (id: number) => setCurrentUserId(id),
          'aria-label': 'Edit',
          title: 'Edit',
          color: 'gray.300',
        },
      },
    },
  ];
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const processedUsers = useMemo(() => {
    if (!users) return [];
    return users?.map((user) => ({
      ...user,
      phone:
        user.phone &&
        parsePhoneNumberFromString(user.phone)?.formatInternational(),
    }));
  }, [users]);

  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: processedUsers,
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

  const currentUser = users?.find((user) => user.id === currentUserId);

  return (
    <Box>
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Show above="md">
        <Box overflowX={'auto'}>
          <Table w={table.getTotalSize()}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      w={`${header.getSize()}px`}
                      key={header.id}
                      border={
                        header.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                      boxShadow={
                        header.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                    >
                      {!header.column.columnDef.meta?.isInline && (
                        <>
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
                        </>
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      w={`${cell.column.getSize()}px`}
                      key={cell.id}
                      border={
                        cell.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                      boxShadow={
                        cell.column.columnDef.meta?.isInline
                          ? 'none'
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Show>

      <Show below="md">
        <VStack>
          {table.getRowModel().rows.map((row) => (
            <Card key={row.id} w={'100%'}>
              <CardBody>
                {row.getVisibleCells().map((cell) => {
                  if (
                    cell.column.columnDef.meta?.type === e_CellType.iconButton
                  ) {
                    const meta = cell.column.columnDef.meta.iconButtonCell;
                    if (!meta) {
                      throw new Error('No meta provided for IconButtonCell');
                    }
                    return (
                      <IconButton
                        size={'md'}
                        w={'100%'}
                        {...meta}
                        onClick={() =>
                          meta.onClick(+row.id, cell.getContext().getValue())
                        }
                        // onClick={meta.onClick.bind(null, +context.row.id, context.getValue())}
                      />
                    );
                  }
                  return (
                    <FormControl
                      display={'flex'}
                      my={2}
                      key={cell.id}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                    >
                      <FormLabel htmlFor={cell.id} minW={'150px'}>
                        {cell.column.columnDef.header?.toString()}
                      </FormLabel>
                      <Box key={cell.id} id={cell.id} flex={1}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Box>
                    </FormControl>
                  );
                })}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Show>
      {currentUser != null && (
        <UserDrawer
          isOpen={currentUserId !== null}
          onClose={() => setCurrentUserId(null)}
          user={currentUser}
        />
      )}
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
