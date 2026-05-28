import React from 'react';

import * as S from '../styles/timetable.styles';

/* ========================================
   Props型定義
======================================== */

interface Props {

  /**
   * 現在の授業状況テキスト
   *
   * 例:
   * 現在時刻：09:10（火）
   * / 今は 1限 数学
   */
  nowInfoText: string;
}

/* ========================================
   ステータスヘッダー
======================================== */

/**
 * アプリ上部ヘッダー
 *
 * 表示内容:
 * ・タイトル
 * ・現在の授業状況
 *
 * ※ ログアウト処理は分離済み
 */
export const StatusHeader: React.FC<Props> = ({
  nowInfoText
}) => {

  /* ========================================
     JSX
  ======================================== */

  return (

    <S.Header>

      {/* アプリタイトル */}
      <h1>
        時間割 2026年度 前期 A1D
      </h1>

      {/* 現在の授業状況 */}
      <S.NowInfoBar>

        {nowInfoText}

      </S.NowInfoBar>

    </S.Header>
  );
};