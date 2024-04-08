import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, getMyRoles, getUsers } from '../api/users';
import { Box, Icon, useBoolean, useBreakpointValue } from '@chakra-ui/react';
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
import { useMemo, useRef, useState } from 'react';
import { Filters } from './Table/Filters';
import {
  deleteBooking,
  editBooking,
  getArchivedBookings,
  getBookings,
} from '../api/bookings';
import moment from 'moment';
import { IconButtonCell } from './Table/IconButtonCell';
import { Table } from './Table/Table';
import { e_CellType, e_Roles } from '../enums';
import { DeleteIcon } from '@chakra-ui/icons';
import { MdArchive, MdInfo, MdRestore } from 'react-icons/md';
import { BooleanFilter } from './Table/BooleanFilter';
import { BookingDrawer } from './GearShare/components/BookingDrawer/BookingDrawer';
import { TagCell } from './Table/TagCell';
import { getPickupLabel, getTagColor } from '../utils/getBookingStatus';
import { SeriousDeleteDialog } from './SeriousDeleteDialog';

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
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const [globalFilter, setGlobalFilter] = useState('');

  const [isMeFilterActive, setIsMeFilterActive] = useBoolean(false);

  const [isArchivedFilterActive, setIsArchivedFilterActive] = useBoolean(false);

  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  const handleCloseDrawer = () => {
    setSelectedBookingId(null);
  };

  const { data: archivedBookings } = useQuery({
    queryKey: ['archivedBookings'],
    queryFn: getArchivedBookings,
  });

  const editBookingMutation = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['archivedBookings'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const [bookingIdToDelete, setBookingIdToDelete] = useState<number | null>(
    null
  );

  const data = useMemo(() => {
    return (
      (isArchivedFilterActive ? archivedBookings : bookings)
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
            status: getPickupLabel(booking, 'basic'),
            isPickedUp: booking.isPickedUp,
            isReturned: booking.isReturned,
            userId: booking.userId,
            id: booking.id,
          };
        }) ?? []
    );
  }, [
    archivedBookings,
    bookings,
    isArchivedFilterActive,
    isMeFilterActive,
    me?.id,
    users,
  ]);

  type TData = (typeof data)[0];

  const openDrawerBtnRef = useRef<HTMLButtonElement>(null);

  const boxSize = 4;

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
      cell: TagCell,
      meta: {
        tagCell: {
          getProps: (id: number) => {
            const booking = bookings?.find((b) => b.id === id);
            return {
              colorScheme: booking && getTagColor(booking),
            };
          },
        },
      },
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
    {
      header: 'Open Booking',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        type: e_CellType.iconButton,
        isInline: true,
        iconButtonCell: {
          icon: <Icon as={MdInfo} boxSize={boxSize} />,
          'aria-label': 'Open booking',
          title: 'Open booking',
          onClick: (id: number) => {
            setSelectedBookingId(id);
          },
          getBtnRef: (id: number) => {
            return id === selectedBookingId ? openDrawerBtnRef : null;
          },
        },
      },
    },
  ];

  if (myRoles?.includes(e_Roles.Admin)) {
    if (!isArchivedFilterActive) {
      columns.push({
        header: 'Archive',
        accessorKey: 'id',
        cell: IconButtonCell,
        size: 40,
        meta: {
          type: e_CellType.iconButton,
          isInline: true,
          iconButtonCell: {
            icon: <Icon as={MdArchive} boxSize={boxSize} />,
            'aria-label': 'Archive booking',
            title: 'Archive booking',
            onClick: (id: number) =>
              editBookingMutation.mutate({ id, isArchived: true }),
          },
        },
      });
    } else {
      columns.push({
        header: 'Restore',
        accessorKey: 'id',
        cell: IconButtonCell,
        size: 40,
        meta: {
          type: e_CellType.iconButton,
          isInline: true,
          iconButtonCell: {
            icon: <Icon as={MdRestore} boxSize={boxSize} />,
            'aria-label': 'Restore booking',
            title: 'Restore booking',
            onClick: (id: number) =>
              editBookingMutation.mutate({ id, isArchived: false }),
          },
        },
      });
    }
    columns.push({
      header: 'Delete',
      accessorKey: 'id',
      cell: IconButtonCell,
      size: 40,
      meta: {
        type: e_CellType.iconButton,
        isInline: true,
        iconButtonCell: {
          icon: <DeleteIcon boxSize={boxSize} />,
          color: 'red.400',
          'aria-label': 'Delete booking',
          title: 'Delete booking',
          onClick: (id: number) => {
            setBookingIdToDelete(+id);
          },
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

  const selectedBooking =
    selectedBookingId !== null
      ? bookings?.find((b) => b.id === selectedBookingId)
      : null;

  const handleDelete = () => {
    if (bookingIdToDelete === null) return;
    deleteBookingMutation.mutate(bookingIdToDelete);
  };

  const handleCloseDeleteDialog = () => {
    setBookingIdToDelete(null);
  };

  return (
    <>
      <Box>
        <Table
          table={table}
          filters={
            <Filters
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              customFilters={
                <>
                  <BooleanFilter
                    id="toggleMeBookings"
                    label="Show only my bookings"
                    value={isMeFilterActive}
                    onToggle={setIsMeFilterActive.toggle}
                  />
                  <BooleanFilter
                    id="toggleArchivedBookings"
                    label="Show archived bookings"
                    value={isArchivedFilterActive}
                    onToggle={setIsArchivedFilterActive.toggle}
                  />
                </>
              }
            />
          }
        />
      </Box>
      <SeriousDeleteDialog
        isOpen={bookingIdToDelete !== null}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        whatToDelete="booking"
        canArchive
      />
      {selectedBooking != null && (
        <BookingDrawer
          isOpen={selectedBooking !== null}
          onClose={handleCloseDrawer}
          booking={selectedBooking}
          btnRef={openDrawerBtnRef}
        />
      )}
    </>
  );
};

export default BookingsAdmin;
