import {
  Box,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Stack,
} from '@chakra-ui/react';
import { IItem } from '../../../api/items';
import { BookingCard } from './BookingCard';
import { MdCheck } from 'react-icons/md';

interface IProps {
  item: IItem;
  isSelected: boolean;
  isAvailable: boolean;
  handleSelectionChange: (id: number, isChecked: boolean) => void;
}

const checkMarkSize = 24;

export const BookingItem = (props: IProps) => {
  return (
    <Card
      variant={getCardVariant(props.isSelected, props.isAvailable)}
      onClick={() =>
        props.handleSelectionChange(props.item.id, !props.isSelected)
      }
      cursor={'pointer'}
      bg="white"
      color="gray.800"
      textAlign={'center'}
      height={'fit-content'}
    >
      <Box
        as="span"
        position="absolute"
        top={`-${checkMarkSize / 2}px`}
        right={`${checkMarkSize / 2}px`}
        borderRadius="50%"
        width={`${checkMarkSize}px`}
        height={`${checkMarkSize}px`}
        background={getCheckMarkBackground(props.isSelected, props.isAvailable)}
        border={getCheckMarkBorder(props.isAvailable)}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon
          as={MdCheck}
          color={props.isSelected ? 'white' : 'blue.50'}
          boxSize={`${checkMarkSize * 0.8}px`}
        />
      </Box>

      <CardBody>
        <Stack>
          <Image
            src={props.item.image?.url}
            alt={props.item.image?.alt}
            fit={props.item.image?.isClippable ? 'cover' : 'contain'}
            borderRadius="lg"
            height={200}
          />
          {/* <Box
        className="item-bg-image"
        title={props.item.image.alt}
        style={{ backgroundImage: `url(${props.item.image.url})` }}
      /> */}
          <Heading as="h2" py={2} size="lg">
            {props.item.title}
          </Heading>
          {props.item.bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          {props.item.bookings.length === 0 && (
            <Box p={4} color="gray.500">
              This item has no bookings
            </Box>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

const getCardVariant = (isSelected: boolean, isAvailable: boolean) => {
  if (!isSelected) {
    return undefined;
  }
  if (!isAvailable) {
    return 'warning';
  }

  return 'selected';
};

const getCheckMarkBackground = (isSelected: boolean, isAvailable: boolean) => {
  if (!isSelected) {
    return 'white';
  }
  if (!isAvailable) {
    return 'yellow.500';
  }

  return 'blue.300';
};

const getCheckMarkBorder = (isAvailable: boolean) => {
  if (!isAvailable) {
    return '2px solid var(--chakra-colors-yellow-500)';
  }

  return '2px solid var(--chakra-colors-blue-300)';
};
