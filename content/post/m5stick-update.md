+++
author = "Katsuya Endoh"
title = "M5StickCのファームウェア更新方法"
date = "2022-12-22"
description = "M5StickCのファームウェア更新方法"
tags = [
    "M5StickC",
    "Physical computing",
]
+++

<!--more-->

# 手順

下記のURLからファームウェアアップデートツールをダウンロードする。

[https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/software/Updater_FW20200114_A2_BTV231](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/software/Updater_FW20200114_A2_BTV231)

次に、下記のコマンドで実行権限を付与する。

```bash
cd ~/Downloads
chmod +x Updater_FW20200114_A2_BTV231
```

M5StickCをUSBで接続する。

FinderでDownloadsを開き、Updater_FW20200114_A2_BTV231を「右クリック -> 開く」で実行する。

最後に、「Press enter to continue...」と表示されたらreturnを押してファームウェアアップデートを実行する。

# 参考資料

- https://qiita.com/SamAkada/items/fa32d6072a832a10cd84
- https://tech.fusic.co.jp/posts/2020-02-12-macos-catalina-m5stickc/
