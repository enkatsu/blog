+++
author = "Katsuya Endoh"
title = "SwiftOSCをmacOSアプリ開発に使う方法"
date = "2022-12-24"
description = "SwiftOSCをmacOSアプリ開発に使う方法"
tags = [
    "Swift",
    "OSC",
]
+++

<!--more-->

# Swift Package Managerからインストールする方法

下記のPRが出ているが，まだマージされていないので

[https://github.com/ExistentialAudio/SwiftOSC/pull/61](https://github.com/ExistentialAudio/SwiftOSC/pull/61)

下記のリポジトリとブランチを指定してインストールする

[https://github.com/soundflix/SwiftOSC/tree/dev](https://github.com/soundflix/SwiftOSC/tree/dev)

# UDPを使用する際のエラー対応

`App Sandbox` -> `Network` -> `Incomming Connections (Server)` と `Outgoing Connections (Client)` にチェックを入れる

![swiftosc.png](/images/swiftosc/swiftosc.png)

- https://github.com/Kitura/BlueSocket/issues/103
- https://stackoverflow.com/questions/47797446/nsposixerrordomain-when-binding-to-socket-on-macos-10-12
