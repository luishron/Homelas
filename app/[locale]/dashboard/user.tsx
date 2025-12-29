import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import { signOut } from '@/lib/auth-actions';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export async function User() {
  const user = await getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.user_metadata?.avatar_url ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.email ?? 'Mi Cuenta'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem>
            <form action={signOut}>
              <button type="submit">Cerrar Sesión</button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Iniciar Sesión</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
