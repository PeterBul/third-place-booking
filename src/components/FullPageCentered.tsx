import { Center, Container, ContainerProps } from '@chakra-ui/react';

interface IProps extends ContainerProps {
  children: React.ReactNode;
}

export const FullPageCentered = ({ children, ...props }: IProps) => {
  return (
    <Container
      as={Center}
      minH={'calc(100vh - 100px)'}
      pt={'100px'}
      flexDir={'column'}
      {...props}
    >
      {children}
    </Container>
  );
};
