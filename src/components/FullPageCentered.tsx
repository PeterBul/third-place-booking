import { Center, Container } from '@chakra-ui/react';

interface IProps {
  children: React.ReactNode;
}

export const FullPageCentered = (props: IProps) => {
  return (
    <Container
      as={Center}
      minH={'calc(100vh - 100px)'}
      pt={'100px'}
      flexDir={'column'}
    >
      {props.children}
    </Container>
  );
};
