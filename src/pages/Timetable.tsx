import React, {
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';

import * as S from '../styles/timetable.styles';

import type {
  Lesson,
  TimeRange,
} from '../types/timetable';

import { StatusHeader } from '../components/StatusHeader';

import { LessonCard } from '../components/LessonCard';

import { TimetableMatrix } from '../components/TimetableMatrix';

import { EditLessonModal } from '../components/EditLessonModal';

/* ========================================
   時限ごとの時間定義
======================================== */

/**
 * 各時限の開始・終了時間
 * period → TimeRange の対応表
 */
const periodTimeDetails: Record<
  number,
  TimeRange
> = {
  1: {
    start: '09:00',
    end: '09:50',
  },

  2: {
    start: '10:00',
    end: '10:50',
  },

  3: {
    start: '11:00',
    end: '11:50',
  },

  4: {
    start: '12:00',
    end: '12:50',
  },

  5: {
    start: '13:00',
    end: '13:50',
  },

  6: {
    start: '14:00',
    end: '14:50',
  },

  7: {
    start: '15:00',
    end: '15:50',
  },

  8: {
    start: '16:00',
    end: '16:50',
  },

  9: {
    start: '17:00',
    end: '17:50',
  },
};

/* ========================================
   ユーティリティ関数
======================================== */

/**
 * "09:30" → 570
 * 時刻を分単位へ変換
 */
const toMinutes = (
  timeStr: string
): number => {
  const [h, m] = timeStr
    .split(':')
    .map(Number);

  return h * 60 + m;
};

/**
 * 今日の曜日を取得
 * 例: "月"
 */
const getTodayDayOfWeek =
  (): string => {
    return [
      '日',
      '月',
      '火',
      '水',
      '木',
      '金',
      '土',
    ][new Date().getDay()];
  };

/**
 * 数値を2桁表示に変換
 * 例: 9 → "09"
 */
const padZero = (
  num: number
): string =>
  num
    .toString()
    .padStart(2, '0');

/* ========================================
   メインコンポーネント
======================================== */

export const Timetable: React.FC =
  () => {

    /* ========================================
       表示モード
    ======================================== */

    /**
     * card:
     *   本日の予定カード表示
     *
     * table:
     *   一週間テーブル表示
     */
    const [
      viewMode,
      setViewMode,
    ] = useState<
      'card' | 'table'
    >('card');

    /* ========================================
       現在時刻
    ======================================== */

    /**
     * 現在時刻
     * 1分ごとに更新
     */
    const [now, setNow] =
      useState<Date>(
        new Date()
      );

    /* ========================================
       時間割データ
    ======================================== */

    /**
     * Supabaseから取得した授業データ
     */
    const [
      timetableData,
      setTimetableData,
    ] = useState<Lesson[]>(
      []
    );

    /**
     * ローディング状態
     */
    const [loading, setLoading] =
      useState(true);

    /* ========================================
       モーダル状態
    ======================================== */

    /**
     * 編集モーダル開閉状態
     */
    const [
      isModalOpen,
      setIsModalOpen,
    ] = useState(false);

    /**
     * 編集対象授業
     * undefined の場合は新規追加
     */
    const [
      editingLesson,
      setEditingLesson,
    ] = useState<
      Partial<Lesson> | undefined
    >(undefined);

    /* ========================================
       データ取得
    ======================================== */

    /**
     * Supabaseから授業一覧を取得
     */
    const fetchTimetable =
      async () => {
        setLoading(true);

        const {
          data,
          error,
        } = await supabase
          .from('lessons')
          .select('*')
          .order('period', {
            ascending: true,
          });

        if (error) {
          console.error(
            'Error fetching timetable:',
            error
          );
        } else if (data) {

          /**
           * snake_case →
           * camelCase へ変換
           */
          const mappedData: Lesson[] =
            data.map(
              item => ({
                ...item,

                zoomInfo:
                  item.zoom_info,
              })
            );

          setTimetableData(
            mappedData
          );
        }

        setLoading(false);
      };

    /* ========================================
       初回読み込み
    ======================================== */

    useEffect(() => {

      /**
       * 初回データ取得
       */
      const initialize =
        async () => {
          await fetchTimetable();
        };

      initialize();

      /**
       * 1分ごとに現在時刻更新
       */
      const timer =
        setInterval(() => {
          setNow(
            new Date()
          );
        }, 60000);

      /**
       * アンマウント時
       */
      return () =>
        clearInterval(timer);

    }, []);

    /* ========================================
       ログアウト
    ======================================== */

    /**
     * Supabaseログアウト
     */
    const handleLogout =
      async () => {
        const { error } =
          await supabase.auth.signOut();

        if (error) {
          alert(
            'ログアウトに失敗しました'
          );
        }
      };

    /* ========================================
       保存処理
    ======================================== */

    /**
     * 授業保存
     * 新規追加・編集の両方に対応
     */
    const handleSaveLesson =
      async (
        formData: Partial<Lesson>
      ) => {

        /**
         * 現在ユーザー取得
         */
        const {
          data: userData,
        } =
          await supabase.auth.getUser();

        /**
         * 未ログインなら終了
         */
        if (!userData.user)
          return;

        /**
         * zoomInfo を分離
         */
        const {
          zoomInfo,
          ...rest
        } = formData;

        /**
         * Supabase保存用データ
         */
        const payload = {
          ...rest,

          user_id:
            userData.user.id,

          /**
           * 編集時は既存id優先
           */
          id:
            formData.id ||
            editingLesson?.id ||
            `${formData.day}-${formData.period}-${Date.now()}`,

          /**
           * camelCase → snake_case
           */
          zoom_info:
            zoomInfo,
        };

        /**
         * upsert:
         * 存在すれば更新
         * 無ければ追加
         */
        const { error } =
          await supabase
            .from('lessons')
            .upsert(payload);

        if (error) {
          console.error(
            '保存エラー:',
            error.message
          );

          alert(
            '変更の保存に失敗しました'
          );

          return;
        }

        /**
         * モーダル閉じる
         */
        setIsModalOpen(false);

        setEditingLesson(
          undefined
        );

        /**
         * データ再取得
         */
        await fetchTimetable();
      };

    /* ========================================
       削除処理
    ======================================== */

    /**
     * 授業削除
     */
    const handleDeleteLesson =
      async (id: string) => {

        /**
         * 削除確認
         */
        if (
          !window.confirm(
            'この授業を削除しますか？'
          )
        ) {
          return;
        }

        const { error } =
          await supabase
            .from('lessons')
            .delete()
            .eq('id', id);

        if (!error) {

          /**
           * モーダル閉じる
           */
          setIsModalOpen(false);

          setEditingLesson(
            undefined
          );

          /**
           * 再取得
           */
          await fetchTimetable();
        }
      };

    /* ========================================
       現在日時関連
    ======================================== */

    /**
     * 今日の曜日
     */
    const today =
      getTodayDayOfWeek();

    /**
     * 現在時刻（分）
     */
    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    /* ========================================
       コピー処理
    ======================================== */

    /**
     * クリップボードコピー
     */
    const handleCopy = (
      text: string
    ) => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            alert(
              `コピーしました: ${text}`
            );
          })
          .catch(() => {
            alert(
              'コピーに失敗しました'
            );
          });
      }
    };

    /* ========================================
       現在の注目時限取得
    ======================================== */

    /**
     * 現在授業中の時限
     * または次の授業時限
     */
    const getHighlightPeriod =
      (): number | null => {

        /**
         * 今日の授業一覧
         */
        const classes =
          timetableData
            .filter(
              d =>
                d.day ===
                today
            )
            .sort(
              (a, b) =>
                a.period -
                b.period
            );

        for (const c of classes) {
          const t =
            periodTimeDetails[
              c.period
            ];

          if (!t) continue;

          /**
           * 授業中
           */
          if (
            currentMinutes >=
              toMinutes(
                t.start
              ) &&
            currentMinutes <=
              toMinutes(
                t.end
              )
          ) {
            return c.period;
          }

          /**
           * 次の授業
           */
          if (
            currentMinutes <
            toMinutes(
              t.start
            )
          ) {
            return c.period;
          }
        }

        return null;
      };

    /**
     * 現在注目中時限
     */
    const currentPeriod =
      getHighlightPeriod();

    /* ========================================
       次の登校日情報
    ======================================== */

    /**
     * 本日終了後に
     * 次の登校日情報を取得
     */
    const getNextSchoolDayInfo =
      (
        allData: Lesson[]
      ) => {

        /**
         * 授業対象曜日
         */
        const daysOrder = [
          '月',
          '火',
          '水',
          '木',
          '金',
        ];

        const todayIndex =
          daysOrder.indexOf(
            today
          );

        /**
         * 最大5日先まで探索
         */
        for (
          let i = 1;
          i <= 5;
          i++
        ) {

          const nextDay =
            daysOrder[
              (todayIndex +
                i) %
                5
            ];

          /**
           * 休憩以外の授業
           */
          const classes =
            allData
              .filter(
                d =>
                  d.day ===
                    nextDay &&
                  d.type !==
                    '休憩'
              )
              .sort(
                (a, b) =>
                  a.period -
                  b.period
              );

          if (
            classes.length > 0
          ) {

            const first =
              classes[0];

            const last =
              classes[
                classes.length -
                  1
              ];

            /**
             * 開始終了時間
             */
            const startTime =
              periodTimeDetails[
                first.period
              ]?.start ||
              '-';

            const endTime =
              periodTimeDetails[
                last.period
              ]?.end || '-';

            /**
             * 持ち物一覧
             * 重複除去
             */
            const belongingsList =
              classes
                .flatMap(
                  c =>
                    c.belongings ||
                    []
                )
                .filter(
                  (
                    v,
                    idx,
                    arr
                  ) =>
                    arr.indexOf(
                      v
                    ) === idx
                );

            return {
              day: nextDay,

              period:
                first.period,

              time: `${startTime} ~ ${endTime}`,

              subject:
                first.subject,

              room:
                first.room,

              belongings:
                belongingsList,
            };
          }
        }

        return null;
      };

    /* ========================================
       ステータス表示テキスト
    ======================================== */

    /**
     * 画面上部の現在状況文生成
     */
    const renderNowInfoText =
      (): string => {

        /**
         * 現在時刻文字列
         */
        const timeStr = `${padZero(
          now.getHours()
        )}:${padZero(
          now.getMinutes()
        )}`;

        let text = `現在時刻：${timeStr}（${today}）`;

        /**
         * 今日の授業一覧
         */
        const todayClasses =
          timetableData
            .filter(
              d =>
                d.day ===
                today
            )
            .sort(
              (a, b) =>
                a.period -
                b.period
            );

        let isStatusSet =
          false;

        for (const c of todayClasses) {

          const t =
            periodTimeDetails[
              c.period
            ];

          if (!t) continue;

          /**
           * 授業中
           */
          if (
            currentMinutes >=
              toMinutes(
                t.start
              ) &&
            currentMinutes <=
              toMinutes(
                t.end
              )
          ) {

            /**
             * 休憩中
             */
            if (
              c.type ===
              '休憩'
            ) {

              const nextClass =
                todayClasses.find(
                  n =>
                    n.period >
                      c.period &&
                    n.type !==
                      '休憩'
                );

              if (nextClass) {

                const nextTime =
                  periodTimeDetails[
                    nextClass
                      .period
                  ];

                text += ` / 休憩中 / 次は ${nextClass.period}限 ${nextClass.subject}（${nextTime?.start || ''}〜）`;

              } else {

                text += ` / 休憩中`;
              }

            } else {

              /**
               * 通常授業中
               */
              text += ` / 今は ${c.period}限 ${c.subject}（${c.room}）`;
            }

            isStatusSet =
              true;

            break;
          }

          /**
           * 次の授業
           */
          if (
            currentMinutes <
            toMinutes(
              t.start
            )
          ) {

            text += ` / 次は ${c.period}限 ${c.subject}（${c.room}） ${t.start} 〜`;

            isStatusSet =
              true;

            break;
          }
        }

        /**
         * 本日授業終了
         */
        if (!isStatusSet) {

          const nextDayInfo =
            getNextSchoolDayInfo(
              timetableData
            );

          if (nextDayInfo) {

            text += ` / 🎉 お疲れ様でした！ 次は ${nextDayInfo.day} ${nextDayInfo.period}限 ${nextDayInfo.subject}（${nextDayInfo.time}）＠${nextDayInfo.room}`;

            /**
             * 持ち物表示
             */
            if (
              nextDayInfo
                .belongings
                .length > 0
            ) {

              text += ` / 🎒 持ち物：${nextDayInfo.belongings.join(
                '・'
              )}`;
            }

          } else {

            text +=
              ' / 🎉 お疲れ様でした！';
          }
        }

        return text;
      };

    /* ========================================
       カード表示データ生成
    ======================================== */

    /**
     * カード表示用授業一覧
     */
    const getCardDisplayData =
      (): Lesson[] => {

        /**
         * 今日の授業
         */
        const todayClasses =
          timetableData
            .filter(
              d =>
                d.day ===
                today
            )
            .sort(
              (a, b) =>
                a.period -
                b.period
            );

        /**
         * 終了していない授業
         */
        const remainingClasses =
          todayClasses.filter(
            c => {

              const t =
                periodTimeDetails[
                  c.period
                ];

              if (!t)
                return false;

              return (
                currentMinutes <=
                toMinutes(
                  t.end
                )
              );
            }
          );

        let baseData: Lesson[];

        /**
         * 本日の残り授業
         */
        if (
          remainingClasses.length >
          0
        ) {

          baseData =
            remainingClasses;

        } else {

          /**
           * 次の登校日
           */
          const nextDayInfo =
            getNextSchoolDayInfo(
              timetableData
            );

          if (!nextDayInfo)
            return [];

          baseData =
            timetableData
              .filter(
                d =>
                  d.day ===
                  nextDayInfo.day
              )
              .sort(
                (a, b) =>
                  a.period -
                  b.period
              );
        }

        /**
         * 現在時限が無ければそのまま返す
         */
        if (!currentPeriod)
          return baseData;

        /**
         * 現在時限位置
         */
        const index =
          baseData.findIndex(
            d =>
              d.period ===
              currentPeriod
          );

        if (index === -1)
          return baseData;

        /**
         * 現在授業を先頭へ移動
         */
        return [
          ...baseData.slice(
            index
          ),

          ...baseData.slice(
            0,
            index
          ),
        ];
      };

    /**
     * 実際に表示するカード
     */
    const displayedCards =
      getCardDisplayData();

    /* ========================================
       ローディング画面
    ======================================== */

    if (loading) {
      return (
        <S.Container>
          <S.NoClassMessage>
            読み込み中...
          </S.NoClassMessage>
        </S.Container>
      );
    }

    /* ========================================
       メイン描画
    ======================================== */

    return (
      <S.Container>

        {/* 現在情報ヘッダー */}
        <StatusHeader
          nowInfoText={renderNowInfoText()}
        />

        {/* ========================================
            表示切替タブ
        ======================================== */}

        <S.TabContainer>

          {/* カード表示 */}
          <S.TabButton
            $active={
              viewMode ===
              'card'
            }
            onClick={() =>
              setViewMode(
                'card'
              )
            }
          >
            📱 本日の予定
          </S.TabButton>

          {/* テーブル表示 */}
          <S.TabButton
            $active={
              viewMode ===
              'table'
            }
            onClick={() =>
              setViewMode(
                'table'
              )
            }
          >
            📅 一週間の一覧
          </S.TabButton>

        </S.TabContainer>

        {/* ========================================
            表示切替
        ======================================== */}

        {viewMode ===
        'card' ? (

          /**
           * カード表示
           */
          <S.CardList>

            {displayedCards.length ===
            0 ? (

              <S.NoClassMessage>
                直近の予定はありません
              </S.NoClassMessage>

            ) : (

              displayedCards.map(
                (
                  lesson,
                  index
                ) => (

                  <LessonCard
                    key={
                      lesson.id
                    }
                    lesson={
                      lesson
                    }

                    /**
                     * 先頭カードを強調
                     */
                    isMainCard={
                      index ===
                      0
                    }

                    periodTimeDetails={
                      periodTimeDetails
                    }

                    handleCopy={
                      handleCopy
                    }

                    /**
                     * 編集開始
                     */
                    onEdit={lesson => {
                      setEditingLesson(
                        lesson
                      );

                      setIsModalOpen(
                        true
                      );
                    }}
                  />
                )
              )
            )}

          </S.CardList>

        ) : (

          /**
           * テーブル表示
           */
          <TimetableMatrix
            timetableData={
              timetableData
            }

            today={today}

            currentPeriod={
              currentPeriod
            }

            periodTimeDetails={
              periodTimeDetails
            }

            /**
             * セル編集
             */
            onEdit={(target) => {
              setEditingLesson(target);

              setIsModalOpen(true);
            }}
          />
        )}

        {/* ========================================
            新規追加ボタン
        ======================================== */}

        <S.TabButton
          $active={true}
          onClick={() => {

            /**
             * 新規追加なので undefined
             */
            setEditingLesson(
              undefined
            );

            setIsModalOpen(
              true
            );
          }}

          style={{
            margin: '16px 0'
          }}
        >
          + 新しい授業を追加
        </S.TabButton>

        {/* ========================================
            ログアウト
        ======================================== */}

        <S.LogoutButton
          onClick={
            handleLogout
          }
        >
          ログアウト
        </S.LogoutButton>

        {/* ========================================
            編集モーダル
        ======================================== */}

        <EditLessonModal
          /**
           * モーダル再生成用key
           */
          key={editingLesson?.id || 'new'}

          isOpen={isModalOpen}

          initialData={
            editingLesson
          }

          /**
           *\ 閉じる
           */
          onClose={() => {

            setIsModalOpen(
              false
            );

            setEditingLesson(
              undefined
            );
          }}

          /**
           * 保存
           */
          onSave={
            handleSaveLesson
          }

          /**
           * 削除
           */
          onDelete={
            handleDeleteLesson
          }
        />

      </S.Container>
    );
  };