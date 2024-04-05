import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, getMyRoles, getUsers } from '../api/users';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import {
  type ColumnDef,
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
import { MdDelete } from 'react-icons/md';
import { deleteBooking, editBooking, getBookings } from '../api/bookings';
import moment from 'moment';
import { IconButtonCell } from './Table/IconButtonCell';
import { Table } from './Table/Table';
import { e_CellType, e_Roles } from '../enums';

const BookingsAdmin = () => {
  // const [users, setUsers] = useState<IUser[]>([]);
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const { data: myRoles } = useQuery({
    queryKey: ['myRoles'],
    queryFn: getMyRoles,
  });
  const queryClient = useQueryClient();

  const centerCheckmark = useBreakpointValue({ base: false, md: true });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const [globalFilter, setGlobalFilter] = useState('');

  const [isMeFilterActive, setIsMeFilterActive] = useState(false);

  const toggleMeFilter = () => {
    setIsMeFilterActive((v) => !v);
  };

  const editBookingMutation = useMutation({
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
            borrowedBy: user?.name,
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

  type TData = (typeof data)[0];

  const columns: (ColumnDef<TData, TValue> | ColumnDef<TData, boolean>)[] = [
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
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
    {
      header: 'Is Returned',
      accessorKey: 'isReturned',
      cell: CheckmarkCell,
      meta: {
        center: centerCheckmark,
        props: {
          px: 2,
        },
      },
    },
  ];

  if (myRoles?.includes(e_Roles.Admin)) {
    columns.push({
      header: 'Delete',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        type: e_CellType.iconButton,
        isInline: true,
        iconButtonCell: {
          as: MdDelete,
          color: 'red.400',
          'aria-label': 'Delete booking',
          onClick: (id: number) => deleteBookingMutation.mutate(+id),
          size: 'xs',
        },
      },
    });
  }

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
        editBookingMutation.mutate({
          id: booking.id,
          [columnId]: value,
        });
      },
    },
  });

  return (
    <Box>
      <Table
        table={table}
        filters={
          <Filters
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isMeFilterActive={isMeFilterActive}
            toggleMeFilter={toggleMeFilter}
          />
        }
      />
    </Box>
  );
};

export default BookingsAdmin;
