+++
author = "Katsuya Endoh"
title = "Mozziのドキュメントを読みつつ翻訳する「ボンネットの中」"
date = "2023-05-21"
description = "Mozziのドキュメントを読みつつ翻訳する「ボンネットの中」"
tags = [
    "Arduino",
    "Mozzi",
]
+++

<!--more-->

前回は[こちら](../mozzi-doc02)

# [ボンネットの中](https://sensorium.github.io/Mozzi/learn/under-the-hood/)

> The interface between Mozzi and the Arduino environment consists of four main functions. 
> These are `startMozzi()`, `updateAudio()`, `updateControl()` and `audioHook()`, visible in the “User space” section in the figure below. 
> All four are required for a Mozzi sketch to compile.

MozziとArduino環境とのインターフェースは、4つの主要な関数で構成されています。
下図の "User space "セクションにある`startMozzi()`, `updateAudio()`, `updateControl()`, `audioHook()`です。
Mozziスケッチがコンパイルされるためには、この4つすべてが必要です。

![Mozzi-system.jpg](/images/mozzi-doc03/Mozzi-system.jpg)


> `startMozzi(control_rate)` goes in Arduino’s `setup()`. 
> It starts a timer which regularly sends audio out from the audio output buffer, 
> and calls `updateControl()` at the requested control rate given in Hz as a parameter, 
> or defaulting to 64 Hz without a parameter.

`startMozzi(control_rate)`は、Arduinoの`setup()`の中にあります。
これは、定期的にオーディオ出力バッファからオーディオを送信するタイマーを開始し、
パラメータとしてHzで与えられた要求された制御レートで`updateControl()`を呼び出すか、
パラメータなしで64Hzをデフォルトとします。

> `updateControl()` is where any analog or digital input sensing code should be placed and relatively slow changes such as LFO’s or frequency changes can be performed.

`updateControl()`は、アナログやデジタル入力のセンシングコードを配置し、
LFOや周波数の変更など、比較的遅い変化を実行する場所です。

> `updateAudio()` is where audio synthesis code should be placed. 
> This runs on average 16384 times per second, so code here needs to be lean. 
> The only other strict requirement is that it returns an integer between -244 and 243 inclusive in `STANDARD` mode or -8192 to 8191 in HIFI mode.

`updateAudio()`は、音声合成のコードを配置する場所です。
これは1秒間に平均16384回実行されるので、ここのコードは無駄のないものにする必要があります。
その他の厳しい要件は、`STANDARD`モードでは-244〜243、HIFIモードでは-8192〜8191の整数を返すことくらいです。

> `audioHook()` goes in Arduino’s `loop()`. 
> It wraps `updateAudio()` and takes care of filling the output buffer, hiding the details of this from user space.

`audioHook()`は、Arduinoの`loop()`内に配置します。
これにより`updateAudio()`をラップして、出力バッファを満たすことを引き受けることで、
ユーザ空間から複雑な処理を隠蔽します。

> Mozzi uses hardware interrupts on the processor which automatically call interrupt service routines (ISR) at regular intervals. 
> `startMozzi()` sets up an interrupt for audio output at a sample rate of 16384 Hz. 
> A counter in the audio output routine is used to call `updateControl`. In earlier versions, 
> a separate interrupt on Timer 0 was used for control.

Mozziは、一定間隔で自動的に割り込みサービスルーチン（ISR）を呼び出すプロセッサのハードウェア割り込みを使用します。
`startMozzi()`は、サンプルレート16384Hzのオーディオ出力のための割り込みを設定します。
オーディオ出力ルーチンのカウンタは、`updateControl`を呼び出すために使用されます。
以前のバージョンでは、タイマー0の別の割り込みが制御に使用されていました。

> In `STANDARD_PLUS` (and old `STANDARD`) mode, the 16 bit Timer 1 is used by Mozzi on the ATmega processors for audio and control.

`STANDARD_PLUS`（および旧`STANDARD`）モードでは、ATmegaプロセッサのMozziによって、
16ビットタイマー1がオーディオとコントロールのために使用されます。

> `HIFI` mode additionally employs Timer 2 with Timer 1 for audio.

`HIFI`モードではさらに、オーディオ用として、タイマー1とタイマー2を併用します。

> The output buffer has 256 cells which equates to a maximum latency of about 15 milliseconds, 
> to give leeway for control operations without interrupting audio output. 
> The buffer is emptied behind the scenes by the regular 16384 Hz audio interrupt.

出力バッファは256セルで、最大レイテンシは約15ミリ秒に相当し、オーディオ出力を中断することなく制御操作のための余裕を持たせています。
バッファは、通常の16384Hzのオーディオ割り込みによって裏側で空にされます。

# まとめ

Mozziの最大サンプルレートは16384Hzなので、出力できる音は8192Hzまでになります。
なので、超音波を使った実験的な作品を制作する場合は、他の方法を考えたほうがいいかもしれません。

また、Mozzi自体がタイマを使用するようなので、
タイマを使うようなコードを書く際は注意が必要です。

## 追記

[こちら](https://sensorium.github.io/Mozzi/#features)の情報によれば、
実験的な機能として最大サンプルレートを32768Hzにできるようです。
また、 [mozzi_config.h](https://github.com/sensorium/Mozzi/blob/master/mozzi_config.h#L65)
を読んでみたところ、
Teensy3/3.1などのハイパフォーマンスなCPUでは、
最大サンプルレートを65536Hzとして動かせそうな記述があったので、
こちらを使用すれば32768Hzまで出力できるかもしれません。
