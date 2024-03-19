import Users from './Users';
import { Container } from '@chakra-ui/react';

const Admin = () => {
  return (
    <Container maxW={1000} mx="auto" px={6} pt={24} fontSize="sm">
      <Users />
    </Container>
  );
};

export default Admin;
