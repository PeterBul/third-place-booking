import { Box, Flex, Text } from '@chakra-ui/react';
import moment from 'moment';

interface IProps {
  fromDate: string | Date;
  toDate: string | Date;
}

export const HorizontalDateLine = (props: IProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text minW={50} pr={4}>
        {moment(props.fromDate).format('MMM Do')}
      </Text>
      <Box flex={1} h="1px" bg="gray.500" />
      <Text fontSize={'large'}>🕰️</Text>
      <Box flex={1} h="1px" bg="gray.500" />
      <Text minW={50} pl={4}>
        {moment(props.toDate).format('MMM Do')}
      </Text>
    </Flex>
  );
};
