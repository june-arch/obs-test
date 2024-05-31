import { Container, Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';
import { Illustration } from './Illustration';
import classes from './NotFound.module.css';

export function NotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            User Not Found
          </Text>
          <Group justify="center">
            <Button size="md" component={Link} href="/">
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
