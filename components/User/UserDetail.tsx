'use client';

import React, { useState } from 'react';
import {
  Anchor,
  Avatar,
  Breadcrumbs,
  Card,
  Container,
  Group,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { PropsParam } from '@/app/[id]/page';
import { UserState, selectUserById } from '@/lib/features/users/usersSlice';
import { useAppSelector } from '@/lib/hooks';
import { NotFound } from '../NotFound/NotFound';

function UserDetail({ params }: PropsParam) {
  const [user] = useState<UserState | undefined>(
    useAppSelector((state) => selectUserById(state, Number(params.id)))
  );

  if (!user) {
    return <NotFound />;
  }

  const items = [
    { title: 'Pages', href: '/' },
    { title: 'Detail', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} c="white" fw={200} fz={14}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container>
      <Breadcrumbs
        mt="xl"
        px={0}
        separator={
          <Text c="white" fz={14} fw={200}>
            /
          </Text>
        }
      >
        {items}
      </Breadcrumbs>
      <Card my="xl">
        <Avatar src={user.image} size={rem(180)} mx="auto" />
        <TextInput label="Image" value={user.image} disabled />
        <TextInput label="Name" value={user.name} disabled />
        <TextInput label="Email" value={user.email} disabled />
        <TextInput label="Username" value={user.username} disabled />
        <TextInput label="Phone" value={user.phone} disabled />
        <TextInput label="Website" value={user.website} disabled />

        <Group mt="md" grow>
          <TextInput label="Company" value={user.company.name} disabled />
          <TextInput label="Catch Phrase" value={user.company.catchPhrase} disabled />
          <TextInput label="BS" value={user.company.bs} disabled />
        </Group>
        <Group mt="md" grow>
          <TextInput label="Street" value={user.address.street} disabled />
          <TextInput label="Suite" value={user.address.suite} disabled />
        </Group>
        <Group mt="md" grow>
          <TextInput label="City" value={user.address.city} disabled />
          <TextInput label="Zipcode" value={user.address.zipcode} disabled />
        </Group>
        <Group mt="md" grow>
          <TextInput label="Lat" value={user.address.geo.lat} disabled />
          <TextInput label="Lng" value={user.address.geo.lng} disabled />
        </Group>
      </Card>
    </Container>
  );
}

export default UserDetail;
