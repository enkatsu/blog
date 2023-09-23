+++
author = "Katsuya Endoh"
title = "TUIOのドキュメントを読む"
date = "2023-09-12"
description = "TUIOのドキュメントを読む"
tags = [
    "TUIO",
    "C++",
    "openFrameworks",
]
+++

<!--more-->

# 目的

oFのTUIOアセットを漁っていたら、
意外と中途半端な実装のものが多かったので、
自前で実装しようと思ったのでメモ。

# 既存のアセット

- [ofxTuioWrapper](https://github.com/arturoc/ofxTuioWrapper)
    - 2009のTUIOライブラリを使っている
        - 最新は2017年
    - ウィンドウサイズに依存して実装されている
        - 独自のアプリケーションに組み込むために作ったのかも
- [ofxTuio](https://github.com/Iwanaka/ofxTuio)
    - Objectにしか対応していない
        - reacTIVision用の実装かも
        - TUIOはCursor, Object, Blobを送受信可能

# 公式ドキュメント

公式ドキュメントから、必要な箇所だけ翻訳する。

https://www.tuio.org/?specification

## 実装内容

TUIOプロトコルは、SETメッセージとALIVEメッセージという、2つの主要なメッセージ・クラスを定義している。
SETメッセージは、位置、向き、その他の認識された状態など、オブジェクトの状態に関する情報を伝達するために使用される。
ALIVEメッセージは、一意のセッションIDのリストを使用して、表面に存在するオブジェクトの現在のセットを示します。

パケットロスから発生する可能性のあるエラーを避けるため、TUIOプロトコルには明示的なADDやREMOVEメッセージは含まれていない。
レシーバーは、連続するALIVEメッセージ間の差を調べることにより、オブジェクトの寿命を推測する。

SET メッセージと ALIVE メッセージに加えて、FSEQ メッセージが定義され、
各更新ステップに一意のフレーム・シーケンス ID を一意に付けます。
オプションの SOURCE メッセージは、クライアント側でソースの多重化を可能にするために TUIO ソースを識別します。
要約すると

- オブジェクトの属性は、状態が変化するたびにSETメッセージを使って送信される
- クライアントはSETメッセージとALIVEメッセージからオブジェクトの追加と削除を推測する
- オブジェクトが削除されると、更新された ALIVE メッセージが送信される
- FSEQ メッセージは、SET メッセージと ALIVE メッセージのバンドルに一意のフレーム ID を関連付けます
- オプションの SOURCE メッセージは、送信元のアプリケーションとアドレスを識別します

># Implementation Details
>
>The TUIO protocol defines two main classes of messages: SET messages and ALIVE messages. SET messages are used to communicate information about an object's state such as position, orientation, and other recognized states. ALIVE messages indicate the current set of objects present on the surface using a list of unique Session IDs.
>
>To avoid possible errors evolving out of packet loss, no explicit ADD or REMOVE messages are included in the TUIO protocol. The receiver deduces object lifetimes by examining the difference between sequential ALIVE messages.
>
>In addition to SET and ALIVE messages, FSEQ messages are defined to uniquely tag each update step with a unique frame sequence ID. An optional SOURCE message identifies the TUIO source in order to allow source multiplexing on the client side. To summarize:
>
>- Object attributes are sent after each state change using a SET message
>- The client deduces object addition and removal from SET and ALIVE messages
>- On object removal an updated ALIVE message is sent
>- FSEQ messages associate a unique frame id with a bundle of SET and ALIVE messages
>- An optional SOURCE message identifies the source application and address

## メッセージとバンドル形式

TUIOはOSC（Open Sound Control）[4]を使って実装されているので、その一般的な構文に従っている。
したがって、TUIOクライアントの実装は、oscpackやlibloのような適切なOSCライブラリを使用する必要があり、
この例では2次元Cursorプロファイルを参照している以下のメッセージタイプとバンドル構造をリッスンする必要があります。

- /tuio/2Dcur source application@address
- /tuio/2Dcur alive s_id0 ... s_idN
- /tuio/2Dcur set s_id x_pos y_pos x_vel y_vel m_accel
- /tuio/2Dcur fseq f_id

典型的なTUIOバンドルは、最初のALIVEメッセージ、
実際のバンドル容量に収まる任意の数のSETメッセージ、
そして最後のFSEQメッセージを含む。
最小の TUIO バンドルは、少なくとも必須の ALIVE メッセージと FSEQ メッセージを含む必要があります。
FSEQ フレーム ID は配信されたバンドルごとにインクリメントされ、
冗長なバンドルはフレームシーケンス ID -1 を使ってマークすることができます。
オプションの送信元メッセージは、クライアント側で複数の TUIO トラッカーの多重化を可能にするために送信することができます。
application@address引数は、
アプリケーション名と任意の一意な送信元アドレス（IP、ホスト名、MACアドレス）を指定する単一の文字列である。
localhostで送信される場合、2番目のアドレス部分は省略可能であるため、
@セパレーターのない文字列は、暗黙的にlocalhostからのものである。

># Message & Bundle Format
>
>Since TUIO is implemented using Open Sound Control (OSC) [4] it follows its general syntax. A TUIO client implementation therefore has to make use of an appropriate OSC library such as oscpack or liblo, and has to listen to the following message types and bundle structure, which in this example are referring to the two-dimensional Cursor profile.
>
>- /tuio/2Dcur source application@address
>- /tuio/2Dcur alive s_id0 ... s_idN
>- /tuio/2Dcur set s_id x_pos y_pos x_vel y_vel m_accel
>- /tuio/2Dcur fseq f_id
>
>A typical TUIO bundle will contain an initial ALIVE message, followed by an arbitrary number of SET messages that can fit into the actual bundle capacity and a concluding FSEQ message. A minimal TUIO bundle needs to contain at least the compulsory ALIVE and FSEQ messages. The FSEQ frame ID is incremented for each delivered bundle, while redundant bundles can be marked using the frame sequence ID -1.
>The optional source message can be transmitted to allow the multiplexing of several TUIO trackers on the client side. The application@address argument is a single string that specifies the application name and any unique source address (IP, host name, MAC address). If sent on localhost, the second address part can be omitted, hence any string without the @ separator implicitly comes from localhost. 

## パラメータ計算

TUIO座標系は各軸ごとに正規化され、0.0fから1.0fの範囲の浮動小数点数で表される。
2DプロファイルのX座標とY座標を計算するために、TUIOトラッカー実装はこれらの値を実際のセンサー寸法で割る必要があります。

- x = sensor_x / sensor_width
- y = sensor_y / sensor_height 

移動速度単位は、1秒間に軸の全長にわたって移動するものとして定義される。
例として、1秒以内に全面を水平に左から右に指を動かすと、移動速度ベクトルは(1.0 0.0)となる。
動作速度値は、2つの位置間の正規化距離を2つのサンプル間の時間（秒）で割った値から計算されます。
加速度値は、速度変化を 2 つのサンプル間の時間（秒）で割ったものです。

- X = (sensor_dx / sensor_width) / dt
- Y = (sensor_dy / sensor_height) / dt
- m = (speed - last_speed) / dt

回転速度の単位は、1 秒間に 1 回転と定義される。従って、1 秒間に 1 回の全回転を行うと、回転速度は 1.0 となる。
回転速度値は、正規化された角度変化を2つのサンプルの時間差（秒）で割った値から計算されます。
したがって、回転加速度値は、回転速度の変化を2つのフレーム間の時間（秒）で割った値から計算される。

- A = ((a - last_a) / 2*PI) / dt
- r = (A - last_A) / dt

># Parameter Computation
>
>The TUIO coordinate system is normalized for each axis and is represented by floating point numbers in the range from 0.0f to 1.0f. In order to compute the X and Y coordinates for the 2D profiles a TUIO tracker implementation needs to divide these values by the actual sensor dimension, while a TUIO client implementation consequently can scale these values back to the actual screen dimension.
>
>- x = sensor_x / sensor_width
>- y = sensor_y / sensor_height 
>
>The movement velocity unit is defined as a movement over the full length of an axis within one second. As an example, moving a finger horizontally from left to right across the full surface within one second represents a movement velocity vector of (1.0 0.0). The motion speed values are computed from the normalized distance between two positions divided by the time between the two samples in seconds. The acceleration value is the speed change divided by the time between the two samples in seconds.
>
>- X = (sensor_dx / sensor_width) / dt
>- Y = (sensor_dy / sensor_height) / dt
>- m = (speed - last_speed) / dt
>
>The rotation velocity unit is defined as one full rotation per second. Therefore performing one full object rotation within one second represents a rotation velocity value of 1.0. The rotation velocity values are computed from the normalized angle change divided by the time difference between the two samples in seconds. The according rotation acceleration value is therefore calculated from the rotation speed change divided by the time between the two frames in seconds.
>
>- A = ((a - last_a) / 2*PI) / dt
>- r = (A - last_A) / dt

## ブロブの説明

blobプロファイルは、タグ付けされていない汎用オブジェクト（blob）の基本情報を運ぶ。
メッセージフォーマットは、その中心点、長軸の角度、
2つの次元、およびblobの面積とともに、配向バウンディングボックスの内側の楕円を記述する。
したがって、このコンパクトなフォーマットは、おおよその楕円ブロブの囲みに関する情報を運ぶだけでなく、
方向づけられたバウンディングボックスの再構築も可能にします。
ブロブ領域はピクセル/幅*高さで正規化され、ブロブ全体のサイズに素早くアクセスできます。
blobの寸法は、-angleによる逆回転を実行した後の正規化された値です。

>Blob Description
>
>The blob profile carries the basic information about untagged generic objects (blobs). The message format describes the inner ellipse of an oriented bounding box, with its center point, the angle of the major axis, the two dimensions as well as the blob area. Therefore this compact format carries information about the approximate elliptical blob enclosure, but also allows the reconstruction of the oriented bounding box. The blob area is normalized in pixels/width*height, providing quick access to the overall blob size. The blob dimensions are the normalized values after performing an inverse rotation by -angle.
