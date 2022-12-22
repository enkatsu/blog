+++
author = "Katsuya Endoh"
title = "p5.jsとArduinoを接続する"
date = "2022-12-22"
description = "p5.jsとArduinoを接続する"
tags = [
    "p5.js",
    "Arduino",
    "Physical computing",
]
+++

# 接続方法の比較

## [p5-serial(p5.serialserver + p5.serialport)](https://github.com/p5-serial)

- ITP Camp2016でスタートしているプロジェクト
    - 2019 Google Summer of Codeを獲得
    - 2022 Processing Fellowshipを獲得
- Web socketを使用
    - 様々なブラウザで動作する
    - Webソケットサーバ（p5.serialserver）が必要
        - WebソケットサーバはNode.js実装とProcessing実装が用意されている
            - Processing実装は動かなかった（Processing4.0.1）
                - 4.1.1では動作した（https://github.com/processing/processing4/pull/577）
## [p5.web-serial](https://github.com/gohai/p5.webserial)

- Web Serial APIを使用
    - ChromeとEdgeのみで動作
        - スマートフォンから使うにはBTなどを使う必要がある？


# p5-serialの環境構築

## 検証環境

- Node.js: v14.18.1

## p5.serialserver（Webソケットサーバ側）

```bash
git clone https://github.com/p5-serial/p5.serialserver.git
cd p5.serialserver
npm install
node startserver.js
```

## Arduino

```ino
int buttonPin = 7;

void setup() {
    Serial.begin(9600);
    pinMode(buttonPin, INPUT);
}

void loop() {
    int buttonIsPressed = digitalRead(buttonPin);
    Serial.write(buttonIsPressed);
}
```

- https://rephtone.com/electronics/arduino-buttons/
- https://rephtone.com/wp-content/uploads/2019/06/Fritzing-4-1024x719.jpg

## p5.serialport（p5.js側）

```bash
git clone https://github.com/p5-serial/p5.serialport.git
cd p5.serialport
python -m http.server 8000
```

<a href="http://127.0.0.1:8000/examples/01-basics/index.html" target="_blank">http://127.0.0.1:8000/examples/01-basics/index.html</a>を開く


## 注意事項

- examplesの01-basics以外はポートの更新が正常に動作していない。
    - sketch.jsの `updatePort()` に `serial.openPort(serialPortName)` を書き足す必要がある
    - https://github.com/p5-serial/p5.serialport/tree/main/examples
        - 2022/01/22 examples修正済み
