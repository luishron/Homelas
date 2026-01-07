import { getUser } from '@/lib/auth';
import { getUserProfile } from '@/lib/profiles';
import { redirect } from 'next/navigation';
import { SettingsForm } from './settings-form';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.settings' });

  return {
    title: t('title'),
  };
}

export default async function ConfiguracionPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();

  if (!profile) {
    // This shouldn't happen, but handle gracefully
    redirect('/dashboard');
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Administra tu cuenta y preferencias personales
        </p>
      </div>

      <SettingsForm profile={profile} user={user} />
    </div>
  );
}
