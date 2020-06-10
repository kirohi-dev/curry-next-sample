# curry next sample

カレーをオンラインで売っているショップをnextで作る。
nextをまともに触ったことがないので練習です。

フレームワーク: next
実行環境: docker-compose
ルール: eslint, prettier

## 公式チュートリアル

https://reactjs.org/tutorial/tutorial.html

### nextのセットアップ

```
yarn create next-app
```

### typescript化

### Pre-rendering

データをfetchしてHTMLを吐き出す方法をがいくつかある。

**Static Generation**

HTMLをビルド時に吐き出す。

#### getStaticProps

propsでrenderに渡す。
```
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>
          <h3>{post.filename}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

```
// in TS
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}
```

※Next.jsはコードを別のディレクトリにコンパイルするので__dirnameで返されるパスはページディレクトリとは異なる。
※代わりに 'process.cwd()' を使うことでNext.jsが実行されているディレクトリを提供することができる。


#### getStaticProps

動的パスを使用する場合’に、ビルド時にレンダリングするパスを生成する。

```
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // See the "paths" section below
    ],
    fallback: true or false // See the "fallback" section below
  };
}
```
`fallback`キー
必須のキーで、ページパス以外のページに行く場合には404ページにリダイレクトするかどうか判断する。

```
// TS
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}
```


**server side rendering**

リクエスト毎にHTMLを吐き出す。

#### getServerSideProps

```
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

```
// IN TS
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
}
```

プロップに対して型定義したい場合

```
import { InferGetServerSidePropsType } from 'next'

type Data = { ... }

export const getServerSideProps = async () => {
  const res = await fetch('https://.../data')
  const data: Data = await res.json()

  return {
    props: {
      data,
    },
  }
}

function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // will resolve posts to type Data
}

export default Page
```

**client side rendering**

SEOに関係のないページでかつ、値の変更が頻繁に起こる場合に使う。
ユーザー固有のデータを表示する場合などに使える。

- ページの一部を静的生成する。
- クライアント側でデータをフェッチし、準備ができたら表示する

#### SWR

```
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

### 組み込みCSS

**global css**

importすることができる。
グローバルで使う場合は、`pages/_app.js`でimportする。

**コンポーネント単位でのcss**

`.module.css`拡張子のみサポートされている。

**sassを使う場合**

`next.config.js`にオプションを追加する。

```
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

**css in js**


### 静的ファイルサービス

`public`から提供される。
`public`からルートに配置しないといけない。

`public/my-image.png`の場合。

```
function MyImage() {
  return <img src="/my-image.png" alt="my image" />
}

export default MyImage
```

`robot.txt`や `.html`なども入る。

### Type Script

ルートに `tsconfig.json`を作成する。
next.jsは `babel`を使ってTypeScriptを処理する。
`typescript` `@types/react` `@types/node`パッケージをインストール
`js`を `tsx`に変換。
`next-env.d.ts`がNext.jsのタイプ。
`tsconfig.json` `paths` `baseUrl`に自動的にサポートされる。

```
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
}
```

#### カスタムAPP

`page/_app.tsx`は次のように書き換える

```
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
```

### 環境変数

`process.env`の`.evn.local`をサポートしている。

`.evn.local`
```
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```
これで `process.env.DB_HOST`や`process.evn.DB_USER` `process.env.DB_PASS`を使える。

```
// pages/index.js
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

#### ローカルの中で環境変数を使いたいのなら

環境変数はサーバーサイドで動く。
ローカルで動かす場合は、`NEXT_PUBLIC_` を使う。

```
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

```
// pages/index.js
import setupAnalyticsService from '../lib/my-analytics-service'

// NEXT_PUBLIC_ANALYTICS_ID can be used here as it's prefixed by NEXT_PUBLIC_
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

#### 環境変数の使い分け

`.env`(全ての環境)、 `.env.development`(開発環境)、 `.evn.production`(本番環境)をデフォルトで使うことができる。

### ルーティング

**動的ルーティング**

`[]`動的なパラメータを入れることができる。

```
pages/blog/[slug].js -> /blog/:slug
```

**ページ間リンク**

`Link`コンポーネントを使うことでクライアント側で遷移をさせることができる。

- href: `pages`内のページ名
- as : ブラウザに表示されるURL

```
function Home({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

**ルーターの注入**

`useRouter`を使うことでReactコンポーネントに注入することができる。

### 動的にコンポーネントを読み込み

`next/dynamic`を使うことでできる。

```
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)

function Home() {
  return (
    <div>
      <Header />
      <DynamicComponent />
      <p>HOME PAGE is here!</p>
    </div>
  )
}

export default Home
```

**読み込み中を表示**

```
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
  () => import('../components/hello'),
  { loading: () => <p>...</p> } // use loading
)

function Home() {
  return (
    <div>
      <Header />
      <DynamicComponentWithCustomLoading />
      <p>HOME PAGE is here!</p>
    </div>
  )
}

export default Home
```

**SSRなし**

```
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/hello3'),
  { ssr: false }
)

function Home() {
  return (
    <div>
      <Header />
      <DynamicComponentWithNoSSR />
      <p>HOME PAGE is here!</p>
    </div>
  )
}

export default Home
```

### AMP(アンプ)
サーバーからHTMLを読み取るのではなく、googleのキャッシュから読み取るから早い。

Next.jsでは最小限の構成でReactを離れる事なく、任意のページをAMPに変換できる。

### babel

`.babelrc`を使って拡張することができる。
その場合は`next/babel`をプリセットとして読み込ませる必要がある。

```
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ],
  "plugins": []
}
```

### カスタムサーバー

`next start`で起動するサーバーをカスタマイズできる。
`server.js`を用意し、package.jsonを`next start`から`node server.js`にする。
基本babelを通らない。あまり推奨されていない。

### カスタムAPP

Next.jsは `App`コンポーネントを使用してページの初期化をする。
これをオーバーライドすることで初期化を制御することができる。
サーバーでもクライアントでも動く。

- ページ遷移間でのlayoutの永続化
- ページ間での状態の維持
- 共通のエラー処理の導入
- 追加のデータをページに挿入する
- グローバルCSSを追加

`./pages/_app.js`を使うことでオーバーライドできる。

データに責務をおく。

```
// import App from 'next/app'

function MyApp({ Component, pageProps }) {
  // クラスをinjectするときはここに入れれば良さげ？
  // storeを参考にする
  return <Component {...pageProps} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
```

### カスタム Document

<html>と<body>タグを拡張するために使う。
これらはNext.jsページが周囲のドキュメントのマークアップの定義をスキップするために必要です。
サーバーサイドでのみ実行される。イベントハンドラは実行されない。

```
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

**getInitialProps**

`getInitialProps`は`context`を受け取る。

- `pathname` - Current route. That is the path of the page in `/pages`
- `query` - Query string section of URL parsed as an object
- `asPath` - `String` of the actual path (including the query) shown in the browser
- `req` - HTTP request object (server only)
- `res` - HTTP response object (server only)
- `err` -  Error object if any error is encountered during the rendering

コンポーネントでそれぞれの `プロパティ` を受け取る。

テンプレートに責務をおく。

### 404ページ

**404エラー**

`pages/404.js`ファイルを作成する。

```
// pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

**500エラー**

`pages/_error.js`ファイルを作成する。

```
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

### srcディレクトリ

`pages`に `src`ディレクトリを追加することができる.
`pages` -> `src/pages`になる。

### 性能測定ができる

カスタムAppコンポーネントを作成して `reportWebVitals`関数を定義する必要がある。

```
// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric)
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

なんか色々確認できる。https://nextjs.org/docs/advanced-features/measuring-performance

### デバックモード

Node.jsアプリケーションだから `--inspect`フラグを渡して起動すればOK

```
NODE_OPTIONS='--inspect' next dev
```

package.jsonに
```
"dev": "NODE_OPTIONS='--inspect' next dev"
```
https://developers.google.com/web/tools/chrome-devtools/javascript

### styled component

```
// styled-components以前
<Button className='button'></Button>
<Button className='button button--primary'></Button>

// styled-components
<Button><Button/>
<Button primary></Button>
```

### propsの使い分け

|| サーバーサイド | クライアントサイド | 実行タイミング |
--- | --- | --- | ----
| getStaticProps | ◯ | ✗ | ビルド時 (+ fallback=trueならリクエストに応じて) |
| getStaticPaths | ◯ | ✗ | ビルド時のみ |
| getServerSideProps | ◯ | ✗ | リクエストに応じて |
| getInitialProps | ◯ | ◯ | リクエストに応じて |
