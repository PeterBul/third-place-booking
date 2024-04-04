import { Heading } from '@chakra-ui/react';
import { FullPageCentered } from './FullPageCentered';

const Missing = () => {
  return (
    <FullPageCentered>
      <Heading as={'h1'}>404 - Not Found</Heading>
    </FullPageCentered>
  );
};

export default Missing;
