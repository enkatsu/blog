+++
author = "Katsuya Endoh"
title = "openFrameworksで開発したアプリを配布する際のTips: bin/dataを.appに含める方法"
date = "2023-08-16"
description = "openFrameworksで開発したアプリを配布する際のTips: bin/dataを.appに含める方法"
tags = [
    "openFrameworks",
    "Xcode",
    "macOS",
]
+++

<!--more-->

# 背景

openFrameworks（以下oF）で開発したアプリケーションを配布する際に、
使用するカメラなどの設定をユーザが設定できるようにしたかった。
そのために、ofxXmlSettingsを使ってロードする.xmlファイルを.appに含めたかった。

# 検証環境

- of_v0.11.2_osx_release
- Xcode 14.3

# 手順

## dataのファイルを.appに含める

Run Scriptに追加以下のスクリプトを追加する。
これで、 `bin/data` 以下のファイルが `$TARGET_BUILD_DIR/$PRODUCT_NAME.app/Contents/Resources` にコピーされる。

```bash
cp -r bin/data "$TARGET_BUILD_DIR/$PRODUCT_NAME.app/Contents/Resources";
```

## Run Scriptでコピーしたファイルを参照するようにする

次に `ofApp::setup()` 内で以下の関数を呼び出す。

```c++
ofSetDataPathRoot("../Resources/data/");
```

この関数を呼び出す理由としては、ビルドしたoFの実行ファイルは `$TARGET_BUILD_DIR/$PRODUCT_NAME.app/Contents/MacOS/$PRODUCT_NAME` に存在しているため、
oFがデータをロードする際に参照するパスを `$TARGET_BUILD_DIR/$PRODUCT_NAME.app/Contents/MacOS/../Resources/data/` とすることで、
Run Scriptでコピーしたファイルが参照されるように設定している。

# 参考文献

- https://forum.openframeworks.cc/t/compiling-a-release-build-with-resources/6651/4
- https://ws.tetsuakibaba.jp/doku.php?id=openframeworks:%E9%85%8D%E5%B8%83%E7%94%A8%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E4%BD%9C%E6%88%90
