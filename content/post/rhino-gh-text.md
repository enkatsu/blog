+++
author = "Katsuya Endoh"
title = "GrasshopperのGHPythonで文字列の曲線を生成する"
date = "2023-03-11"
description = "SwiftOSCをmacOSアプリ開発に使う方法"
tags = [
    "Rhinoceros",
    "Grasshopper",
    "GHPython",
]
+++

<!--more-->

# 目的

最近、Rhinocerosを触ってます。
過去に文字情報を使った作品を作っていたので、
そのデータを使ってパラメトリックなモデリングをしたいと思ったのですが、
Rhino7のGrasshopperからTextObjectを生成する方法が見つからなかったのでメモします。

HumanやWombatGHを使った例は出てくるけど、Rhino7には対応していない……

# 解決方法

参考文献に上げさせていただいた動画に解決方法が載っていました。

この記事のコードは、多少Pythonicなコードにしてあります。

<img src="/images/rhino-gh-text/gh.png" width="50%">
<img src="/images/rhino-gh-text/rhino.png" width="50%">

```python
"""Provides a scripting component.
    Inputs:
        pos:  The position script variable
        txt:  The text script variable
        font: The font script variable
        size: The text size script variable
    Output:
        a: The a output variable"""

__author__ = "enkatsu"

import rhinoscriptsyntax as rs
import scriptcontext as sc
import Rhino

sc.doc = Rhino.RhinoDoc.ActiveDoc
rs.EnableRedraw(False)

# テキストを追加して、アウトラインを書き出し

textObj = rs.AddText(txt, [0, 0, 0])
textCurves = rs.ExplodeText(textObj, delete=True)
a = [rs.coercecurve(textCurve) for textCurve in textCurves]

rs.DeleteObjects(textCurves)

rs.EnableRedraw()
sc.doc = ghdoc
```

# 参考文献

- https://github.com/jhorikawa/GrasshopperHowtos/tree/master/0064%20Text%20Pin
- https://www.youtube.com/watch?v=sCLOoslIA10
