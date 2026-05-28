import React from 'react';

import * as S from '../styles/timetable.styles';

import type {
  Lesson,
  TimeRange,
} from '../types/timetable';

/* ========================================
   Props型定義
======================================== */

interface Props {

  /**
   * 表示する授業データ
   */
  lesson: Lesson;

  /**
   * メインカード判定
   * 現在の授業などを強調表示
   */
  isMainCard: boolean;

  /**
   * 時限ごとの時間情報
   */
  periodTimeDetails: Record<
    number,
    TimeRange
  >;

  /**
   * コピー処理
   * Zoom ID / パスコード用
   */
  handleCopy: (
    text: string
  ) => void;

  /**
   * 編集処理
   * 存在する場合のみ編集ボタン表示
   */
  onEdit?: (
    lesson: Lesson
  ) => void;
}

/* ========================================
   授業カード
======================================== */

export const LessonCard: React.FC<Props> = ({
  lesson,
  isMainCard,
  periodTimeDetails,
  handleCopy,
  onEdit,
}) => {

  /* ========================================
     時限の時間情報取得
  ======================================== */

  /**
   * 例:
   * 1限 → 09:00 - 09:50
   */
  const times =
    periodTimeDetails[
      lesson.period
    ];

  /* ========================================
     JSX
  ======================================== */

  return (

    <S.LessonCardWrapper

      /**
       * 授業タイプ別スタイル
       * 対面 / オンライン / 休憩
       */
      $lessonType={lesson.type}

      /**
       * メインカード強調表示
       */
      $isMainCard={isMainCard}
    >

      {/* ========================================
          カードヘッダー
      ======================================== */}

      <S.LessonCardHeader>

        {/* 曜日・時限・時間 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >

          {/* 曜日・時限 */}
          <S.DayPeriodTag>

            {lesson.day}曜 {lesson.period}限

          </S.DayPeriodTag>

          {/* 時間帯 */}
          {times && (

            <S.TimeTag>

              {times.start} - {times.end}

            </S.TimeTag>
          )}

        </div>

        {/* ========================================
            編集ボタン
        ======================================== */}

        {/**
         * onEdit が存在する場合のみ表示
         */}
        {onEdit && (

          <button

            /**
             * 編集対象授業を渡す
             */
            onClick={() =>
              onEdit(lesson)
            }

            style={{
              background: 'none',

              border: 'none',

              color: 'var(--accent)',

              fontSize: '0.8rem',

              fontWeight: 'bold',

              cursor: 'pointer',

              padding: '4px 8px',
            }}
          >
            編集
          </button>
        )}

      </S.LessonCardHeader>

      {/* ========================================
          授業名
      ======================================== */}

      <S.LessonSubject>

        {lesson.subject}

      </S.LessonSubject>

      {/* ========================================
          教室・教員情報
      ======================================== */}

      <S.LessonMetaInfo>

        {/* 教室 */}
        <span>
          📍 {lesson.room || '-'}
        </span>

        {/* 教員 */}
        <span>
          👤 {lesson.teacher || '-'}
        </span>

      </S.LessonMetaInfo>

      {/* ========================================
          持ち物
      ======================================== */}

      {/**
       * 持ち物が存在する場合のみ表示
         */}
      {lesson.belongings &&
        lesson.belongings.length > 0 && (

        <S.LessonBelongings>

          👜 {lesson.belongings.join(', ')}

        </S.LessonBelongings>
      )}

      {/* ========================================
          オンライン授業
      ======================================== */}

      {/**
       * オンライン授業かつ
       * Zoom情報が存在する場合のみ表示
       */}
      {lesson.type === 'オンライン' &&
        lesson.zoomInfo && (

        <S.ZoomSection>

          {/* Zoom参加ボタン */}
          <S.ZoomJoinButton
            href={lesson.zoomInfo.url}

            target="_blank"

            rel="noopener noreferrer"
          >
            Zoomに参加する
          </S.ZoomJoinButton>

          {/* ========================================
              コピー系ボタン
          ======================================== */}

          <S.CopyButtonGroup>

            {/* ミーティングID */}
            <button
              onClick={() =>
                handleCopy(
                  lesson.zoomInfo!
                    .meetingId
                )
              }
            >
              IDをコピー
            </button>

            {/* パスコード */}
            <button
              onClick={() =>
                handleCopy(
                  lesson.zoomInfo!
                    .passcode
                )
              }
            >
              パスコード
            </button>

          </S.CopyButtonGroup>

        </S.ZoomSection>
      )}

    </S.LessonCardWrapper>
  );
};