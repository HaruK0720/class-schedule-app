import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { Timetable } from './pages/Timetable';
import { Auth } from './components/Auth';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ログイン状態の変化を監視（ログイン・ログアウト時に走る）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // セッションがなければログイン画面、あればメインの時間割を表示
  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <Timetable />
      )}
    </>
  );
}

export default App;