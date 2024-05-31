import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import UserLists from '@/components/User/UserLists';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <UserLists />
    </>
  );
}
