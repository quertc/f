import { AppShell, Group, Text, Container } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ConnectionButton from './ConnectionButton';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const matches = useMediaQuery('(min-width: 480px)');

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      padding="md"
    >
      <AppShell.Header style={{ backgroundColor: 'transparent' }}>
        <Container size="1440px" h="100%">
          <Group h="100%" px="lg" justify="space-between" style={{ flex: 1 }}>
            <Text
              size="26px"
              fw={700}
              variant="gradient"
              gradient={{ from: 'blue', to: 'gray', deg: 90 }}
            >
              {matches ? '2048 Reward' : '2048'}
            </Text>
            <ConnectionButton />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
