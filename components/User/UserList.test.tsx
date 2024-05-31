import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MantineProvider } from '@mantine/core';
import UserLists from './UserLists';
import { UserState } from '@/lib/features/users/usersSlice';

const mockStore = configureMockStore();
const store = mockStore({
  status: 'succeeded',
  error: null,
  users: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
      image: 'https://picsum.photos/id/100/200?random=1',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618',
        },
      },
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains',
      },
      image: 'https://picsum.photos/id/110/200?random=2',
    },
  ],
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
  }),
}));

jest.mock('../../lib/features/users/usersSlice', () => ({
  users: jest.fn().mockImplementation((state) => state.users),
  usersStatus: jest.fn().mockImplementation((state) => state.status),
  usersError: jest.fn().mockImplementation((state) => state.error),
}));

describe('UserList', () => {
  const user: UserState = {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
      },
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
    image: 'https://picsum.photos/id/100/200?random=1',
  };

  it('renders user list correctly', () => {
    render(
      <Provider store={store}>
        <MantineProvider>
          <UserLists />
        </MantineProvider>
      </Provider>
    );

    screen.getAllByText(user.name).forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
