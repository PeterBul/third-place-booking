import { Heading, Text } from '@chakra-ui/react';
import { FullPageCentered } from './FullPageCentered';
const Unauthorized = () => {
  return (
    <FullPageCentered>
      <Heading as={'h1'}>Unauthorized</Heading>
      <Text>You are not authorized to view this page.</Text>
    </FullPageCentered>
  );
};

export default Unauthorized;
