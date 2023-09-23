+++
author = "Katsuya Endoh"
title = "ArduinoとWiiヌンチャクコントローラでマウスを作る"
date = "2022-12-25"
description = "ArduinoとWiiヌンチャクコントローラでマウスを作る"
tags = [
    "Arduino",
    "Physical computing",
]
+++

<!--more-->

![arduino-wii-nunchuk.gif](/images/arduino-wii-nunchuck/arduino-wii-nunchuk.gif)

# 目的

Wiiヌンチャクコントローラでマウスを作る

# 材料

- Arduino Leonardo
- Wiiヌンチャクコントローラ

# 手順

[「wii nunchuck arduino」](https://www.google.co.jp/search?q=wii+nunchuck+arduino&oq=wii+nunchuck+arduino&aqs=chrome..69i57j69i60l3j0l2.2182j0j4&sourceid=chrome&ie=UTF-8)などで検索すると色々資料が出てくる。
WiiヌンチャクコントローラはI2C通信を使用しているようなので、Wireライブラリを使用する。
またArduinoによりマウス操作を行うため、Mouseライブラリを使用する。
MouseライブラリはArduino LeonardoとArduino Microに対応しているので、今回はArduino Leonardoを使用した。
Wiiヌンチャクコントローラの端子を切ってワイヤストリッパで剥くとこんな感じに赤、黒、緑、黄色の線が出てくる。
これらを以下のように配線する。

- +(赤) -> 3.3V
- -(黒) -> GND
- SDA(緑) -> D2
- SCL(黄色) -> D3

![1.jpg](/images/arduino-wii-nunchuck/1.jpg)
![2.jpg](/images/arduino-wii-nunchuck/2.jpg)
![3.jpg](/images/arduino-wii-nunchuck/3.jpg)

プログラムは以下のリポジトリから
[enkatsu/NunchuckMouse](https://github.com/enkatsu/NunchuckMouse)

## 課題

- 今のままではスクロールができないのでブラウザの操作が困難
- マウスのスピードを調整可能にする

## 参考

- [todbot/wiichuck_adapter](https://github.com/todbot/wiichuck_adapter/tree/master/firmware/WiichuckDemo)
- [片手でゲームをしたい！](http://cubic9.com/Devel/%C5%C5%BB%D2%B9%A9%BA%EE/Arduino/%A5%B2%A1%BC%A5%E0%A5%B3%A5%F3%A5%C8%A5%ED%A1%BC%A5%E9%A1%BC/)

