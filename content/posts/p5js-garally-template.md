+++
author = "Katsuya Endoh"
title = "p5.jsスケッチを溜めておくためのテンプレートリポジトリを作った"
date = "2023-01-02"
description = "p5.jsスケッチを溜めておくためのテンプレートリポジトリを作った"
tags = [
    "p5.js",
    "Gulp",
    "EJS",
]
+++

# 概要

前から、p5.jsのスケッチを溜めておくための、
HTML & JS テンプレートが欲しいと思っていたので作った。

[OpenProcessing](https://openprocessing.org/)を使えばいいとも思うけど、
OpenProcessingだとiframeを使っているからなのか、
うまく動かない場合があるし、セルフホスティングした方が使い勝手がいいことも多い。

# 使い方

[https://github.com/enkatsu/p5js-garally-template](https://github.com/enkatsu/p5js-garally-template)

上記のテンプレートリポジトリを使って、自分のリポジトリを作成する。
作ったリポジトリを、ローカルにクローンしてきたら、
下記のコマンドで依存パッケージをインストールする。

```bash
npm i
```

## スケッチを追加する

下記のコマンドで、新規のスケッチを追加できる。
`${SKETCH_TITLE}` にはスケッチのタイトルを入力する。

```bash
node commands.mjs sketch:add -t ${SKETCH_TITLE}
```

## 開発用サーバを起動

下記のコマンドで開発用サーバを起動できる。

```bash
npm start
```

[http://localhost:3000](http://localhost:3000)

を開くとスケッチの一覧を表示できる。

## ビルド

下記のコマンドでビルド結果が `./docs` に出力される。
`gulpfile.mjs` の `distDirectory` を変更すれば、出力先を変更できる。

```bash
npm run build
```

## まとめ

下記のURLが、実際にこのテンプレートを使ったリポジトリとWebページ。

[https://github.com/enkatsu/p5js-sketches](https://github.com/enkatsu/p5js-sketches)

[https://enkatsu.github.io/p5js-sketches/](https://enkatsu.github.io/p5js-sketches/)

今回はHTMLテンプレートエンジンにEJSを使った。
今の主流のテンプレートエンジンが何なのかわからないので、そのうち差し替えるかも。

あとは，テーマを設定できるようにしたいなーとも思ってる。

## 追記

スケッチのサムネイルを設定できるようにした。

スケッチのディレクトリに `thumbnail.png` が存在していたら、
スケッチ一覧画面に表示されるようにした。
存在していない場合は、No Image用の画像が表示される。

### テンプレートの更新を取り込む方法

以下の手順でテンプレートの変更を取り込める。

```bash
git remote add template git@github.enkatsu:enkatsu/p5js-garally-template.git
git fetch --all
git merge template/main --allow-unrelated-histories
```
