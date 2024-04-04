import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const PageContent = () => {
  return (
    <Container
      maxW={{ base: 'md', md: '6xl' }}
      mx="auto"
      px={{ base: 0, md: 6 }}
      py={24}
      fontSize="sm"
      h={'100vh'}
      className="page-content"
    >
      <Box pb={8}>
        <Outlet />
      </Box>
    </Container>
  );
};
