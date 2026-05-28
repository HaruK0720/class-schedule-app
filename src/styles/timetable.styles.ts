import styled, { css } from 'styled-components';

/**
 * 授業カード用のProps
 * $lessonType:
 *   - オンライン
 *   - 休憩
 * など授業タイプによって見た目を切り替える
 *
 * $isMainCard:
 * 現在の授業など、強調表示したいカードかどうか
 */
interface CardProps {
  $lessonType?: string;
  $isMainCard?: boolean;
}

/**
 * 時間割セル用のProps
 * $isActiveCell:
 * 現在の授業セルかどうか
 *
 * $isTodayColumn:
 * 今日の曜日列かどうか
 *
 * $hasItem:
 * 授業データが存在するかどうか
 *
 * $itemType:
 * オンライン・休憩などの種類
 */
interface CellProps {
  $isActiveCell?: boolean;
  $isTodayColumn?: boolean;
  $hasItem?: boolean;
  $itemType?: string;
}

/* ========================================
   アプリ全体レイアウト
======================================== */

/**
 * 全体コンテナ
 * モバイル中心の幅制限レイアウト
 */
export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

/**
 * ヘッダーエリア
 */
export const Header = styled.header`
  h1 {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--text-h);
  }
`;

/* ========================================
   現在情報バー
======================================== */

/**
 * 現在時刻や現在授業などを表示するバー
 */
export const NowInfoBar = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--text-h);
  background-color: var(--code-bg);
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  margin-bottom: 16px;
`;

/* ========================================
   タブUI
======================================== */

/**
 * タブ全体のコンテナ
 */
export const TabContainer = styled.div`
  display: flex;
  background-color: var(--border);
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

/**
 * タブボタン
 * $active に応じて色を変更
 */
export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: none;
  border: none;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: bold;

  color: ${props => (props.$active ? '#fff' : 'var(--text)')};

  background-color: ${props =>
    (props.$active ? '#3b82f6' : 'transparent')};

  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  box-shadow: ${props =>
    (props.$active
      ? '0 2px 4px rgba(0, 0, 0, 0.1)'
      : 'none')};
`;

/* ========================================
   カード一覧
======================================== */

/**
 * 授業カード一覧
 */
export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/**
 * 授業が存在しない場合のメッセージ
 */
export const NoClassMessage = styled.p`
  text-align: center;
  padding: 40px 20px;
  color: var(--text);
  font-size: 0.95rem;
`;

/* ========================================
   授業カード
======================================== */

/**
 * 授業カード本体
 *
 * 条件によって背景色や強調表示を変更
 */
export const LessonCardWrapper = styled.div<CardProps>`
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: var(--bg);

  /**
   * オンライン授業
   */
  ${props => props.$lessonType === 'オンライン' && css`
    background-color: rgba(37, 99, 235, 0.08);
  `}

  /**
   * 休憩
   */
  ${props => props.$lessonType === '休憩' && css`
    background-color: rgba(234, 179, 8, 0.15);
  `}

  /**
   * 現在授業などのメインカード強調
   */
  ${props => props.$isMainCard && css`
    border-color: #ef4444;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    transform: scale(1.01);
  `}
`;

/**
 * カード上部
 * 曜日・時限・時間などを配置
 */
export const LessonCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

/**
 * 曜日＋時限タグ
 */
export const DayPeriodTag = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-h);
`;

/**
 * 授業時間タグ
 */
export const TimeTag = styled.span`
  font-size: 0.8rem;
  color: var(--text);
`;

/**
 * 授業名
 */
export const LessonSubject = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: var(--text-h);
`;

/**
 * 教室や担当教員などのメタ情報
 */
export const LessonMetaInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 6px;
`;

/**
 * 持ち物表示エリア
 */
export const LessonBelongings = styled.div`
  font-size: 0.85rem;
  color: #c2410c;
  background-color: #fff7ed;
  padding: 6px 10px;
  border-radius: 6px;
  margin-top: 8px;
  border: 1px solid #ffedd5;
`;

/* ========================================
   Zoom関連
======================================== */

/**
 * Zoom情報全体
 */
export const ZoomSection = styled.div`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * Zoom参加ボタン
 */
export const ZoomJoinButton = styled.a`
  display: block;
  text-align: center;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95rem;
  padding: 10px;
  border-radius: 6px;

  &:hover {
    background-color: #1d4ed8;
  }
`;

/**
 * コピー用ボタン群
 * ID / パスコードなどをコピー
 */
export const CopyButtonGroup = styled.div`
  display: flex;
  gap: 6px;

  button {
    flex: 1;
    background-color: var(--bg);
    border: 1px solid var(--border);
    color: var(--text-h);
    padding: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: var(--code-bg);
    }
  }
`;

/* ========================================
   テーブル表示（時間割マトリクス）
======================================== */

/**
 * 時間割テーブル全体
 */
export const TableViewContainer = styled.div`
  background-color: var(--bg);
  border-radius: 12px;
  padding: 12px;
  box-shadow: var(--shadow);
  overflow-x: auto;
`;

/**
 * 時間割テーブル
 */
export const TimetableMatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  text-align: center;
  table-layout: fixed;
  min-width: 300px;

  th, td {
    border: 1px solid var(--border);
    padding: 4px 2px;
    vertical-align: middle;
  }

  /**
   * ヘッダーセル
   */
  th {
    background-color: rgba(120, 120, 120, 0.14);
    color: var(--text-h);
    font-weight: bold;
  }

  /**
   * 左端の時限列幅
   */
  th:first-child {
    width: 30px;
  }
`;

/**
 * 今日の曜日ヘッダー強調
 */
export const HighlightDayHeader = styled.th`
  color: #2563eb !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
`;

/**
 * 時限列
 * 1限・2限など
 */
export const PeriodCol = styled.td`
  background-color: rgba(120, 120, 120, 0.12);
  width: 30px;

  strong {
    display: block;
    font-size: 0.85rem;
    color: var(--text-h);
  }

  small {
    display: block;
    font-size: 0.65rem;
    color: var(--text);
    margin-top: 2px;
  }
`;

/**
 * 時間割セル
 *
 * 状態によって背景や枠線を変更
 */
export const TableCell = styled.td<CellProps>`
  background-color: ${props =>
    props.$hasItem
      ? 'var(--bg)'
      : 'rgba(120,120,120,0.08)'};

  /**
   * オンライン授業
   */
  ${props => props.$itemType === 'オンライン' && css`
    background-color: rgba(37, 99, 235, 0.08);
  `}

  /**
   * 休憩
   */
  ${props => props.$itemType === '休憩' && css`
    background-color: rgba(234, 179, 8, 0.15);
  `}

  /**
   * 現在授業セル強調
   */
  ${props => props.$isActiveCell && css`
    outline: 2.5px solid #ef4444;
    outline-offset: -2.5px;
    font-weight: bold;
  `}
`;

/**
 * セル内部コンテンツ
 */
export const TableCellContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * 科目名
 */
export const TableSubject = styled.span`
  font-weight: 600;
  color: var(--text-h);
  font-size: 0.75rem;
`;

/**
 * 教室名
 */
export const TableRoom = styled.span`
  font-size: 0.7rem;
  color: var(--text);
`;

/* ========================================
   ログアウトボタン
======================================== */

/**
 * ログアウトボタン
 */
export const LogoutButton = styled.button`
  width: 100%;
  padding: 12px;

  /* 他要素との余白 */
  margin-top: 40px;
  margin-bottom: 20px;

  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text);

  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  transition: all 0.2s;

  &:hover {
    background-color: var(--code-bg);
    color: var(--text-h);
  }
`;