import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, getUsers } from '../api/users';
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Icon,
  Show,
  Table,
  Th,
  Tr,
  VStack,
} from '@chakra-ui/react';
import {
  SortDirection,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TValue } from './Table/types';
import { StaticCell } from './Table/StaticCell';
import { CheckmarkCell } from './Table/CheckmarkCell';
import { useMemo, useState } from 'react';
import { Filters } from './Table/Filters';
import { MdArrowDownward, MdArrowUpward, MdSwapVert } from 'react-icons/md';
import { editBooking, getBookings } from '../api/bookings';
import moment from 'moment';

const columns = [
  {
    header: 'Borrowed By',
    accessorKey: 'borrowedBy',
    cell: StaticCell,
  },
  {
    header: 'Rented From',
    accessorKey: 'rentedFrom',
    cell: StaticCell,
  },
  {
    header: 'Rented To',
    accessorKey: 'rentedTo',
    cell: StaticCell,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: StaticCell,
  },
  {
    header: 'Is Picked Up',
    accessorKey: 'isPickedUp',
    cell: CheckmarkCell,
  },
  {
    header: 'Is Returned',
    accessorKey: 'isReturned',
    cell: CheckmarkCell,
  },
];
const BookingsAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const queryClient = useQueryClient();

  const [globalFilter, setGlobalFilter] = useState('');

  const [isMeFilterActive, setIsMeFilterActive] = useState(false);

  const toggleMeFilter = () => {
    setIsMeFilterActive((v) => !v);
  };

  const bookingMutation = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const data = useMemo(() => {
    return (
      bookings
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        .filter((booking) => {
          if (isMeFilterActive) {
            return booking.userId === me?.id;
          }
          return true;
        })
        .map((booking) => {
          const user = users?.find((user) => user.id === booking.userId);
          return {
            borrowedBy: user?.firstName + ' ' + user?.lastName,
            rentedFrom: moment(booking.pickupDate).format('MMM Do YYYY'),
            rentedTo: moment(booking.returnDate).format('MMM Do YYYY'),
            status: booking.isReturned
              ? 'Returned'
              : booking.isPickedUp
              ? 'Picked Up'
              : 'Not Picked Up',
            isPickedUp: booking.isPickedUp,
            isReturned: booking.isReturned,
            userId: booking.userId,
            id: booking.id,
          };
        }) ?? []
    );
  }, [bookings, isMeFilterActive, me?.id, users]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: [
        {
          id: 'rentedFrom',
          desc: true,
        },
      ],
    },
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
        const booking = bookings?.find((booking) => booking.id === +rowId);
        if (!booking) return;
        bookingMutation.mutate({
          id: booking.id,
          [columnId]: value,
        });
      },
    },
  });

  return (
    <Box>
      <Filters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isMeFilterActive={isMeFilterActive}
        toggleMeFilter={toggleMeFilter}
      />

      <Show above="md">
        <Box overflowX={'auto'}>
          <Table w={table.getTotalSize()}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr className="tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    className="th"
                    w={header.getSize()}
                    key={header.id}
                    border={0}
                  >
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
                  </Th>
                ))}
              </Tr>
            ))}
            {table.getRowModel().rows.map((row) => (
              <Tr className="tr" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Box className="td" w={cell.column.getSize()} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Tr>
            ))}
          </Table>
        </Box>
      </Show>

      <Show below="md">
        <VStack>
          {table.getRowModel().rows.map((row) => (
            <Card key={row.id} maxW={'md'}>
              <CardBody>
                {row.getVisibleCells().map((cell) => (
                  <FormControl
                    display={'flex'}
                    my={2}
                    key={cell.id}
                    alignItems={'center'}
                  >
                    <FormLabel htmlFor={cell.id} minW={'140px'}>
                      {cell.column.columnDef.header?.toString()}
                    </FormLabel>
                    <Box key={cell.id} id={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Box>
                  </FormControl>
                ))}
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Show>
    </Box>
  );
};

export default BookingsAdmin;

const getSortIcon = (dir: SortDirection | false) => {
  if (dir === 'asc') {
    return MdArrowUpward;
  }
  if (dir === 'desc') {
    return MdArrowDownward;
  }
  return MdSwapVert;
};
