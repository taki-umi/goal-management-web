# 目標管理アプリケーション（Goal Achieve）README

## プロジェクト概要

Goal Achieveは、ユーザーが個人の目標を設定し、進捗を管理するためのWebアプリケーションです。ユーザーはゴールを作成し、階層構造（大目標→中目標→小目標）で整理しながら進捗を追跡できます。

## 技術要件

### フロントエンド

- **フレームワーク**: Next.js (App Routerを採用)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **フォーム処理**: TurboPack
- **HTTPクライアント**: Axios
- **アイコン**: React Icons
- **日付操作**: Day.js

### バックエンド (既存)

- **言語**: Kotlin
- **フレームワーク**: Spring Boot
- **データベース**: PostgreSQL (開発環境はH2 in-memory DB)
- **API**: RESTful API

## 必要画面

1. **ログイン画面** (`/login`)
   - 簡易的なログインフォーム（開発用）
   - ユーザー名入力のみ（「admin」でログインすると管理者権限を付与）

2. **ダッシュボード画面** (`/`)
   - ゴール一覧表示
   - ステータス別フィルタリング（ACTIVE, COMPLETED, ARCHIVED）
   - 進捗状況の可視化（円グラフまたはプログレスバー）
   - おすすめゴール提案表示

3. **ゴール作成画面** (`/goals/create`)
   - タイトル、説明、カテゴリー、目標日、親ゴールID入力フォーム

4. **ゴール詳細画面** (`/goals/[id]`)
   - ゴール情報詳細表示
   - 進捗更新機能
   - サブゴール一覧表示
   - 編集、アーカイブ、削除機能

## ディレクトリ構成

```
goal-achieve-frontend/
├── public/                  # 静的ファイル
├── src/
│   ├── app/                 # Appルーター (ページ)
│   │   ├── login/           # ログイン画面
│   │   │   └── page.tsx
│   │   ├── goals/           # ゴール関連ページ
│   │   │   ├── [id]/        # ゴール詳細
│   │   │   │   └── page.tsx
│   │   │   └── create/      # ゴール作成
│   │   │       └── page.tsx
│   │   ├── layout.tsx       # ルートレイアウト
│   │   └── page.tsx         # ダッシュボード (ホームページ)
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── auth/            # 認証関連
│   │   │   └── LoginForm.tsx
│   │   ├── goals/           # ゴール関連
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalList.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── layout/          # レイアウト
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/              # UIコンポーネント
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── lib/                 # ユーティリティ
│   │   ├── api/             # API関連
│   │   │   ├── client.ts    # Axiosクライアント
│   │   │   └── goals.ts     # ゴール関連API
│   │   ├── auth.ts          # 認証ヘルパー
│   │   └── utils.ts         # 汎用ユーティリティ
│   ├── types/               # 型定義
│   │   ├── goal.ts          # ゴール関連の型
│   │   └── auth.ts          # 認証関連の型
│   └── styles/              # スタイル (グローバルCSSなど)
│       └── globals.css
├── .env.local               # 環境変数
├── next.config.js           # Next.js設定
├── tailwind.config.js       # Tailwind CSS設定
├── tsconfig.json            # TypeScript設定
└── package.json             # 依存関係
```

## API利用方法

バックエンドAPIは以下のエンドポイントを提供します：

### ゴール管理API

- `GET /api/goals?userId={userId}` - ゴール一覧取得
- `GET /api/goals?userId={userId}&status={status}` - ステータスでフィルタリングしたゴール一覧取得
- `GET /api/goals/{id}` - 特定ゴール取得
- `POST /api/goals` - ゴール作成
- `PUT /api/goals/{id}` - ゴール更新
- `PATCH /api/goals/{id}/progress` - 進捗更新
- `PATCH /api/goals/{id}/archive` - ゴールアーカイブ
- `DELETE /api/goals/{id}` - ゴール削除（論理削除）
- `GET /api/goals/parent/{parentGoalId}` - サブゴール一覧取得

## 開発ガイドライン

1. **コンポーネント設計**
   - 再利用可能なコンポーネントは`components`ディレクトリに配置
   - ページに固有のコンポーネントはpage.tsxファイルに記述または`_components`フォルダに配置

2. **状態管理**
   - ローカルステートにはReact HooksのuseStateを使用
   - ページ間で共有する状態にはContextAPIを使用
   - 将来的にはReduxまたはZustandに移行予定

3. **認証**
   - 開発フェーズでは簡易的なログイン機能を使用
   - ユーザー名「admin」で管理者権限を付与
   - 本番環境ではJWT認証を実装予定

4. **エラーハンドリング**
   - APIリクエストエラーは適切にキャッチし、ユーザーフレンドリーなメッセージを表示
   - デバッグ情報はconsole.logではなくnext/loggerを使用

5. **レスポンシブデザイン**
   - モバイルファーストのアプローチで設計
   - Tailwind CSSのレスポンシブユーティリティを活用

## 将来の展望

1. **本格的な認証認可機能**
   - JWTまたはOAuth2を使用した認証の実装
   - ロールベースのアクセス制御

2. **リアルタイム機能**
   - WebSocketを使用したリアルタイム更新
   - 共同編集機能の実装

3. **分析・可視化機能**
   - ゴール達成率の統計表示
   - 時間管理分析グラフ
