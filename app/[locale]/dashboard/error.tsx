'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Dashboard Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h1 className="font-semibold text-lg md:text-2xl text-red-600">
          Error en el Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-semibold text-red-800">Error:</p>
          <p className="text-red-700 mt-2">{error.message}</p>
          {error.digest && (
            <p className="text-sm text-red-600 mt-2">Digest: {error.digest}</p>
          )}
        </div>
        <pre className="my-4 px-3 py-4 bg-black text-white rounded-lg max-w-4xl overflow-auto text-xs">
          <code>{error.stack}</code>
        </pre>
        <div className="flex gap-4">
          <Button onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/login'}>
            Volver al login
          </Button>
        </div>
      </div>
    </main>
  );
}
