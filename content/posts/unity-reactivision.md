+++
author = "Katsuya Endoh"
title = "UnityでreacTIVisionを使う方法"
date = "2022-12-24"
description = "UnityでreacTIVisionを使う方法"
tags = [
    "Unity",
    "reacTIVision",
    "C Sharp",
]
+++

# ライブラリのダウンロード

ここからTUIO11_NETをダウンロードする。

[https://sourceforge.net/projects/reactivision/files/TUIO 1.1/TUIO-Clients 1.1.5/](https://sourceforge.net/projects/reactivision/files/TUIO%201.1/TUIO-Clients%201.1.5/)

# ライブラリのインポート

TUIO11_NETの中にある、以下のファイルを削除する。
これらのファイルは、C#でTUIOを扱うサンプルプロジェクトだが、
Unityに取り込んだ際にエラーが発生してしまうため削除しておく。

- TUIO_CSHARP.sln
- TUIO_DEMO.csproj
- TUIO_DUMP.csproj
- TUIO_LIB.csproj
- TuioDemo.cs
- TuioDemoObject.cs
- TuioDump.cs

TUIO11_NETをUnityプロジェクトのAssets以下に配置する。

# サンプルの実行

Create EmptyでEmptyGameObjectを作成し、
Add Component > New script
から新規のコンポーネントを追加する。
次に、作成したコードに下記のコードに置き換える。
ReacTIVisionを起動した状態で、
UnityプロジェクトをRunすれば動作する。

```csharp
using TUIO;
using UnityEngine;

public class ReactiVisionMain : MonoBehaviour, TuioListener
{
    private TuioClient client;

    void Start()
    {
        client = new TuioClient(3333);
        client.addTuioListener(this);
        client.connect();
        if (client.isConnected()) {
            Debug.Log("connect!!");
        }
    }

    void Update()
    {
    }

    public void addTuioBlob(TuioBlob tblb)
    {
    }

    public void addTuioCursor(TuioCursor tcur)
    {
    }

    public void addTuioObject(TuioObject tobj)
    {
        Debug.Log($"ID{tobj.SymbolID}のマーカが検出されました");
    }

    public void refresh(TuioTime ftime)
    {
    }

    public void removeTuioBlob(TuioBlob tblb)
    {
    }

    public void removeTuioCursor(TuioCursor tcur)
    {
    }

    public void removeTuioObject(TuioObject tobj)
    {
        Debug.Log($"ID{tobj.SymbolID}のマーカを見失いました");
    }

    public void updateTuioBlob(TuioBlob tblb)
    {
    }

    public void updateTuioCursor(TuioCursor tcur)
    {
    }

    public void updateTuioObject(TuioObject tobj)
    {
        Debug.Log($"ID: {tobj.SymbolID}, x: {tobj.X}, y: {tobj.Y}");
    }
}
```

# コールバック内の処理をメインスレッドで実行するサンプル

ゲームオブジェクトの操作などはメインスレッドでしか実行できないが、
TuioListenerのコールバック関数は、メインスレッド外で実行されてしまう。
なので、 `Start()` でメインスレッドの `SynchronizationContext` を取得しておく必要がある。

```csharp
using TUIO;
using UnityEngine;
using System.Threading;

public class ReacTIVisionController : MonoBehaviour, TuioListener
{
    private TuioClient client;
    // メインスレッドのIDを入れておく変数
    SynchronizationContext mainContext;

    void Start()
    {
        // この時点ではメインスレッドなので、スレッドのIDを格納しておく
        mainContext = SynchronizationContext.Current;
        client = new TuioClient(3333);
        client.addTuioListener(this);
        client.connect();
        if (client.isConnected())
        {
            Debug.Log("connect!!");
        }
    }

    void Update()
    {
    }

    public void addTuioBlob(TuioBlob tblb)
    {
    }

    public void addTuioCursor(TuioCursor tcur)
    {
    }

    public void addTuioObject(TuioObject tobj)
    {
        // メインスレッドに戻して処理を実行
        mainContext.Post(__ =>
        {
            // ここに実行したい処理を書く
        }, null);
    }

    public void refresh(TuioTime ftime)
    {
    }

    public void removeTuioBlob(TuioBlob tblb)
    {
    }

    public void removeTuioCursor(TuioCursor tcur)
    {
    }

    public void removeTuioObject(TuioObject tobj)
    {
        // メインスレッドに戻して処理を実行
        mainContext.Post(__ =>
        {
            // ここに実行したい処理を書く
        }, null);
    }

    public void updateTuioBlob(TuioBlob tblb)
    {
    }

    public void updateTuioCursor(TuioCursor tcur)
    {
    }

    public void updateTuioObject(TuioObject tobj)
    {
        // メインスレッドに戻して処理を実行
        mainContext.Post(__ =>
        {
            // ここに実行したい処理を書く
        }, null);
    }
}
```

# Unityのスレッドに関する記事

[https://qiita.com/toRisouP/items/a2c1bb1b0c4f73366bc6](https://qiita.com/toRisouP/items/a2c1bb1b0c4f73366bc6)
