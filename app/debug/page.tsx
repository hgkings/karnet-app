'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState({ url: false, key: false });
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [insertResult, setInsertResult] = useState<string>('');
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    setEnvStatus({
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUserId(session?.user?.id ?? null);
      setSessionLoading(false);
    })();
  }, []);

  const handleTestInsert = async () => {
    setInserting(true);
    setInsertResult('');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setInsertResult('ERROR: No active session. Log in first.');
      setInserting(false);
      return;
    }

    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: session.user.id,
        marketplace: 'trendyol',
        product_name: 'DEBUG_TEST_' + Date.now(),
        inputs: { test: true },
        outputs: { test: true },
        risk_score: 0,
        risk_level: 'safe',
      })
      .select('id')
      .single();

    if (error) {
      setInsertResult(`INSERT ERROR: ${error.message} (code: ${error.code})`);
    } else {
      setInsertResult(`SUCCESS - Row ID: ${data.id}`);
    }
    setInserting(false);
  };

  return (
    <div className="mx-auto max-w-xl p-8 space-y-8">
      <h1 className="text-2xl font-bold">Supabase Debug</h1>

      <section className="rounded-xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground">Environment Variables</h2>
        <div className="space-y-1 text-sm font-mono">
          <p>
            NEXT_PUBLIC_SUPABASE_URL:{' '}
            <span className={envStatus.url ? 'text-emerald-600' : 'text-red-600'}>
              {envStatus.url ? 'PRESENT' : 'MISSING'}
            </span>
          </p>
          <p>
            NEXT_PUBLIC_SUPABASE_ANON_KEY:{' '}
            <span className={envStatus.key ? 'text-emerald-600' : 'text-red-600'}>
              {envStatus.key ? 'PRESENT' : 'MISSING'}
            </span>
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground">Session</h2>
        <div className="text-sm font-mono">
          {sessionLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <p>
              User ID:{' '}
              <span className={sessionUserId ? 'text-emerald-600' : 'text-red-600'}>
                {sessionUserId || 'null (not logged in)'}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground">Test Insert</h2>
        <p className="text-sm text-muted-foreground">
          Inserts a dummy row into analyses and returns the ID.
        </p>
        <Button onClick={handleTestInsert} disabled={inserting}>
          {inserting ? 'Inserting...' : 'Test Insert'}
        </Button>
        {insertResult && (
          <pre className={`mt-2 rounded-lg p-3 text-sm font-mono ${
            insertResult.startsWith('SUCCESS')
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400'
          }`}>
            {insertResult}
          </pre>
        )}
      </section>
    </div>
  );
}
