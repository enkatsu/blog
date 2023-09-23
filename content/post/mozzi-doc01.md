+++
author = "Katsuya Endoh"
title = "Mozziのドキュメントを読みつつ翻訳する「Mozziについて」"
date = "2023-05-19"
description = "Mozziのドキュメントを読みつつ翻訳する「Mozziについて」"
tags = [
    "Arduino",
    "Mozzi",
]
+++

<!--more-->

[Mozzi](https://sensorium.github.io/Mozzi/)は、
サウンドアートなどのプロジェクトで頻繁に使われるArduinoライブラリです。

しかし、Hello, world! 的な日本語の資料と、
シンセサイザーを作成するような応用的な日本語の資料はそれなりに多いのですが、
Mozziの仕様や詳しい使い方などを紹介した資料は意外と多くありません。
なので、サウンドプログラミングの勉強を兼ねて、翻訳しつつ読んでいこうと思います。

この記事を読む方は、自分がサウンドプログラミングの経験は少ない点と、
翻訳ツールを多分に使っているという点は考慮してください。

以下、自分が必要だと思った点の日本語訳です。

---

# [Mozziについて](https://sensorium.github.io/Mozzi/)

> Currently your Arduino can only beep like a microwave oven. Mozzi brings your Arduino to life by allowing it to produce much more complex and interesting growls, sweeps and chorusing atmospherics. These sounds can be quickly and easily constructed from familiar synthesis units like oscillators, delays, filters and envelopes.
> 
> You can use Mozzi to generate algorithmic music for an installation or performance, or make interactive sonifications of sensors, on a small, modular and super cheap Arduino, without the need for additional shields, message passing or external synths.

現在、あなたのArduinoは電子レンジのようなビープ音しか出せません。
MozziはArduinoに命を吹き込み、より複雑で興味深いグロウルやスイープ音、
コーラス的な雰囲気を作り出すことを可能にします。
これらのサウンドは、オシレータ、ディレイ、フィルタ、
エンベロープなどのおなじみの合成ユニットから素早く簡単に構築することができます。

Mozziを使って、インスタレーションやパフォーマンスのためのアルゴリズミックな音楽を生成したり、
センサーを使ったインタラクティブなソニフィケーションを、小型でモジュール式の超安価なArduinoで、
追加のシールドやメッセージパッシング、外部シンセを必要とせずに作成することができます。

## メモ

- ソニフィケーション: https://artscape.jp/artword/index.php/%E3%82%BD%E3%83%8B%E3%83%95%E3%82%A3%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3

---

# [学ぶ](https://sensorium.github.io/Mozzi/learn/)

> [Mozzi, an Introductory Tutorial](https://sensorium.github.io/Mozzi/learn/introductory-tutorial/)
> 
> This shows how to set up an Arduino with Mozzi from scratch and use analog inputs to make sounds using a knob, light sensing, pressure, and a switch (on a digital input).
> 
> [Anatomy of a Mozzi sketch](https://sensorium.github.io/Mozzi/learn/a-simple-sketch/)
> 
> A detailed introduction to the parts of a Mozzi sketch, showing how to use an oscillator to generate audio and control signals.
> 
> [Under the Hood](https://sensorium.github.io/Mozzi/learn/under-the-hood/)
> 
> Outlines how Mozzi works behind the scenes.
> 
> [Output Circuits](https://sensorium.github.io/Mozzi/learn/output/)
> 
> Shows how to connect Mozzi for audio output, including a schematic for HIFI mode using only 3 components, and a filter for reducing carrier frequency noise which some people can hear in STANDARD mode.
> 
> [Hints and Tips](https://sensorium.github.io/Mozzi/learn/hints/)
> 
> What kind of code Mozzi likes best, debugging and monitoring your sketches.
> 
> [Frequently Asked Questions](https://sensorium.github.io/Mozzi/learn/faq/)

[チュートリアル](https://sensorium.github.io/Mozzi/learn/introductory-tutorial/)

ArduinoにMozziをゼロからセットアップし、アナログ入力でノブ、光センシング、圧力、スイッチ（デジタル入力）を使って音を出す方法を紹介しています。

[Mozziスケッチの解剖学](https://sensorium.github.io/Mozzi/learn/a-simple-sketch/)

オシレータを使ったオーディオ信号の生成と信号の制御方法を見ていき、
Mozziスケッチの各パーツを詳しく紹介します。

[ボンネットの中](https://sensorium.github.io/Mozzi/learn/under-the-hood/)

Mozziが舞台裏でどのように動作しているかを概説します。

[出力回路](https://sensorium.github.io/Mozzi/learn/output/)

Mozziをオーディオ出力に接続する方法を見ていきます。
ここでは、わずか3つの部品でHIFIモードを実現する回路図や、
STANDARDモードで一部の人に聞こえるキャリア周波数ノイズを
低減するフィルターなどを紹介します。

[ヒントとTips](https://sensorium.github.io/Mozzi/learn/hints/)

Mozziはどのようなコードを好むのか、スケッチのデバッグやモニタリングについてご紹介します。

[よくある質問](https://sensorium.github.io/Mozzi/learn/faq/)

## メモ

- システムの内部を「Under the Hood（ボンネットの中）」って表現するのがかっこいい
- ちなみに「Mozziスケッチの解剖学」と「ボンネットの中」を読むことがこの記事を書くモチベーションになってます

---

# まとめ

Mozziの記事は自作シンセの話が多いですが、
トップページではMozziをアート領域で使う意気込みが見れてよかったです。
「Mozziスケッチの解剖学」とか「ボンネットの中」とか、
章タイトルがいちいちかっこいいのもいいですね。

次は「Mozziスケッチの解剖学」を読んでいこうと思います。
続きは[こちら](../mozzi-doc02)
