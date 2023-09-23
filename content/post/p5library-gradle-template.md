+++
author = "Katsuya Endoh"
title = "Gradleを使ってProcessingライブラリを作る"
date = "2022-12-23"
description = "Gradleを使ってProcessingライブラリを作る"
tags = [
    "Processing",
    "Java",
    "Gradle",
]
+++

<!--more-->

Processingライブラリを作ろうとすると、
パスの設定などめんどくさい作業が多いです。

そこで、Gradleを使って簡単にライブラリを作れるテンプレートを作ったので紹介したいと思います。

# 準備

まずはGradleをインストールしましょう。

Macの場合、Homebrewが入っていれば `brew install gradle` でインストールできます。

# [processing-library-template-gradle](https://github.com/enkatsu/processing-library-template-gradle)を使ったライブラリの作り方

ライブラリのテンプレートは[こちら](https://github.com/enkatsu/processing-library-template-gradle)を使っていきます。

今回はhelloP5Libというライブラリを作る想定で書いていきます。

クラスはhello.p5.libパッケージのHelloクラスのみです。
このライブラリの使い方はこんな感じです。

```java
import hello.p5.lib.*;
Hello hello;

void setup() {
    size(300, 300);
    hello = new Hello(this, "Taro");
}
void draw() {
    background(0);
    hello.draw(100, 100);
}
```

![p5library-gradle-template.png](/images/p5library-gradle-template/p5library-gradle-template.png)

# 使い方

GitHubのprocessing-library-template-gradleのページから、 `Use this template` を選択して、テンプレートを使用したリポジトリを作成して、ローカルにクローンしてきます。

```bash
git clone https://github.com/enkatsu/${YOUR_REPOSITORY}.git
```

この時のディレクトリ構造はこんな感じです。

```bash
.
├── LICENSE
├── README.md
├── build.gradle
├── examples # ライブラリのサンプルスケッチ
│   └── HelloLibrary
│       └── HelloLibrary.pde
├── gradlew
├── gradlew.bat
├── settings.gradle
└── src
    └── main
        └── java # 実際にライブラリのソースコードを書くところ
            └── processing
                └── library
                    └── template
                        └── Sample.java
```

# ビルドの設定

``` settings.gradle
rootProject.name='helloP5Lib'
```

``` build.gradle
group 'helloP5Lib'
```

# ライブラリの実装

次に `src/main/java` 以下を編集してライブラリの中身を書いていきます。

```bash
rm -rf src/main/java/processing
mkdir -p src/main/java/hello/p5/lib
touch src/main/java/hello/p5/lib/Hello.java
```

```Hello.java
package hello.p5.lib;

import processing.core.*;

public class Hello {
    PApplet app;
    String name;
    public Hello(PApplet app, String name) {
        this.app = app;
        this.name = name;
    }
    public void draw(float x, float y) {
        app.text(this.name, x, y);
    }
}
```

# ライブラリのビルド

```bash
gradle -q
gradle javadoc
```

この時点でのディレクトリ構造はこんな感じです。

```bash
.
├── LICENSE
├── README.md
├── build.gradle
├── examples
│   └── HelloLibrary
│       └── HelloLibrary.pde
├── gradlew
├── gradlew.bat
├── library # ビルドされたライブラリ
│   ├── classes
│   │   └── java
│   │       └── main
│   │           └── hello
│   │               └── p5
│   │                   └── lib
│   │                       └── Hello.class
│   ├── processingLibraryTemplate.jar
│   └── tmp
│       ├── compileJava
│       ├── jar
│       │   └── MANIFEST.MF
│       └── javadoc
│           └── javadoc.options
├── reference # 出力されたリファレンス
│   └── javadoc
├── settings.gradle
└── src
    └── main
        └── java
            └── hello
                └── p5
                    └── lib
                        └── Hello.java
```

# Processingにインストールして使う

helloP5Libディレクトリを `processing/libraries` 以下にコピーしたら完了です。
Processingを再起動して `Sketch > Import library` に表示されるか確認してみましょう。
`helloP5Lib` と表示されていたらオリジナルライブラリの完成です。
