+++
author = "Katsuya Endoh"
title = "OSC Broadcasterを作った話"
date = "2023-04-18"
description = "OSCをブロードキャストするサーバを立ち上げるコマンドを作った"
tags = [
    "Rust",
    "OSC",
]
+++

<!--more-->

# 前書き

この記事は **現在も編集中** です。

随時更新予定なので抜けている情報があります。

# 成果物

コマンドラインからOSCをブロードキャストするサーバを立ち上げるツール[osc_broadcaster](https://github.com/enkatsu/osc_broadcaster)を作成しました。

## インストール

以下の三つの方法があります。

- Homebrewでインストール
- ビルド済みファイルをダウンロード
- ソースコードをビルドしてインストール

### Homebrewからインストール

```sh
brew tap enkatsu/osc_broadcaster
brew install osc_broadcaster
```

### ビルド済みファイルをダウンロード

[こちら](https://github.com/enkatsu/osc_broadcaster/releases)からダウンロードできます。

### ソースコードをビルドしてインストール

```sh
cargo install
```

## 使い方

使い方はこんな感じです。

```txt
USAGE:
    osc_broadcaster [OPTIONS]

OPTIONS:
    -h, --help                                     Print help information
    -i, --listen-ip-address <LISTEN_IP_ADDRESS>    [default: 0.0.0.0]
    -l, --listen-port <LISTEN_PORT>                [default: 32000]
    -s, --send-port <SEND_PORT>                    [default: 12000]
    -V, --version                                  Print version information
```

## 接続

サーバにOSCアドレス `/server/connect` でメッセージを送信すると、
サーバが保持している接続済みクライアントリストに登録されます。

```txt
(osc_broadcaster) <-{ port: 32000, OSC: /server/connect }- (client)
```

## OSCメッセージ配信

接続後にOSCメッセージを送信すると、
自身を含む接続済みクライアントにOSCメッセージが配信されます。

```txt
# Send from client
(osc_broadcaster) <-{ port: 32000, OSC: /your/osc/addr "hello" }- (client)
```

```txt
# Send to client
(osc_broadcaster) -{ port: 12000, OSC: /your/osc/addr "hello" }-> (client)
```

## 切断

サーバにOSCアドレス `/server/disconnect` でメッセージを送信すると、
サーバが保持している接続済みクライアントリストから削除されます。

```txt
(osc_broadcaster) <-{ port: 32000, OSC: /server/disconnect }- (client)
```

# 作った経緯

一台のマシンからOSCを送信して、
複数台のマシンを一括制御する相談を受けたので、
「そういえばProcessingにOSCをブロードキャストするツールがあったな」と思い、
ちゃんと調査してみました。

この二つが[oscP5](https://sojamo.de/libraries/oscP5/#about)のブロードキャストのサンプルです。
- [oscP5broadcaster.pde](https://sojamo.de/libraries/oscP5/examples/oscP5broadcaster/oscP5broadcaster.pde)
- [oscP5broadcastClient.pde](https://sojamo.de/libraries/oscP5/examples/oscP5broadcastClient/oscP5broadcastClient.pde)

実は以前に会社の勉強会用に
[PHPでOSCライブラリを実装する](https://github.com/enkatsu/php-osc)
という苦行を経験していたので、今回は新しくOSCに関する調査はあまり必要ではありませんでした。

# ブロードキャストの仕組み

ブロードキャストの仕組みは[成果物](#成果物)の項目で説明した通りです。
接続用OSCメッセージ（`/server/connect`）を受信した際に、
UDPパケットから送信元のIPアドレスを取得して、配信先アドレスに登録していきます。

切断用OSCメッセージ（`/server/disconnect`）を受信すると、
UDPパケットから送信元のIPアドレスを取得して、配信先アドレスから削除します。

接続用OSCメッセージ か 切断用OSCメッセージ 意外のOSCメッセージを受け取ると、
配信先アドレスに記録してあるクライアント全体受け取ったOSCメッセージを送信します。

**TODO**

図を入れて説明

# 実装

最初はPythonで実装しようと思いました。
ですが、配布後に手軽に実行できることを考えて、C/C++やJavaあたりを使おうと考えました。
結果、Rustにいい感じのOSCライブラリがあったのを思い出したので、
今回は勉強も兼ねてRustで実装することにしました。

OSCライブラリは[rosc](https://github.com/klingtnet/rosc)、
実行時のオプション解析は[clap](https://github.com/clap-rs/clap)が
サポートも続いていそうだったので採用しました。

# 今後の展望

- 配信グループ機能の実装
    - `/server/connect ${GROUP_ID}` とかで特定のグループに接続できる
    - `/server/groups` でグループ一覧を返してくれる
- TCPを使ったOSCにも対応
