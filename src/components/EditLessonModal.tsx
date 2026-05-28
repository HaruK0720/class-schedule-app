import React, {
  useState,
} from 'react';

import type { Lesson } from '../types/timetable';

import * as S from '../styles/timetable.styles';

import styled from 'styled-components';

/* ========================================
   styled-components
======================================== */

/**
 * モーダル背景
 * 画面全体を覆うオーバーレイ
 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.7);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;

  padding: 20px;

  box-sizing: border-box;
`;

/**
 * モーダル本体
 */
const ModalContent = styled.div`
  background: var(--bg);

  width: 100%;
  max-width: 500px;

  border-radius: 12px;
  padding: 20px;

  max-height: 90vh;
  overflow-y: auto;

  box-sizing: border-box;
`;

/**
 * 入力欄グループ
 */
const InputGroup = styled.div`
  margin-bottom: 16px;

  min-width: 0;

  label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 4px;

    color: var(--text);
  }

  input,
  select {
    width: 100%;
    padding: 10px;

    border-radius: 6px;
    border: 1px solid var(--border);

    background: var(--bg);
    color: var(--text-h);

    box-sizing: border-box;
    font-size: 1rem;

    min-width: 0;
  }
`;

/**
 * 横並びレイアウト
 * 曜日＋時限などで使用
 */
const FlexRow = styled.div`
  display: flex;
  gap: 12px;

  width: 100%;

  box-sizing: border-box;

  > * {
    flex: 1;
    min-width: 0;
  }
`;

/* ========================================
   Props型定義
======================================== */

interface Props {

  /**
   * モーダル開閉状態
   */
  isOpen: boolean;

  /**
   * 編集対象データ
   * undefined の場合は新規追加
   */
  initialData?: Partial<Lesson>;

  /**
   * モーダル閉じる
   */
  onClose: () => void;

  /**
   * 保存処理
   */
  onSave: (
    data: Partial<Lesson>
  ) => Promise<void>;

  /**
   * 削除処理
   */
  onDelete?: (
    id: string
  ) => Promise<void>;
}

/* ========================================
   初期フォームデータ
======================================== */

/**
 * 新規作成時の初期値
 */
const defaultFormData: Partial<Lesson> = {
  day: '月',
  period: 1,
  subject: '',
  room: '',
  teacher: '',
  type: '対面',
  belongings: [],
};

/* ========================================
   編集モーダル
======================================== */

export const EditLessonModal: React.FC<Props> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {

  /* ========================================
     フォーム状態
  ======================================== */

  /**
   * 入力フォームデータ
   *
   * initialData:
   *   編集時
   *
   * defaultFormData:
   *   新規追加時
   */
  const [
    formData,
    setFormData,
  ] = useState<
    Partial<Lesson>
  >(
    initialData ||
      defaultFormData
  );

  /* ========================================
     保存処理
  ======================================== */

  /**
   * フォーム送信
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    /**
     * ページリロード防止
     */
    e.preventDefault();

    /**
     * 親コンポーネントへ保存処理委譲
     */
    await onSave(
      formData
    );
  };

  /* ========================================
     モーダル非表示
  ======================================== */

  /**
   * 閉じている場合は描画しない
   */
  if (!isOpen) {
    return null;
  }

  /* ========================================
     JSX
  ======================================== */

  return (

    /**
     * 背景クリックで閉じる
     */
    <ModalOverlay
      onClick={onClose}
    >

      {/* ========================================
          モーダル本体
      ======================================== */}

      <ModalContent

        /**
         * モーダル内部クリック時
         * 背景クリック判定を止める
         */
        onClick={e =>
          e.stopPropagation()
        }
      >

        {/* タイトル */}
        <h2
          style={{
            marginBottom:
              '20px',
          }}
        >

          {formData.id
            ? '授業を編集'
            : '新しい授業を追加'}

        </h2>

        {/* ========================================
            フォーム
        ======================================== */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* ========================================
              曜日・時限
          ======================================== */}

          <FlexRow>

            {/* 曜日 */}
            <InputGroup>

              <label>
                曜日
              </label>

              <select
                value={
                  formData.day ||
                  '月'
                }

                onChange={e =>
                  setFormData({
                    ...formData,

                    day:
                      e.target
                        .value,
                  })
                }
              >

                {[
                  '月',
                  '火',
                  '水',
                  '木',
                  '金',
                ].map(d => (

                  <option
                    key={d}
                    value={d}
                  >
                    {d}
                  </option>

                ))}

              </select>

            </InputGroup>

            {/* 時限 */}
            <InputGroup>

              <label>
                時限
              </label>

              <input
                type="number"

                min="1"
                max="9"

                value={
                  formData.period ||
                  1
                }

                onChange={e =>
                  setFormData({
                    ...formData,

                    period:
                      parseInt(
                        e.target
                          .value
                      ),
                  })
                }
              />

            </InputGroup>

          </FlexRow>

          {/* ========================================
              授業名
          ======================================== */}

          <InputGroup>

            <label>
              授業名
            </label>

            <input
              type="text"

              required

              value={
                formData.subject ||
                ''
              }

              onChange={e =>
                setFormData({
                  ...formData,

                  subject:
                    e.target
                      .value,
                })
              }
            />

          </InputGroup>

          {/* ========================================
              教室
          ======================================== */}

          <InputGroup>

            <label>
              教室 / 場所
            </label>

            <input
              type="text"

              value={
                formData.room ||
                ''
              }

              onChange={e =>
                setFormData({
                  ...formData,

                  room:
                    e.target
                      .value,
                })
              }
            />

          </InputGroup>

          {/* ========================================
              担当教員
          ======================================== */}

          <InputGroup>

            <label>
              担当教員
            </label>

            <input
              type="text"

              value={
                formData.teacher ||
                ''
              }

              onChange={e =>
                setFormData({
                  ...formData,

                  teacher:
                    e.target
                      .value,
                })
              }
            />

          </InputGroup>

          {/* ========================================
              授業タイプ
          ======================================== */}

          <InputGroup>

            <label>
              授業タイプ
            </label>

            <select
              value={
                formData.type ||
                '対面'
              }

              onChange={e =>
                setFormData({
                  ...formData,

                  type:
                    e.target
                      .value,
                })
              }
            >

              <option value="対面">
                対面
              </option>

              <option value="オンライン">
                オンライン
              </option>

              <option value="休憩">
                休憩
              </option>

            </select>

          </InputGroup>

          {/* ========================================
              Zoom情報
          ======================================== */}

          {formData.type ===
            'オンライン' && (

            <div
              style={{
                marginTop:
                  '16px',

                padding:
                  '12px',

                border:
                  '1px solid var(--border)',

                borderRadius:
                  '8px',

                backgroundColor:
                  'var(--code-bg)',

                boxSizing:
                  'border-box',

                width: '100%',
              }}
            >

              {/* Zoom見出し */}
              <p
                style={{
                  fontSize:
                    '0.8rem',

                  fontWeight:
                    'bold',

                  marginBottom:
                    '12px',

                  color:
                    '#2563eb',
                }}
              >
                Zoom情報
              </p>

              {/* ========================================
                  Zoom URL
              ======================================== */}

              <InputGroup>

                <label>
                  Zoom URL
                </label>

                <input
                  placeholder="https://zoom.us/j/..."

                  value={
                    formData
                      .zoomInfo
                      ?.url || ''
                  }

                  onChange={e =>
                    setFormData({
                      ...formData,

                      zoomInfo: {
                        ...(formData.zoomInfo || {
                          meetingId:
                            '',

                          passcode:
                            '',
                        }),

                        url:
                          e.target
                            .value,
                      },
                    })
                  }
                />

              </InputGroup>

              {/* ========================================
                  ID・パスコード
              ======================================== */}

              <FlexRow>

                {/* ミーティングID */}
                <InputGroup>

                  <label>
                    ミーティングID
                  </label>

                  <input
                    placeholder="000 0000 0000"

                    value={
                      formData
                        .zoomInfo
                        ?.meetingId ||
                      ''
                    }

                    onChange={e =>
                      setFormData({
                        ...formData,

                        zoomInfo: {
                          ...(formData.zoomInfo || {
                            url: '',

                            passcode:
                              '',
                          }),

                          meetingId:
                            e.target
                              .value,
                        },
                      })
                    }
                  />

                </InputGroup>

                {/* パスコード */}
                <InputGroup>

                  <label>
                    パスコード
                  </label>

                  <input
                    placeholder="123456"

                    value={
                      formData
                        .zoomInfo
                        ?.passcode ||
                      ''
                    }

                    onChange={e =>
                      setFormData({
                        ...formData,

                        zoomInfo: {
                          ...(formData.zoomInfo || {
                            url: '',

                            meetingId:
                              '',
                          }),

                          passcode:
                            e.target
                              .value,
                        },
                      })
                    }
                  />

                </InputGroup>

              </FlexRow>

            </div>
          )}

          {/* ========================================
              ボタン群
          ======================================== */}

          <FlexRow
            style={{
              marginTop:
                '24px',
            }}
          >

            {/* キャンセル */}
            <div>

              <S.TabButton
                $active={
                  false
                }

                type="button"

                onClick={e => {

                  /**
                   * イベント伝播停止
                   */
                  e.stopPropagation();

                  onClose();
                }}

                style={{
                  background:
                    'var(--border)',

                  width:
                    '100%',
                }}
              >
                キャンセル
              </S.TabButton>

            </div>

            {/* 保存 */}
            <div>

              <S.TabButton
                $active={
                  true
                }

                type="submit"

                style={{
                  width:
                    '100%',
                }}
              >
                保存する
              </S.TabButton>

            </div>

          </FlexRow>

          {/* ========================================
              削除ボタン
          ======================================== */}

          {formData.id && (

            <button
              type="button"

              onClick={() =>
                onDelete?.(
                  formData.id!
                )
              }

              style={{
                width:
                  '100%',

                marginTop:
                  '10px',

                color:
                  '#ef4444',

                background:
                  'none',

                border:
                  'none',

                fontSize:
                  '0.8rem',

                cursor:
                  'pointer',
              }}
            >
              授業を削除する
            </button>
          )}

        </form>

      </ModalContent>

    </ModalOverlay>
  );
};