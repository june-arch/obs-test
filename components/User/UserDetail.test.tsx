import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MantineProvider } from '@mantine/core';
import UserDetail from './UserDetail';
import { UserState } from '@/lib/features/users/usersSlice';

const mockStore = configureMockStore();
const store = mockStore({
  // Define your initial mock state here
  users: {
    byId: {
      1: {
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
      // Add more user mock data if necessary
    },
  },
});

jest.mock('../../lib/features/users/usersSlice', () => ({
  selectUserById: jest.fn((state, id) => state.users.byId[id]),
}));

describe('UserDetail', () => {
  it('renders user details correctly', () => {
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
    const params = { id: '1' };
    // Render the component with the user data
    render(
      <Provider store={store}>
        <MantineProvider>
          <UserDetail params={params} />
        </MantineProvider>
      </Provider>
    );

    // Assert that the user details are rendered correctly
    expect(screen.getByDisplayValue(user.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.website)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.company.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.company.catchPhrase)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.company.bs)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.street)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.suite)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.city)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.zipcode)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.geo.lat)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.address.geo.lng)).toBeInTheDocument();
  });
});
