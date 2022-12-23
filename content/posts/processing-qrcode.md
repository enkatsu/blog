+++
author = "Katsuya Endoh"
title = "ProcessingでQRコードを使う"
date = "2022-12-22"
description = "ProcessingでQRコードを使う"
tags = [
    "Processing",
    "QR Code",
    "AR",
]
+++

# はじめに

ProcessingでQRコードを使う為のライブラリは有名なところだと、
Daniel Shiffmanの[qrcode-processing](https://shiffman.net/p5/qrcode-processing/)があります。
ですが今回は[ZXingP5](https://github.com/enkatsu/ZXingP5)という、Java製のQRコードライブラリ[ZXing](https://github.com/zxing/zxing)のProcessingラッパーを使います。

このライブラリの特徴はQRコードの左上、右上、左下にある四角形の座標が取得できることです。
大まかなQRコードの位置と大きさ、角度を取得することができます。
なので、このようにARマーカのようにQRコードを扱うことができます。
実はこのライブラリは自分が作ったので、コメントやIssueをいただけたら、
修正や改良をしたいと思います。

![zxingp5](/images/zxingp5.png)

# インストール

[ここ](https://github.com/enkatsu/ZXingP5/archive/master.zip)からZipをダウンロードして、解凍したディレクトリをZXingP5にリネームして、`PROCESSING_PATH/library` に配置、
もしくはターミナルで以下のコマンドを実行します。

```bash
cd PROCESSING_PATH/library
git clone https://github.com/enkatsu/ZXingP5.git
```

# 使い方

サンプルは3つ入っていて内容はこのようになっています。

- WriterSample: 文字列からQRコードのPImageを生成するサンプル
- ReaderSample: QRコードの映ったPImageから文字列を読み取るサンプル
- ReaderAdvancedSample: QRコードの映ったPImageから文字列と座標、大きさを読み取るサンプル

2018年1月にmakezine.jpさんで取り上げていただきました

[ProcessingでQRコードを読み書きする](https://makezine.jp/blog/2018/01/p5qr.html)
