+++
author = "Katsuya Endoh"
title = "ESP32をWi-Fiアクセスポイント化してProcessingと連携させる"
date = "2023-11-12"
description = "ESP32をWi-Fiアクセスポイント化してProcessingと連携させる"
tags = [
    "Arduino",
    "Processing",
]
+++

<!--more-->

ProcessingとArduinoを連携させようとした時にシリアル通信を採用しがちですが、<br>
Processingに標準で入っている[Network Library](https://processing.org/reference/libraries/net/index.html)を触る機会があったので、<br>
ESP32をWi-Fiアクセスポイント化してProcessingと連携させてみました。

# 環境

- Processing
    - Network Library
- ESP32-WROOM
    - Wi-Fi

# ソースコード

以下のコードをESP-32に書き込むと、`ESP32AP-WiFi` というWi-Fiのアクセスポイントが見つかると思います。

## ESP-32

```cpp
#include <WiFi.h>

const char *ssid = "ESP32AP-WiFi";
const char *pass = "esp32apwifi";
const IPAddress ip(192, 168, 30, 3);
const IPAddress subnet(255, 255, 255, 0);
const int port = 10002;
WiFiServer server(port);

void setup() {
  Serial.begin(115200);
  WiFi.softAP(ssid, pass);
  WiFi.softAPConfig(ip, ip, subnet);
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        String message = client.readStringUntil('\n');
        Serial.println(message);
        client.write("pong\n");
      }
    }
  }
}
```

## Processing

マシンを `ESP32AP-WiFi` に接続した状態で以下のコードを実行します。
その状態でどこかキーを押せば `ping` というメッセージをESP-32に送信して、
`pong` というメッセージが返ってきます。

```java
import processing.net.*;

int port = 10002;
Client client;

void setup()
{
  size(400, 400);
  textFont(createFont("SansSerif", 16));
  client = new Client(this, "192.168.30.3", port);
  background(0);
}

void draw()
{
  if (client.available() > 0) {
    String message = client.readStringUntil('\n');
    println(message);
  }
}

void keyPressed() {
  client.write("ping\n");
}
```

# まとめ

インターネットに接続しない作品制作なら、
無線LANルータもいらないし手軽でありなんじゃないかな？と思いました。
そのうちセンサやアクチュエータを使った例もあげるかもしれません。
