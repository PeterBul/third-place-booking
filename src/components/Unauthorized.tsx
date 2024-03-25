import { Center, Heading, Text } from '@chakra-ui/react';
const Unauthorized = () => {
  return (
    <Center minH={'100vh'} pt={'100px'} flexDir={'column'}>
      <Heading as={'h1'}>Unauthorized</Heading>
      <Text>You are not authorized to view this page.</Text>
    </Center>
  );
};

export default Unauthorized;
