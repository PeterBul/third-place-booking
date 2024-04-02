import { Center } from '@chakra-ui/react';

interface IProps {
  children: React.ReactNode;
}

export const FullPageCentered = (props: IProps) => {
  return (
    <Center minH={'100vh'} pt={'100px'} flexDir={'column'}>
      {props.children}
    </Center>
  );
};
