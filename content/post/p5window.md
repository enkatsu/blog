+++
author = "Katsuya Endoh"
title = "Processingでマルチウインドウとか"
date = "2023-08-04"
description = "Processingでマルチウインドウとかを使った習作"
tags = [
    "Processing",
]
+++

<!--more-->

[ソースコード](https://github.com/enkatsu/P5WindowApp)

Processingでマルチウインドウとかウインドウ位置の取得とかを使った実験です。

昔作ったんですけど、ウインドウなどのOSのUIを使ったインタラクションが面白いと思ったので改めてコードを書いてみました。

<!-- <video controls playsinline muted="true" width="100%" type="video/mp4">
  <source src="/videos/p5window/WindowApp.mov">
  </source>
  Sorry, your browser doesn't support embedded videos.
</video> -->

<div style="padding:62.5% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/852428061?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Processing Multiple Window"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<!-- <video controls playsinline muted="true" width="100%" type="video/mp4">
  <source src="/videos/p5window/WindowInvertLayerApp.mov">
  </source>
  Sorry, your browser doesn't support embedded videos.
</video> -->

<div style="padding:62.5% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/852429218?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Processing Multiple Window Invert"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<!-- <video controls playsinline muted="true" width="100%" type="video/mp4">
  <source src="/videos/p5window/WindowLayerImageApp.mov">
  </source>
  Sorry, your browser doesn't support embedded videos.
</video> -->

<div style="padding:62.5% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/852429861?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Processing Multiple Window Image Mask"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

この動画はこちらのツイートをProcessingで模写したスケッチです。

https://twitter.com/shunsuke_kudo_/status/1687632477198921731?s=46&t=7j17GvG2nSpm21lo6-_nLQ

<video controls playsinline muted="true" width="100%" type="video/mp4">
  <source src="/videos/p5window/WindowResizeApp.mov">
  </source>
  Sorry, your browser doesn't support embedded videos.
</video>

# 参考文献

- https://forum.processing.org/two/discussion/17270/why-this-getx-method-is-missing-in-processing-3-1-1.html#Item_5
- https://forum.processing.org/two/discussion/12272/multiple-windows-with-processing-3.html
