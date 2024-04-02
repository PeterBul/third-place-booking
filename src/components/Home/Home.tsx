import { Heading } from '@chakra-ui/react';
import './Home.css';

const Home = () => {
  return (
    <>
      <section className="home-full-page text-light">
        <hgroup className="center">
          <Heading as={'h1'} fontWeight={'normal'} fontSize={'7xl'}>
            Welcome home 🔥
          </Heading>
        </hgroup>
      </section>
    </>
  );
};

export default Home;
