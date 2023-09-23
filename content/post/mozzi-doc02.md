+++
author = "Katsuya Endoh"
title = "Mozziのドキュメントを読みつつ翻訳する「Mozziスケッチの解剖学」"
date = "2023-05-20"
description = "Mozziのドキュメントを読みつつ翻訳する「Mozziスケッチの解剖学」"
tags = [
    "Arduino",
    "Mozzi",
]
+++

<!--more-->

前回は[こちら](../mozzi-doc01)

# [Mozziスケッチの解剖学](https://sensorium.github.io/Mozzi/learn/a-simple-sketch/)

> Here’s a detailed explanation of the parts in a Mozzi sketch.
> We’ll start by generating audio to produce a plain sine wave,
> then add control to the sketch to change the sine wave’s frequency and produce vibrato.

ここでは、Mozziのスケッチに含まれるパーツを詳しく説明します。
まずはプレーンな正弦波からオーディオを生成し、
スケッチに制御を加えて正弦波の周波数を変化させ、ビブラートを発生させるところからスタートします。

> Bare bones example: playing a sine wavePermalink
> 
> Let’s make a minimal Mozzi sketch step by step. 
> The sketch plays a sine wave at a specified frequency. 
> No great feat, and you can find lots of other Arduino sketches doing it without Mozzi, 
> but it gives the gist of how a Mozzi sketch works. 
> You don’t need much experience with Arduino or programming.
> 
> First `#include <MozziGuts.h>`. 
> You always need this, as well as headers for any Mozzi classes, 
> modules or tables used in the sketch. 
> This time we’ll have an oscillator and a wavetable for the oscillator to play:

## 素の例: 正弦波を再生する

最小限のMozziスケッチを順を追って作ってみましょう。
このスケッチは、指定した周波数の正弦波を再生します。
Mozziを使わなくても、他のArduinoスケッチでそれを行うことができますが、
Mozziスケッチがどのように動作するか要点がわかります。
Arduinoやプログラミングの経験はあまり必要ありません。

まず `#include <MozziGuts.h>` です。
これは、スケッチで使用するMozziクラス、モジュール、テーブルのヘッダと同様に必ず必要です。
今回は、オシレータと、オシレータが演奏するためのウェーブテーブルを用意することにします:

```c
#include <MozziGuts.h> // this makes everything work
#include <Oscil.h>  // a template for an oscillator
#include <tables/sin2048_int8.h>  // a wavetable holding a sine wave
```

> Next, instantiate the oscillator, using the Oscil class just included. 
> Here is the structure and the parameters used to declare an `Oscil`.

次に、先ほど含まれたOscilクラスを使用して、オシレータをインスタンス化します。
ここでは、`Oscil` を宣言するために使用される構造とパラメータを示します。

```c
Oscil <table_size, update_rate> name(table_data);
```

> The oscillator needs to be instantiated using literal numeric values as template parameters (inside the < > brackets). 
> This allows the compiler to do some calculations at compile time instead of slowing down execution by repeating the same operations over and over while the program runs.

オシレータは、テンプレートパラメータとしてリテラルな数値を使用してインスタンス化する必要があります（< >括弧の中）。
これにより、コンパイル時にいくつかの計算を行うことで、
プログラムの実行中に同じ操作を何度も繰り返して実行速度を低下させることを防ぐことができます。

> The table used by an `Oscil` needs to be a power of two, 
> typically at least 256 cells and preferably longer for lower aliasing noise. 
> This Oscil will be operating as an audio generator, so the update rate will be `AUDIO_RATE`. 
> The `table_data` is an array which you can find the name of in the table file included at the top of the sketch. 
> If you look in Mozzi/tables/sin2048_int8.h, you’ll find `SIN2048_DATA`.

`Oscil` が使用するテーブルは2のべき乗である必要があり、通常少なくとも256セル以上は必要です。
エイリアシングノイズを低くするためには、より長いことが望まれます。
このOscilはオーディオジェネレータとして動作するので、更新レートは`AUDIO_RATE`になります。
`table_data`は配列で、スケッチのトップに含まれるテーブルファイルの中にその名前があります。
Mozzi/tables/sin2048_int8.hを見ると、`SIN2048_DATA` が見つかります。

> So, an audio sine tone oscillator for our sketch is created like this:

つまり、このスケッチのオーディオ正弦波オシレータは、次のように作成されます:

```c
Oscil <2048, AUDIO_RATE> aSin(SIN2048_DATA);
```

> The `CONTROL_RATE` has a default value of 64, but you can change it if you want control updates to happen more frequently. 
> Like the audio rate, it must be a literal number and power of two to allow Mozzi to optimise internal calculations for run-time speed.

`CONTROL_RATE` のデフォルト値は64ですが、コントロールの更新をより頻繁に行いたい場合は変更することができます。
Mozziがランタイム速度のために内部計算を最適化できるように、オーディオレートと同様に、
リテラル数かつ2のべき乗でなければなりません。

```c
#define CONTROL_RATE 128
```

> Now to the program functions. In Arduino’s setup() routine goes:

さて、プログラムの機能です。
Arduinoの`setup()` ルーチンでは、次のようになります: 

```c
startMozzi(CONTROL_RATE);
```

> This sets up one timer to call `updateControl()` at the rate chosen and another timer which works behind the scenes to send audio samples to the output pin at the fixed rate of 16384 Hz.

これは、選択したレートで`updateControl()`を呼び出すタイマと、
固定レートである16384Hzで出力ピンにオーディオサンプルを送るために裏で動作する別のタイマをセットアップします。

> The oscillator frequency can be set in a range of ways, but we’ll use an integer:

オシレータの周波数は様々な方法で設定できますが、ここでは整数を使用することにします:

```c
aSin.setFreq(440);
```

> Now Arduino’s `setup()` function looks like this:

この時点でのArduinoの `setup()` 関数はこのようになります:

```c
void setup(){
	startMozzi(CONTROL_RATE);
	aSin.setFreq(440);
}
```

> The next parts of the sketch are `updateControl()` and `updateAudio()`, which are both required. 
> In this example the frequency has already been set and the oscillator just needs to be run in `updateAudio()`, 
> using the Oscil’s `next()` method which returns a signed 8 bit value from the oscillator’s wavetable. 
> The int return value of `updateAudio()` must be in the range -244 to 243 in Mozzi’s default `STANDARD` audio mode.

次のスケッチは `updateControl()` と `updateAudio()` の両方が必要です。
このサンプルでは、周波数はすでに設定されているので、`updateAudio()` 内で Oscil の　`next()` メソッド実行するだけです。
`next()` メソッドは、オシレータのウェーブテーブルから符号付き8ビット値を返します。
`updateAudio()` の int型の戻り値は、Mozzi デフォルトの `STANDARD` オーディオモードでは -244 から 243 の範囲でなければなりません。

```c
void updateControl(){
	// no controls being changed
}

int updateAudio(){
	return aSin.next();
}
```

> Finally, `audioHook()` goes in Arduino’s `loop()`.

最後に、 Arduino の `loop()`内で`audioHook()`を呼び出します。

```c
void loop(){
	audioHook();
}
```

> This is where the sound actually gets synthesised, 
> running as fast as possible to fill the output buffer which gets steadily emptied at Mozzi’s audio rate. For this reason, 
> it’s usually best to avoid placing any other code in `loop()`.

ここでは実際に音が合成されて、空になっていく出力バッファを着実にMozziのオーディオレートで満たすために、可能な限り速く実行されます。
このため、通常では`loop()`の中に他のコードを配置することは避けたほうがよいでしょう。

> It’s important to design a sketch with efficiency in mind in terms of what can be processed in
> `updateAudio()`, `updateControl()` and `setup()`. 
> Keep `updateAudio()` lean, put slow changing values in `updateControl()`, 
> and pre-calculate as much as possible in `setup()`. 
> Control values which directly modify audio synthesis can be efficiently interpolated with a `Line` object in `updateAudio()` if necessary.

`updateAudio()` や `updateControl()`、`setup()`で行う処理は、効率を意識してスケッチを設計することが重要です。
`updateAudio()` は無駄を省き、`updateControl()` には変化の遅い値を入れ、`setup()` では可能な限り事前計算をします。
オーディオ合成を直接変更する制御値は、必要に応じて `updateAudio()` で `Line` オブジェクトを使用して効率的に補間することができます。

> Here’s the whole sketch:

こちらがスケッチの全体像です:

```c
#include <MozziGuts.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

#define CONTROL_RATE 128
Oscil <2048, AUDIO_RATE> aSin(SIN2048_DATA);

void setup(){
	aSin.setFreq(440);
	startMozzi(CONTROL_RATE);
}

void updateControl(){
}

int updateAudio(){
	return aSin.next();
}

void loop(){
	audioHook();
}
```

> Adding a control signal: vibratoPermalink
> 
> Vibrato can be added to the sketch by periodically changing the frequency of the audio wave with a low frequency oscillator. 
> The new oscillator can use the same wave table but this time it’s set up to update at control rate. 
> The naming convention of using a prefix of `k` for control and a for audio rate units is `a` personal mnemonic, 
> influenced by Csound.

## シグナルの制御を追加する: ビブラート

低周波オシレータでオーディオ波の周波数を周期的に変化させることで、スケッチにビブラートを追加することができます。
新しいオシレーターは、同じウェーブテーブルを使用できますが、今回はコントロールレートで更新するように設定されています。
コントロール・レートの変数名に`k`、オーディオ・レートの変数名に`a`というプレフィックスを使う命名規則は、Csoundの影響を受けた個人的なニモニックです。

```c
Oscil <2048, CONTROL_RATE> kVib(SIN2048_DATA);
```

> This time the frequency can be set with a floating point value:

今回は周波数を浮動小数点値で設定することができます:

```c
kVib.setFreq(6.5f);
```

> Now, using variables for depth and centre frequency, 
the vibrato oscillator can modulate the frequency of the audio oscillator in `updateControl()`. 
`kVib.next()` returns a signed byte between -128 to 127 from the wave table, 
so depth has to be set proportionately.

これで、深さと中心周波数の変数を使用して、ビブラート・オシレータは`updateControl()`でオーディオ・オシレータの周波数を変調することができます。
`kVib.next()`は、ウェーブテーブルから-128〜127の符号付きバイトを返すので、深さはそれに比例して設定する必要があります。

```c
void updateControl(){
	float vibrato = depth * kVib.next();
	aSin.setFreq(centre_freq+vibrato);
}
```

> Here’s the modified sketch complete with vibrato:

これが、ビブラートをかけた修正スケッチです:

```c
#include <MozziGuts.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

#define CONTROL_RATE 128
Oscil <2048, AUDIO_RATE> aSin(SIN2048_DATA);
Oscil <2048, CONTROL_RATE> kVib(SIN2048_DATA);

float centre_freq = 440.0;
float depth = 0.25;

void setup(){
	kVib.setFreq(6.5f);
	startMozzi(CONTROL_RATE);
}

void updateControl(){
	float vibrato = depth * kVib.next();
	aSin.setFreq(centre_freq+vibrato);
}

int updateAudio(){
	return aSin.next();
}

void loop(){
	audioHook();
}
```

> While this example uses floating point numbers, 
> it is best to avoid their use for intensive audio code which needs to run fast, especially in `updateAudio()`. 
> When the speed of integer maths is required along with fractional precision, 
> it is better to use fixed point fractional arithmetic. 
> Mozzi’s fixmath module has number types and conversion functions which assist in keeping track of precision through complex calculations.

この例では浮動小数点数を使用していますが、特に`updateAudio()`のような集中的なオーディオ関係のコードは，
高速に実行する必要があるので、浮動小数点数の使用は避けた方がよいでしょう。
整数演算の速度と分数精度が必要な場合は、固定小数点分数演算を使用するのがよいでしょう。
Mozziのfixmathモジュールには、複雑な計算で精度を維持するのに役立つ、数値型と変換関数があります。

---

# まとめ

> コントロール・レートの変数名に`k`、オーディオ・レートの変数名に`a`というプレフィックスを使う命名規則は、
> Csoundの影響を受けた個人的なニモニックです。

サンプルコードの命名規則が気になっていたので、説明があってスッキリしました。

あとは、Mozziのfixmathモジュールとか、思った以上に役立つ情報がありました。

> 高速に実行する必要があるので、浮動小数点数の使用は避けた方がよいでしょう。

組み込みに慣れていないと、このへんとか意識することがないので勉強になりました。

次は「ボンネットの中」を読んでいこうと思います。
続きは[こちら](../mozzi-doc03)
