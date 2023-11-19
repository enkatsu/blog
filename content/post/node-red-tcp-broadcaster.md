+++
author = "Katsuya Endoh"
title = "Node-REDでTCPブロードキャスト用サーバを作る"
date = "2023-11-20"
description = "Node-REDでTCPブロードキャスト用サーバを作る"
tags = [
    "Node-RED",
    "Processing",
    "Arduino",
]
+++

<!--more-->

最近は通信周りばかり触ってます。
とくに好きだからというわけではなく、必要があって触り始めたら色々とわかったことが多いので、
連鎖的に触ってしまっているという感じです。

そこで、せっかく色々と調査しているならここに書き起こしておこうと思い、
Node-REDを使ったTCPブロードキャスト用サーバの作り方について書いておきます。

Node-REDに今回のフローをデプロイすると、
TCPによって送信した `\n` 区切りの文字列データを、
送信先以外の接続中クライアントに配信することができます。

# Node-REDとは

Node-REDは、デバイスやアプリケーション、Webシステムを
連携させるためのフローを組むことができるツールです。

IBMによって開発されましたが、現在はOpenJS Foundationによって管理されています。
フローの構築は、ブラウザ上で動作するエディタから操作することができます。
TouchDesignerやPure Dataのパッチのようにフローを構築するので、
システム間の関係性や、処理の流れを視覚的に認識することができます。

また、Node-REDという名前の通りNode.jsによって実装されているので、
JavaScriptによってノード内の処理を記述することもできます。

こちらに公式ページの文章を引用しておきます。

https://nodered.org/

> Node-RED is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways.
It provides a browser-based editor that makes it easy to wire together flows using the wide range of nodes in the palette that can be deployed to its runtime in a single-click.

Node-REDは、ハードウェア、API、オンライン・サービスを面白い新しい方法で接続するためのプログラミング・ツールです。
Node-REDはブラウザベースのエディタを提供し、パレットにある様々なノードを使ったフローを、ワンクリックでランタイムにデプロイすることができます。

# 実装

先に実装したフローを記載しておきます。
Node-REDは作成したフローをJSONで書き出し、読み込むことができます。
少し長いのでJSONは[ページ末尾](#フローを書き出したjson)に記載します。

![flows.png](/images/node-red-tcp-broadcaster/flows.png)

こちらに配信確認用のProcessingのコードも記載しておきます。

```java
import processing.net.*;

String host = "127.0.0.1";
int port = 32000;
Client client;

void setup()
{
  size(400, 400);
  textFont(createFont("SansSerif", 16));
  client = new Client(this, host, port);
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

# 実装詳細

## 接続・切断処理

全ての処理の起点は `TCP:32000接続待ち受け（tcp inノード）` になります。

このノードを `TCP:32000接続ステータス監視（statusノード）` によって監視されています。
クライアントが接続または切断すると、
`TCP:32000接続ステータス監視（statusノード）` のイベントが発火します。
接続の際には `msg.status.event` プロパティは `connect` 、
切断の際には `msg.status.event` プロパティは `disconnect` になります。
`接続・切断の判定（switchノード）` は、このプロパティによって分岐します。
接続時には、フロー内で使える変数 `flow.sessions` にセッションIDを追加します。
切断時には、フロー内で使える変数 `flow.sessions` からセッションIDを削除します。
`接続時処理（functionノード）` と `切断時処理（functionノード）` のコードは下記のとおりです。

### 接続時の処理

```js
const sessions = flow.get('sessions');
const sessionId = msg.status._session.id;

sessions.push(sessionId);
flow.set('clients', sessions);

return {
    payload: {
        sessionId, sessions,
        message: `${sessions} is connected`,
    }
};
```

### 切断時の処理

```js
const sessions = flow.get('sessions');
const sessionId = msg.status._session.id;

const newSessions = sessions
    .filter(id => id !== sessionId);

flow.set('sessions', newSessions);

return {
    payload: {
        sessions: newSessions,
        message: `${sessionId} is disconnected`,
    },
}
```

## 配信処理

TCPによって受信するデータは、文字列を前提にしています。
文字列の区切り文字は `\n` になります。
受信したデータは `配信先セッションの配列取得（functionノード）` によって
以下のフォーマットの配列に整形されます。

```js
[
    {
        payload: '配信するメッセージ',
        _session: {
            id: '配信先セッションID1',
            type: 'tcp',
    },
    {
        payload: '配信するメッセージ',
        _session: {
            id: '配信先セッションID2',
            type: 'tcp',
    }
    // ...
]
```

この際に、 `配信先セッションID` には受信先のIDは含まないようにフィルタリングしています。
`配信先セッションの配列取得（functionノード）` のコードは下記の通りです。

```js
const sessions = flow.get('sessions');
const sessionId = msg._session.id;

const newMsg = {};

newMsg.payload = sessions
    .filter(id => id !== sessionId)
    .map(id => {
        return {
            payload: msg.payload,
            _session: {
                id,
                type: 'tcp',
            }
        };
    });

return newMsg;
```

整形された配列は、 `配信先セッションの配列を分割（splitノード）` によってメッセージ列に分割されます。
分割したメッセージは

```js
{
    payload: {
        payload: '配信するメッセージ',
        _session: {
            id: '配信先セッションID2',
            type: 'tcp',
        }
    }
}
```

のようにネストしてしまっているので、
`TCP:32000配信（tcp outノード）` に渡す前に、
`配信用メッセージ整形（changeノード）` によって

```js
{
    payload: '配信するメッセージ',
    _session: {
        id: '配信先セッションID2',
        type: 'tcp',
    }
}
```

のように `payload` の中身を取り出してあげる必要があります。

最後に、 `配信用メッセージ整形（changeノード）` によって整形されたメッセージは、
`TCP:32000配信（tcp outノード）` に渡されてクライアントに配信されます。

# まとめ

久しぶりに長々と書いてしまいました。

以前に、同様の処理をPythonによって開発したのですが、
スレッドを使ったりIPアドレスを管理したりで、
学生に説明するのが大変でした。
ですが、Node-REDで構築した処理なら視覚的に理解しやすいので、
説明もだいぶ楽になりそうです。

今回紹介したフローは、以下に記載しておきます。

# フローを書き出したJSON

[flows.json](/data/node-red-tcp-broadcaster/flows.json)

```json
[
    {
        "id": "700919af87990932",
        "type": "tab",
        "label": "TcpBroadcaster",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "11fbee801eadcae3",
        "type": "tcp in",
        "z": "700919af87990932",
        "name": "TCP:32000接続待ち受け",
        "server": "server",
        "host": "",
        "port": "32000",
        "datamode": "stream",
        "datatype": "utf8",
        "newline": "\\n",
        "topic": "",
        "trim": true,
        "base64": false,
        "tls": "",
        "x": 130,
        "y": 40,
        "wires": [
            [
                "4a04bf1d702f3141"
            ]
        ]
    },
    {
        "id": "7851c2f79233a54e",
        "type": "tcp out",
        "z": "700919af87990932",
        "name": "TCP:32000配信",
        "host": "",
        "port": "",
        "beserver": "reply",
        "base64": false,
        "end": false,
        "tls": "",
        "x": 780,
        "y": 80,
        "wires": []
    },
    {
        "id": "a9b4b5e78f37319a",
        "type": "function",
        "z": "700919af87990932",
        "name": "接続時処理",
        "func": "const sessions = flow.get('sessions');\nconst sessionId = msg.status._session.id;\n\nsessions.push(sessionId);\nflow.set('clients', sessions);\n\nreturn {\n    payload: {\n        sessionId, sessions,\n        message: `${sessions} is connected`,\n    }\n};\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "// ここに記述したコードは、ノードをデプロイした時に\n// 一度だけ実行されます。\nflow.set('sessions', []);\n",
        "finalize": "",
        "libs": [],
        "x": 590,
        "y": 180,
        "wires": [
            [
                "85c467d1e74538f8"
            ]
        ]
    },
    {
        "id": "4a04bf1d702f3141",
        "type": "function",
        "z": "700919af87990932",
        "name": "配信先セッションの配列取得",
        "func": "const sessions = flow.get('sessions');\nconst sessionId = msg._session.id;\n\nconst newMsg = {};\n\nnewMsg.payload = sessions\n    .filter(id => id !== sessionId)\n    .map(id => {\n        return {\n            payload: msg.payload,\n            _session: {\n                id,\n                type: 'tcp',\n            }\n        };\n    });\n\nreturn newMsg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 380,
        "y": 40,
        "wires": [
            [
                "4ba0995388769e99"
            ]
        ]
    },
    {
        "id": "85c467d1e74538f8",
        "type": "debug",
        "z": "700919af87990932",
        "name": "接続時デバッグ用",
        "active": false,
        "tosidebar": true,
        "console": true,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 800,
        "y": 180,
        "wires": []
    },
    {
        "id": "8708d256adb4bae9",
        "type": "function",
        "z": "700919af87990932",
        "name": "切断時処理",
        "func": "const sessions = flow.get('sessions');\nconst sessionId = msg.status._session.id;\n\nconst newSessions = sessions\n    .filter(id => id !== sessionId);\n\nflow.set('sessions', newSessions);\n\nreturn {\n    payload: {\n        sessions: newSessions,\n        message: `${sessionId} is disconnected`,\n    },\n}",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 590,
        "y": 220,
        "wires": [
            [
                "4493fc979bb885a8"
            ]
        ]
    },
    {
        "id": "4493fc979bb885a8",
        "type": "debug",
        "z": "700919af87990932",
        "name": "切断時デバッグ用",
        "active": false,
        "tosidebar": true,
        "console": true,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 800,
        "y": 220,
        "wires": []
    },
    {
        "id": "4ba0995388769e99",
        "type": "split",
        "z": "700919af87990932",
        "name": "配信先セッションの配列を分割",
        "splt": "\\n",
        "spltType": "str",
        "arraySplt": 1,
        "arraySpltType": "len",
        "stream": false,
        "addname": "_session",
        "x": 270,
        "y": 100,
        "wires": [
            [
                "043f2ee6bbe79646"
            ]
        ]
    },
    {
        "id": "fa65aaacca58c9cb",
        "type": "debug",
        "z": "700919af87990932",
        "name": "配信デバッグ用",
        "active": false,
        "tosidebar": true,
        "console": true,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 790,
        "y": 120,
        "wires": []
    },
    {
        "id": "7b68c19fd21af570",
        "type": "status",
        "z": "700919af87990932",
        "name": "TCP:32000接続ステータス監視",
        "scope": [
            "11fbee801eadcae3"
        ],
        "x": 150,
        "y": 220,
        "wires": [
            [
                "091c3321a37fa488"
            ]
        ]
    },
    {
        "id": "091c3321a37fa488",
        "type": "switch",
        "z": "700919af87990932",
        "name": "接続・切断の判定",
        "property": "status.event",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "connect",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "disconnect",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 3,
        "x": 390,
        "y": 220,
        "wires": [
            [
                "a9b4b5e78f37319a"
            ],
            [
                "8708d256adb4bae9"
            ],
            [
                "bb240652b9403990"
            ]
        ]
    },
    {
        "id": "bb240652b9403990",
        "type": "debug",
        "z": "700919af87990932",
        "name": "接続・切断以外デバッグ用",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 640,
        "y": 260,
        "wires": []
    },
    {
        "id": "043f2ee6bbe79646",
        "type": "change",
        "z": "700919af87990932",
        "name": "配信用メッセージ整形",
        "rules": [
            {
                "t": "move",
                "p": "payload._session",
                "pt": "msg",
                "to": "_session",
                "tot": "msg"
            },
            {
                "t": "move",
                "p": "payload.payload",
                "pt": "msg",
                "to": "payload",
                "tot": "msg"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 520,
        "y": 100,
        "wires": [
            [
                "7851c2f79233a54e",
                "fa65aaacca58c9cb"
            ]
        ]
    }
]
```

