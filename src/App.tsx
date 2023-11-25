import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Title, Center, Container } from '@mantine/core';
import Shell from './components/Shell';
import Wrapper from './components/Wrapper';
import Boards from './components/Boards/Boards';
import './App.css';

export default function App() {
  return (
    <Wrapper>
      <Shell>
        <Center>
          <Title
            order={1}
            fw="400"
            style={{
              color: '#080808',
            }}
          >
            My Boards
          </Title>
        </Center>
        <Container size="1000px" mt="xl">
          <Boards />
        </Container>
      </Shell>
    </Wrapper>
  );
}
