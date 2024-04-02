import { Center, Container, Heading, Image, Text } from '@chakra-ui/react';

export const MembersOnlyWarningPage = () => {
  return (
    <Container maxW={'sm'} py={8}>
      <Center minH={'100vh'} pt={'100px'} flexDir={'column'}>
        <Image src={'/utility-lock.svg'} alt={'Lock'} w={'100px'} />
        <Heading as={'h1'}>Members Only</Heading>
        <Text>
          You must be a member to access this page. Please contact the site
          administrator for more information.
        </Text>
      </Center>
    </Container>
  );
};
