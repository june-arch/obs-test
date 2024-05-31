import React from 'react';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import UserDetail from '@/components/User/UserDetail';
import { Welcome } from '@/components/Welcome/Welcome';

export type PropsParam = { params: { id: string } };

function page({ params }: PropsParam) {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <UserDetail params={params} />
    </>
  );
}

export default page;
