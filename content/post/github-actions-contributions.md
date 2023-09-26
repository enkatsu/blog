+++
author = "Katsuya Endoh"
title = "contributions（草）を可視化する"
date = "2023-09-24"
description = "GitHub ActionsとGitHub APIを使ってcontributionsをJSONで公開する"
tags = [
    "Python",
    "GitHub",
    "p5.js",
]
+++

<!--more-->

# ざっくり解説

GitHubのcontributions（いわゆる草）は、GitHub APIを使って取得できます。\
ですが、GitHub APIを使うにはAPIトークンが必要です。\
自分は、p5.jsを使ってcontributionsを可視化したかったので、
フロントにAPIトークンを記載したくありませんでした。\
また、サーバサイドを用意するのもコストがかかります。\
そこで、今回はGitHub Actionsを使って、
定期的にcontributionsをJSON形式でGitHub Pagesで公開することにしました。

こちらがリポジトリです。

https://github.com/enkatsu/my-data

GitHub Actionsの流れは以下のようになっています。

1. 定期的にGitHub Actionsが実行する
1. PythonでGitHub APIを叩いて
1. 実行結果をJSONファイルに保存する
1. gh-pagesブランチにコミットする
1. GitHub Pagesをデプロイする

一日に一回、上記の処理が実行されて、以下のJSONが更新されます。

https://enkatsu.github.io/my-data/contributions.json

# 詳細

## Pythonを使ったcontributionsの取得

下記のスクリプトでcontributionsを取得して、
`data/contributions.json` に保存しています。\
GraphQLライブラリは、
[gql](https://github.com/graphql-python/gql)を使用しています。\
また、ユーザ名は第一引数、認証用のトークンは実行時の第二引数から渡して使用しています。

```python
import json
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
import sys


def main():
    args = sys.argv

    if len(args) != 3:
        return

    user = args[1]
    token = args[2]
    headers = {
        'Authorization': f'Bearer {token}'
    }
    transport = AIOHTTPTransport(url='https://api.github.com/graphql', headers=headers)
    client = Client(transport=transport)
    query = gql('''
    query {
      user(login: "%s"){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
    ''' % user)
    result = client.execute(query)
    with open('data/contributions.json', 'w') as f:
        json.dump(result, f, indent=2)


if __name__ == '__main__':
    main()

```

## GitHub Actionsの設定

ワークフローのYAMLは以下のようになっています。\
基本的には参考文献のものと同じですが、
Pythonの実行時に `${{ secrets.GH_USER }}` と `${{ secrets.GITHUB_TOKEN }}` を
引数として渡しています。\
`${{ secrets.GITHUB_TOKEN }}` は、実行時にデフォルトで設定されます。\
`${{ secrets.GH_USER }}` は、GitHubのユーザ名を
Repository secrets に `GH_USER` として追加する必要があります。\
Repository secretsを追加するページはこちらです。\
`https://github.com/${username}/${reponame}/settings/secrets/actions`

```yaml
name: Update data

on:
  push:
  schedule:
    - cron: '0 0 * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.11
      uses: actions/setup-python@v1
      with:
        python-version: 3.11
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Run script
      run: |
        python main.py ${{ secrets.GH_USER }} ${{ secrets.GITHUB_TOKEN }}
    - name: deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./data
        publish_branch: gh-pages
```

## 可視化する

あとはp5.jsからAPIを叩いて可視化するだけです。\
こちらはシンプルな折れ線グラフで表示してみます。

```js
let totalContributions = -1;
let contributions = [];

function setup() {
    createCanvas(640, 480);
    var url = 'https://enkatsu.github.io/my-data/contributions.json';
    loadJSON(url, res => {
        totalContributions = res.user.contributionsCollection.contributionCalendar.totalContributions;
        contributions = res.user.contributionsCollection.contributionCalendar.weeks
            .map(week => week.contributionDays)
            .flat();
    });
}

function draw() {
    background(0);
    
    stroke(255);
    noFill();
    beginShape();
    contributions.forEach((contribution, index) => {
        const x = map(index, 0, contributions.length, 0, width);
        const y = map(contribution.contributionCount, 0, totalContributions, height, 0);
        vertex(x, y);
    });
    endShape();
}
```

# 参考文献

- https://zenn.dev/yuichkun/articles/b207651f5654b0
- https://qiita.com/Kanahiro/items/e7021b05199ae52e818b
