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
   * 時間割データ一覧
   */
  timetableData: Lesson[];

  /**
   * 今日の曜日
   *
   * 例:
   * 月 / 火 / 水
   */
  today: string;

  /**
   * 現在強調表示する時限
   */
  currentPeriod: number | null;

  /**
   * 時限ごとの時間情報
   */
  periodTimeDetails: Record<
    number,
    TimeRange
  >;

  /**
   * 編集処理
   * セルクリック時に使用
   */
  onEdit?: (
    lesson: Lesson
  ) => void;
}

/* ========================================
   時間割テーブル
======================================== */

export const TimetableMatrix: React.FC<Props> = ({
  timetableData,
  today,
  currentPeriod,
  periodTimeDetails,
  onEdit,
}) => {

  /* ========================================
     曜日一覧
  ======================================== */

  /**
   * テーブル列順
   */
  const daysOfWeek = [
    '月',
    '火',
    '水',
    '木',
    '金',
  ];

  /* ========================================
     JSX
  ======================================== */

  return (

    <S.TableViewContainer>

      <S.TimetableMatrixTable>

        {/* ========================================
            テーブルヘッダー
        ======================================== */}

        <thead>

          <tr>

            {/* 時限列 */}
            <th>
              限
            </th>

            {/* 曜日列 */}
            {daysOfWeek.map(d => (

              <th key={d}>

                {/* 今日の曜日を強調表示 */}
                {d === today ? (

                  <S.HighlightDayHeader as="span">

                    {d}

                  </S.HighlightDayHeader>

                ) : (
                  d
                )}

              </th>
            ))}

          </tr>

        </thead>

        {/* ========================================
            テーブル本体
        ======================================== */}

        <tbody>

          {/* 時限ごとに行生成 */}
          {Object.keys(
            periodTimeDetails
          ).map(pKey => {

            /**
             * string → number
             */
            const p =
              Number(pKey);

            return (

              <tr key={p}>

                {/* ========================================
                    時限列
                ======================================== */}

                <S.PeriodCol>

                  {/* 時限 */}
                  <strong>
                    {p}
                  </strong>

                  {/* 開始時刻 */}
                  <small>

                    {
                      periodTimeDetails[
                        p
                      ].start
                    }

                  </small>

                </S.PeriodCol>

                {/* ========================================
                    曜日セル
                ======================================== */}

                {daysOfWeek.map(
                  day => {

                    /**
                     * 該当授業取得
                     */
                    const item =
                      timetableData.find(
                        d =>
                          d.day ===
                            day &&
                          d.period ===
                            p
                      );

                    /**
                     * 現在時限セル判定
                     */
                    const isCurrentCell =
                      p ===
                        currentPeriod &&
                      day ===
                        today;

                    return (

                      <S.TableCell

                        key={day}

                        /**
                         * 現在セル強調
                         */
                        $isActiveCell={
                          isCurrentCell
                        }

                        /**
                         * 今日の列判定
                         */
                        $isTodayColumn={
                          day ===
                          today
                        }

                        /**
                         * 授業有無
                         */
                        $hasItem={
                          !!item
                        }

                        /**
                         * 授業タイプ
                         * 対面 / オンライン / 休憩
                         */
                        $itemType={
                          item?.type
                        }

                        /**
                         * 授業クリック時編集
                         */
                        onClick={() =>
                          item &&
                          onEdit?.(
                            item
                          )
                        }

                        style={{
                          cursor:
                            item
                              ? 'pointer'
                              : 'default',
                        }}
                      >

                        {/* ========================================
                            授業あり
                        ======================================== */}

                        {item ? (

                          <S.TableCellContent>

                            {/* 授業名 */}
                            <S.TableSubject>

                              {item.type ===
                              '休憩'
                                ? '休憩'
                                : item.subject}

                            </S.TableSubject>

                          </S.TableCellContent>

                        ) : (

                          /* ========================================
                              授業なし
                          ======================================== */

                          <span
                            style={{
                              opacity: 0.25,
                            }}
                          >
                            ―
                          </span>
                        )}

                      </S.TableCell>
                    );
                  }
                )}

              </tr>
            );
          })}

        </tbody>

      </S.TimetableMatrixTable>

    </S.TableViewContainer>
  );
};