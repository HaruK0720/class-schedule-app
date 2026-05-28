import React, { useState } from 'react';

import { supabase } from '../lib/supabase';

import * as S from '../styles/timetable.styles';

import styled from 'styled-components';

/* ========================================
   styled-components
======================================== */

/**
 * 認証画面全体コンテナ
 * 中央寄せレイアウト
 */
const AuthContainer = styled(S.Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 80svh;
`;

/**
 * フォーム入力エリア
 */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

/**
 * 入力欄
 * メールアドレス / パスワード共通
 */
const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-h);
  font-size: 1rem;
`;

/**
 * 送信ボタン
 * ZoomJoinButton を継承
 */
const SubmitButton = styled(S.ZoomJoinButton)`
  border: none;
  cursor: pointer;
  width: 100%;
`;

/**
 * ログイン / 新規登録切替ボタン
 */
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  margin-top: 16px;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
`;

/* ========================================
   認証コンポーネント
======================================== */

export const Auth: React.FC = () => {

  /* ========================================
     状態管理
  ======================================== */

  /**
   * 認証処理中状態
   */
  const [loading, setLoading] = useState(false);

  /**
   * メールアドレス入力値
   */
  const [email, setEmail] = useState('');

  /**
   * パスワード入力値
   */
  const [password, setPassword] = useState('');

  /**
   * true:
   *   新規登録モード
   *
   * false:
   *   ログインモード
   */
  const [isSignUp, setIsSignUp] = useState(false);

  /* ========================================
     認証処理
  ======================================== */

  /**
   * ログイン / 新規登録
   */
  const handleAuth = async (
    e: React.FormEvent
  ) => {

    /**
     * フォーム送信時の
     * ページリロード防止
     */
    e.preventDefault();

    /**
     * ローディング開始
     */
    setLoading(true);

    try {

      /* ========================================
         新規登録
      ======================================== */

      if (isSignUp) {

        const { error } =
          await supabase.auth.signUp({
            email,
            password
          });

        if (error) throw error;

        /**
         * メール認証案内
         */
        alert(
          '確認メールを送信しました（設定により即ログイン可能な場合もあります）'
        );

      } else {

        /* ========================================
           ログイン
        ======================================== */

        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (error) throw error;
      }

    } catch (error) {

      /* ========================================
         エラーハンドリング
      ======================================== */

      /**
       * Error型か判定し、
       * 安全にmessage取得
       */
      const message =
        error instanceof Error
          ? error.message
          : '予期せぬエラーが発生しました';

      alert(message);

    } finally {

      /**
       * 処理終了
       */
      setLoading(false);
    }
  };

  /* ========================================
     JSX
  ======================================== */

  return (

    <AuthContainer>

      {/* ========================================
          ヘッダー
      ======================================== */}

      <S.Header>

        {/* タイトル */}
        <h1>
          {isSignUp
            ? '新規アカウント作成'
            : 'ログイン'}
        </h1>

        {/* 説明文 */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text)'
          }}
        >
          個人設定を保存するために必要です
        </p>

      </S.Header>

      {/* ========================================
          認証フォーム
      ======================================== */}

      <form onSubmit={handleAuth}>

        <FormGroup>

          {/* メールアドレス */}
          <Input
            type="email"
            placeholder="メールアドレス"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            required
          />

          {/* パスワード */}
          <Input
            type="password"
            placeholder="パスワード"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            required
          />

          {/* 送信ボタン */}
          <SubmitButton
            as="button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? '処理中...'
              : (
                isSignUp
                  ? '登録する'
                  : 'ログイン'
              )}

          </SubmitButton>

        </FormGroup>

      </form>

      {/* ========================================
          モード切替
      ======================================== */}

      <ToggleButton
        onClick={() =>
          setIsSignUp(!isSignUp)
        }
      >

        {isSignUp
          ? '既にアカウントをお持ちの方はこちら'
          : '新しくアカウントを作る'}

      </ToggleButton>

    </AuthContainer>
  );
};