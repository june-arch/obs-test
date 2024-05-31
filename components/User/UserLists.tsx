'use client';

import {
  Card,
  Modal,
  LoadingOverlay,
  Loader,
  TextInput,
  Group,
  Button,
  Title,
  Text,
  ActionIcon,
  Box,
  Container,
  Avatar,
  rem,
  useMatches,
} from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import MyTable from '../MyTable/MyTable';
import {
  UserState,
  fetchUsers,
  mCreateUser,
  mDeleteUser,
  mUpdateUser,
  users,
  usersError,
  usersStatus,
} from '@/lib/features/users/usersSlice';
import { AppDispatch } from '@/lib/store';

function UserLists() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedNew, { open: openNew, close: closeNew }] = useDisclosure(false);
  const [openedUpdate, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const data = useSelector(users);
  const status = useSelector(usersStatus);
  const error = useSelector(usersError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const form = useForm<Omit<UserState, 'id'>>({
    initialValues: {
      name: '',
      email: '',
      username: '',
      phone: '',
      website: '',
      company: {
        name: '',
        catchPhrase: '',
        bs: '',
      },
      image: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: '',
        },
      },
    },

    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      email: (value) => (value.length > 0 ? null : 'Email is required'),
      username: (value) => (value.length > 0 ? null : 'Username is required'),
      phone: (value) => (value.length > 0 ? null : 'Phone is required'),
      website: (value) => (value.length > 0 ? null : 'Website is required'),
      company: {
        name: (value) => (value.length > 0 ? null : 'Company Name is required'),
        catchPhrase: (value) => (value.length > 0 ? null : 'Catch Phrase is required'),
        bs: (value) => (value.length > 0 ? null : 'BS is required'),
      },
      address: {
        street: (value) => (value.length > 0 ? null : 'Street is required'),
        suite: (value) => (value.length > 0 ? null : 'Suite is required'),
        city: (value) => (value.length > 0 ? null : 'City is required'),
        zipcode: (value) => (value.length > 0 ? null : 'Zipcode is required'),
        geo: {
          lat: (value) => (value.length > 0 ? null : 'Lat is required'),
          lng: (value) => (value.length > 0 ? null : 'Lng is required'),
        },
      },
    },
  });

  const columns = useMemo<ColumnDef<UserState>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => 'ID',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 20,
      },
      {
        accessorKey: 'image',
        header: () => 'Image',
        footer: (props) => props.column.id,
        cell: (props) => {
          const { image } = props.row.original;
          return (
            <Group>
              <Avatar src={image} size={rem(50)} radius="xl" />
            </Group>
          );
        },
        size: 50,
      },
      {
        accessorKey: 'name',
        header: () => 'Name',
        footer: (props) => props.column.id,
        filterFn: 'includesStringSensitive',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: () => 'Email',
        footer: (props) => props.column.id,
        filterFn: 'includesStringSensitive',
        size: 150,
      },
      {
        accessorKey: 'username',
        header: () => 'Username',
        footer: (props) => props.column.id,
        size: 150,
      },
      {
        accessorKey: 'phone',
        header: () => 'Phone',
        footer: (props) => props.column.id,
        size: 150,
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
        cell: (props) => props.row.original.company.name,
        footer: (props) => props.column.id,
        size: 150,
      },
      {
        accessorKey: 'adress',
        header: () => 'Adress',
        cell: (props) => {
          const { address } = props.row.original;
          return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}, (${address.geo.lat}, ${address.geo.lng})`;
        },
        footer: (props) => props.column.id,
        size: 500,
      },
      {
        accessorKey: 'website',
        header: 'Website',
        filterFn: 'equalsString',
        cell: (props) => (
          <Box display="flex">
            {props.row.original.website ? (
              <Text component={Link} mx="auto" href={props.row.original.website} target="_blank">
                {props.row.original.website}
              </Text>
            ) : (
              <Text mx="auto">-</Text>
            )}
          </Box>
        ),
        footer: (props) => props.column.id,
        size: 150,
      },
      {
        accessorKey: '',
        header: 'Action',
        footer: (props) => props.column.id,
        cell: (cell) => (
          <Group justify="center" gap="sm">
            <ActionIcon
              color="blue"
              variant="outline"
              onClick={() => {
                router.push(`/${cell.row.original.id}`);
              }}
            >
              <IconEye />
            </ActionIcon>
            <ActionIcon
              color="green"
              variant="outline"
              onClick={() => {
                setUser(cell.row.original);
                form.setValues(cell.row.original);
                openUpdate();
              }}
            >
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="outline"
              onClick={() => {
                setUser(cell.row.original);
                open();
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        ),
        size: 140,
      },
    ],
    []
  );

  const handleCreate = async (body: Omit<UserState, 'id'>) => {
    try {
      setVisible(true);
      dispatch(mCreateUser(body));
      notifications.show({
        title: 'Create',
        message: 'Sukses',
      });
      setVisible(false);
      closeNew();
      form.reset();
    } catch (err) {
      if (err instanceof Error) {
        notifications.show({
          title: 'Create',
          message: `${error}`,
        });
      }
      setVisible(false);

      // try {
      //   setVisible(true);
      //   dispatch(saveNewUser(body)).unwrap();
      //   if (status === 'succeeded') {
      //     notifications.show({
      //       title: 'Create',
      //       message: 'Sukses',
      //     });
      //     setVisible(false);
      //     closeNew();
      //     form.reset();
      //   }
      // } catch (err) {
      //   if (err instanceof Error) {
      //     notifications.show({
      //       title: 'Create',
      //       message: `${error}`,
      //     });
      //   }
      //   setVisible(false);
    }
  };

  const handleUpdate = async (payload: UserState | null, body: Omit<UserState, 'id'>) => {
    try {
      setVisible(true);
      if (payload) {
        dispatch(mUpdateUser({ ...body, id: payload.id }));
        notifications.show({
          title: 'Update',
          message: 'Sukses',
        });
        setVisible(false);
        closeUpdate();
        form.reset();
        setUser(null);
      } else {
        notifications.show({
          title: 'Update',
          message: 'id null => Data not found',
        });
        setVisible(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        notifications.show({
          title: 'Update',
          message: `${error}`,
        });
      }
      setVisible(false);
    }

    // try {
    //   setVisible(true);
    //   dispatch(updateUser({ id: payload?.id.toString() ?? '', payload: body })).unwrap();
    //   if (status === 'succeeded') {
    //     notifications.show({
    //       title: 'Update',
    //       message: 'Sukses',
    //     });
    //     setVisible(false);
    //     close();
    //     form.reset();
    //     setUser(null);
    //   }
    // } catch (err) {
    //   if (err instanceof Error) {
    //     notifications.show({
    //       title: 'Update',
    //       message: `${error}`,
    //     });
    //   }
    //   setVisible(false);
    // }
  };

  const handleDelete = async (payload: UserState | null) => {
    try {
      setVisible(true);
      if (payload) {
        dispatch(mDeleteUser(payload.id));
        notifications.show({
          title: 'Delete',
          message: 'Sukses',
        });
        setVisible(false);
        close();
        setUser(null);
      } else {
        notifications.show({
          title: 'Delete',
          message: 'id null => Data not found',
        });
        setVisible(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        notifications.show({
          title: 'Delete',
          message: `${error}`,
        });
      }
      setVisible(false);
    }

    // try {
    //   setVisible(true);
    //   dispatch(deleteUser(payload?.id.toString() ?? '')).unwrap();
    //   if (status === 'succeeded') {
    //     notifications.show({
    //       title: 'Delete',
    //       message: 'Sukses',
    //     });
    //     setVisible(false);
    //     close();
    //     setUser(null);
    //   }
    // } catch (err) {
    //   if (err instanceof Error) {
    //     notifications.show({
    //       title: 'Delete',
    //       message: `${error}`,
    //     });
    //   }
    //   setVisible(false);
    // }
  };

  return (
    <Container>
      <Card radius="lg" shadow="md" withBorder mt="xl" w="100%">
        <Group justify={useMatches({ base: 'center', sm: 'flex-end' })} mb="lg">
          <Button onClick={openNew}>Add User</Button>
        </Group>
        <MyTable
          {...{
            data,
            columns,
            isPending: status === 'loading',
          }}
        />
      </Card>
      <Modal
        opened={openedNew}
        onClose={() => {
          closeNew();
          setUser(null);
          form.reset();
        }}
        centered
        withCloseButton={false}
        size="lg"
        closeOnClickOutside={!visible}
      >
        <form onSubmit={form.onSubmit((values) => handleCreate(values))}>
          <LoadingOverlay visible={visible} loaderProps={{ children: <Loader size={30} /> }} />
          <Title order={2} c="blue" ta="center" mb="lg">
            Form Create
          </Title>
          <Avatar size="xl" mx="auto" />
          <TextInput
            placeholder="https://picsum.photos/id/1/200/300"
            label="Image"
            key={form.key('image')}
            {...form.getInputProps('image')}
          />
          <TextInput
            placeholder="John doe"
            label="Name"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <TextInput
            placeholder="john@mail.com"
            label="Email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Username"
            placeholder="john_doe"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <TextInput
            placeholder="08xxxxxxxxxx"
            label="Phone"
            key={form.key('phone')}
            {...form.getInputProps('phone')}
          />
          <TextInput
            placeholder="https://johndoe.com"
            label="Website"
            key={form.key('website')}
            {...form.getInputProps('website')}
          />
          <Group mt="md" grow>
            <TextInput
              label="Company Name"
              placeholder="John Doe Inc."
              key={form.key('company.name')}
              {...form.getInputProps('company.name')}
            />
            <TextInput
              label="Catch Phrase"
              placeholder="John Doe Inc. is the best company in the world."
              key={form.key('company.catchPhrase')}
              {...form.getInputProps('company.catchPhrase')}
            />
            <TextInput
              label="BS"
              placeholder="Best Company in the world."
              key={form.key('company.bs')}
              {...form.getInputProps('company.bs')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="Street"
              placeholder="Jl. John Doe No. 1"
              key={form.key('address.street')}
              {...form.getInputProps('address.street')}
            />
            <TextInput
              label="Suite"
              placeholder="Apt. 1"
              key={form.key('address.suite')}
              {...form.getInputProps('address.suite')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="City"
              placeholder="Jakarta"
              key={form.key('address.city')}
              {...form.getInputProps('address.city')}
            />
            <TextInput
              label="Zipcode"
              placeholder="12345"
              key={form.key('address.zipcode')}
              {...form.getInputProps('address.zipcode')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="Lat"
              placeholder="-6.2087634"
              key={form.key('address.geo.lat')}
              {...form.getInputProps('address.geo.lat')}
            />
            <TextInput
              label="Lng"
              placeholder="106.845599"
              key={form.key('address.geo.lng')}
              {...form.getInputProps('address.geo.lng')}
            />
          </Group>
          <Group grow mt="md">
            <Button
              variant="default"
              onClick={() => {
                closeNew();
                setUser(null);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button color="blue" variant="filled" type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={openedUpdate}
        onClose={() => {
          closeUpdate();
          setUser(null);
          form.reset();
        }}
        centered
        withCloseButton={false}
        size="lg"
        closeOnClickOutside={!visible}
      >
        <form onSubmit={form.onSubmit((values) => handleUpdate(user, values))}>
          <LoadingOverlay visible={visible} loaderProps={{ children: <Loader size={30} /> }} />
          <Title order={2} c="blue" ta="center" mb="lg">
            Form Edit
          </Title>
          <Avatar src={form.getValues().image} size={rem(180)} mx="auto" />
          <TextInput label="Image" key={form.key('image')} {...form.getInputProps('image')} />
          <TextInput label="Name" key={form.key('name')} {...form.getInputProps('name')} />
          <TextInput label="Email" key={form.key('email')} {...form.getInputProps('email')} />
          <TextInput
            label="Username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <TextInput label="Phone" key={form.key('phone')} {...form.getInputProps('phone')} />
          <TextInput label="Website" key={form.key('website')} {...form.getInputProps('website')} />
          <Group mt="md" grow>
            <TextInput
              label="Company Name"
              key={form.key('company.name')}
              {...form.getInputProps('company.name')}
            />
            <TextInput
              label="Catch Phrase"
              key={form.key('company.catchPhrase')}
              {...form.getInputProps('company.catchPhrase')}
            />
            <TextInput
              label="BS"
              key={form.key('company.bs')}
              {...form.getInputProps('company.bs')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="Street"
              key={form.key('address.street')}
              {...form.getInputProps('address.street')}
            />
            <TextInput
              label="Suite"
              key={form.key('address.suite')}
              {...form.getInputProps('address.suite')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="City"
              key={form.key('address.city')}
              {...form.getInputProps('address.city')}
            />
            <TextInput
              label="Zipcode"
              key={form.key('address.zipcode')}
              {...form.getInputProps('address.zipcode')}
            />
          </Group>
          <Group mt="md" grow>
            <TextInput
              label="Lat"
              key={form.key('address.geo.lat')}
              {...form.getInputProps('address.geo.lat')}
            />
            <TextInput
              label="Lng"
              key={form.key('address.geo.lng')}
              {...form.getInputProps('address.geo.lng')}
            />
          </Group>

          <Group grow mt="md">
            <Button
              variant="default"
              onClick={() => {
                closeUpdate();
                setUser(null);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button color="blue" variant="filled" type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setUser(null);
        }}
        centered
        withCloseButton={false}
        size="lg"
        closeOnClickOutside={!visible}
      >
        <LoadingOverlay visible={visible} loaderProps={{ children: <Loader size={30} /> }} />
        <Title order={1} c="red" ta="center" mb="xl">
          Are You Sure ?
        </Title>
        <Text mt={2}>Name: {user?.name}</Text>
        <Text mt={2}>Email : {user?.email}</Text>
        <Text mt={2}>Phone No : {user?.phone}</Text>
        <Group grow mt="xl">
          <Button
            variant="default"
            onClick={() => {
              close();
              setUser(null);
            }}
          >
            Cancel
          </Button>
          <Button color="red" variant="filled" onClick={() => handleDelete(user)}>
            Yes
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default UserLists;
