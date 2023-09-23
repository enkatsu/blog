+++
author = "Katsuya Endoh"
title = "Processing（Java）からRustの関数を呼び出す"
date = "2023-07-22"
description = "ProcessingからRustの関数を呼び出す方法"
tags = [
    "Processing",
    "Rust",
    "Java",
]
+++

<!--more-->

サンプルコードのリポジトリはこちらです。

https://github.com/enkatsu/P5Rust

# ざっくりした説明

Rustの関数をJNAを使ってProcessingから呼び出す方法を試したので、
あまり需要はないかもしれないけど一応書いておきます。

ディレクトリ構成はこちらです。

```
.
├── P5Rust.pde
├── RustInstance.pde
└── rust
    ├── Cargo.lock
    ├── README.md
    ├── cargo.toml
    ├── src
    │   └── lib.rs
    └── target
        ├── CACHEDIR.TAG
        └── release
            └── librs.dylib
```

`rustc` でビルドする例は多かったですが、
今回は後々のことを考えてCargoを使っています。

Processingのコードを実行する前に、
プロジェクトルートで、以下のコマンドを実行することで、
ネイティブライブラリをビルドしてください。

```sh
cd rust
cargo build --release
```

## Rustによる関数実装

こちらがlib.rsの中身です。
Processingから呼び出す関数を定義しています。

```rs
use std::os::raw::c_int;
use std::os::raw::c_float;
use std::slice::from_raw_parts_mut;

#[no_mangle]
fn hello() {
    println!("Hello, world!");
}

#[no_mangle]
fn add(a: c_int, b: c_int) -> c_int {
    return a + b;
}

#[no_mangle]
fn sum(vals: *mut c_float, len: c_int) -> c_float {
    let new_slice = unsafe { from_raw_parts_mut(vals, len as usize) };
    let mut sum: c_float = 0.0;
    for i in 0..len {
        sum += new_slice[i as usize];
    }
    return sum;
}
```

## Rustで実装した関数のインターフェース定義

こちらがRustInstance.pdeの中身です。
Rustを読み込む処理と、インターフェース定義をしています。

```java
import com.sun.jna.Library;
import com.sun.jna.Native;

interface RsInterface extends Library {
  void hello();
  int add(int a, int b);
  float sum(float[] a, int len);
}

RsInterface buildRsInstance(String rsLibPath) {
  String absPath = sketchPath() + rsLibPath;
  return Native.load(absPath, RsInterface.class);
}
```

## 実際に呼び出すコード

こちらがP5Rust.pdeの中身です。
Rustの関数呼び出しを行なっています。

```java
String RS_LIBRALY_PATH = "/rust/target/release/librs.dylib";

void setup() {
  RsInterface rsInstance = buildRsInstance(RS_LIBRALY_PATH);
  rsInstance.hello();
  println(rsInstance.add(1, 2));
  
  int N = 200000;
  float[] vals = new float[N];
  for (int i = 0; i < N; i++) {
    vals[i] = 1.0;
  }
  
  println(rsInstance.sum(vals, vals.length));
}
```

# 感想

正確には測定していないのでここでは言及しませんが、
以下の点を踏まえればRustで実装した方が処理速度が向上する気がしました。

- 計算量が多い
- 複数回呼び出す必要がある
    - 関数の初回実行に時間がかかっていそう

作品制作の際に必要になったら、詳しく調査しようと思います。

# 参考文献

- https://qiita.com/tobita_yoshiki/items/74493400bbede2e5d436
- https://zenn.dev/eduidl/articles/f2fd959f220393
