import Link from 'next/link';
import { useAuth } from '@/hooks';

import { MdAccountCircle, MdExitToApp, MdSettings } from 'react-icons/md';
import { event } from 'nextjs-google-analytics';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import type { UserPrivate } from '@statsfm/statsfm.js';
import { Logo } from './Logo';
import { Avatar } from './Avatar/Avatar';
import { Container } from './Container';
import { Button } from './Button';
import { CrownIcon } from './Icons';
import { DropdownMenu } from './ui/DropdownMenu';

const navigation = [
  {
    link: ({
      user,
      router,
    }: {
      user: UserPrivate | null;
      router: NextRouter;
    }) =>
      user && !user.isPlus && !router.pathname.includes('/plus') ? (
        <Link
          className="flex flex-row gap-1 font-medium text-plus"
          href="/plus"
          onClick={() => event('NAV_plus')}
        >
          <CrownIcon className="m-[2px] mt-0 size-[20px] lg:mt-[2px]" />
          Unlock Plus
        </Link>
      ) : (
        <Link href="/plus" className="font-medium">
          Plus
        </Link>
      ),
    name: 'Plus',
  },
  { name: 'Support', href: 'https://support.stats.fm' },
  { name: 'Feedback', href: 'https://feedback.stats.fm' },
  { name: 'Partner with us', href: '/partners' },
];

export const NavBar = () => {
  const { user, logout, login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // if a redirect url is already set (which happens when you are auth guarded), dont set it again
    const redirectUrl = Cookies.get('redirectUrl');
    login(redirectUrl ?? router.asPath);
  };

  const handleLogOutClick = () => {
    event('NAV_logout');
    logout();
  };

  return (
    <nav className="absolute z-40 flex w-full">
      <Container className="flex w-full items-center bg-inherit py-3">
        <Link
          href="/"
          className="mr-auto flex gap-3"
          onClick={() => event('NAV_home')}
        >
          <Logo className="size-[1.7rem] cursor-pointer" />
          <h3 className="mt-[-3px]">
            stats.fm{router.pathname === '/partners' && ' for partners'}
          </h3>
        </Link>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) =>
            item.link ? (
              <div key={item.name}>{item.link({ user, router })}</div>
            ) : (
              <Link key={item.name} href={item.href} className="font-medium">
                {item.name}
              </Link>
            ),
          )}
        </div>
        <form
          className="relative ml-auto hidden pt-2 md:mr-10 md:block"
          action="/search"
        >
          <input
            className="h-10 rounded-xl border-2 border-transparent bg-black px-4 text-white focus:border-neutral-700 focus:outline-none"
            type="search"
            name="query"
            placeholder="Search"
            {...(router.query.query && { defaultValue: router.query.query })}
          />
          <button type="submit" className="absolute right-0 top-0 mr-4 mt-5">
            <svg
              className="size-4 fill-current text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </form>

        {user && !user.isPlus && router.pathname !== '/plus' && (
          <Link
            className="mr-0 flex flex-row gap-1 px-4 py-2 font-bold text-plus lg:hidden"
            href="/plus"
          >
            <CrownIcon className="m-[2px] mt-0 size-[20px]" />
            Unlock Plus
          </Link>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenu.Trigger className="rounded-full">
              <Avatar name={user.displayName} src={user.image} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item onClick={() => event('NAV_profile')} asChild>
                  <Link href={`/${user.customId ?? user.id}`}>
                    <Avatar
                      size="md"
                      name={user.displayName}
                      src={user.image}
                    />
                    <div>
                      <h5 className="font-medium">{user.displayName}</h5>
                      <p className="m-0">{user.email ?? 'Unknown email'}</p>
                    </div>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => event('NAV_profile')} asChild>
                  <Link href={`/${user.customId ?? user.id}`}>
                    <MdAccountCircle /> My page
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => event('NAV_settings')}
                  asChild
                >
                  <Link href={`/settings`}>
                    <MdSettings /> Settings
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={handleLogOutClick}>
                  <MdExitToApp />
                  Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} className="my-2">
            Log in
          </Button>
        )}
      </Container>
    </nav>
  );
};
