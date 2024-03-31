import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import axios from '../api/axios';
import { useCountdown } from '../hooks/useCountdown';

export const VerificationPage = () => {
  const [countdown, setCountdown] = useCountdown(0);

  const handleResendVerificationEmail = async () => {
    setCountdown(60);
    axios.get('/api/auth/resend');
  };

  return (
    <Center h={'100vh'}>
      <VStack>
        <Heading as="h1">Verification required</Heading>
        <Text>
          Account verification required. Please check your email to find your
          unique verification link.
        </Text>
        <Text mt={4}>
          If you haven't received the email, please check your spam folder.
        </Text>
        <Button
          isDisabled={countdown > 0}
          colorScheme="blue"
          onClick={handleResendVerificationEmail}
        >
          Resend verification email
        </Button>
        {countdown > 0 && <Text>Disabled for {countdown} seconds</Text>}
      </VStack>
    </Center>
  );
};
