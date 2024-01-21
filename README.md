# scratch3LikeJs

Javascript library for Scratch3-style programming

## Version

0.0.1  ( 作成中 )

## 組み込みをしない機能

- マイク機能
- カメラ機能

## 解説

### P

scratch3LikeJsは、グローバル変数 P を経由して使います。

### preload

ロード処理は preloadメソッドの中に記述します。
P.preloadの定義があるときは最初に呼び出されます。
P.preloadの定義がないときは P.prepare()メソッドが呼び出されます。
```
P.preload = function() {
    P.loadImage('../assets/xxxx.svg', 'Image01');
    P.loadSound('../assets/xxxx.wav', 'Sound01');
}
```
#### ロードした画像データの参照方法

指定した名前と同じプロパティが作成されます。次に例を示します。

```
P.images.Image01
```
#### ロードした音データの参照方法

指定した名前と同じプロパティが作成されます。次に例を示します。

```
P.sounds.Sound01
```

### prepare

preload処理をすべて完了したとき（ロードをすべて完了したとき）、P.prepare()メソッドが呼び出されます。
prepareメソッドのなかで、StageやSpriteのインスタンスを作る想定です。
```
P.prepare = function() {

}
```

### setting

prepareメソッドが完了した後に、P.setting()メソッドが呼び出されます。
各種イベント（旗イベント、クリックイベントなど）の定義をここで記述する想定です。
```
P.setting = function() {

}
```


# サンプル

## sample00
スクリプトが空のときは、白色の背景が表示されるサンプルです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample00/

## sample01
画像をロードして ステージに表示するサンプルです。

旗をクリックする前に背景を表示しています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample01/

## sample02
画像をロードして 旗クリック時に ステージ時に画像をステージに表示するサンプルです。

最初の背景は白で、旗クリックすることで背景を表示するようにしています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample02/

## sample03
音をロードして「終わるまで音を鳴らす」をずっと繰り返すサンプルです

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample03/

## sample04
ステージをクリック（タッチ）したときに「終わるまで音を鳴らす」をずっと繰り返すサンプルです。

クリックするたびに「ずっと音を鳴らす」ので、音が重なって聞こえます。うるさいのでご注意ください。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample04/


## sample05
ステージをクリック（タッチ）したときに「終わるまで音を鳴らす」をずっと繰り返す、サンプルです。

再度クリック（タッチ）したときに音を止めるようにしています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample05/

## sample06
スプライトを作って表示するサンプルです。単に表示するだけです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample06/

## sample07
スプライトを 動かすサンプルです。

もし端に近づくと動く速度が遅くなるようにしています。

速度を遅くしているのは跳ね返る様子を「しっかりと」見るためです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample07/

## sample08
スプライトを 動かすサンプルです。端に触れたらミャーと鳴きます。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample08/

## sample09
スプライトのクローンを作るサンプルです。

スプライトをクリック（タッチ）したら、クローンを作ります。

クローンされたら動きだし、クローンが端に着いたら跳ね返ります。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample09/

## sample10
スプライトのクローンを作るサンプルです。

マウスポインターがスプライトに触ったらクローンを作るようにしています。

また、端に触れたら跳ね返りミャーと鳴きます。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample10/

## sample11
スプライトが 〇秒で「どこかの」場所へ移動するサンプルです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample11/

## sample12
クリックした場所へスプライトが移動するサンプルです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample12/

## sample13
クリックした位置へスプライトが〇秒で移動するサンプルです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample13/

## sample14
スプライトが マウスポインターを追いかけるサンプルです。

マウスポインターがステージの外にあってもマウスポインターを追いかけます。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample14/

## sample15
スプライトはステージの端を越えては進めないことを示すサンプルです。

端に到達すると「Scratch3」と同様に途中で止まる様子を確認してください。

なお、ドラッグはできませんのでご注意ください。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample15/

## sample16
３つのスプライトがマウスポインターを追いかけるサンプルです。

回転方向として、「左右のみ回転」「回転しない」「自由に回転」を用意しています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample16/

## sample17
十字スプライトを 右側に回転させ、マウスポインターに触れたら 蝶のクローンを作るサンプルです。

蝶のクローンはマウスポインターの位置に出現させます。
また、蝶のスプライトは非表示とし、クローンされたときにクローンを表示に切り替えています。

クローンは指定した時間数（ﾐﾘ秒）だけ生きているようにし、時間を経過したクローンは消える機能があります。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample17/

## sample18
キーボード入力を受け取り、スプライトの動きを制御します。

矢印キーにより左右に動き、スペースキーで弾を発射するシューティングゲームのサンプルです。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample18/

## sample19
スプライトの「ふきだし」のサンプルです。「言う」「考える」の２パターンがあります。

Scratch3では出来ませんが「ふきだし」の大きさを変えることができます。

２匹のネコがそれぞれ異なる大きさの「ふきだし」を出しています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample19/

## sample20

イベントメッセージを送り、イベントメッセージを受け取ったときに、吹き出しを表示するサンプルです。

「メッセージを送って待つ」機能も実装しています。

吹き出しは「〇秒言う」のように 〇秒間だけ表示される吹き出しにしています。

２匹のネコが会話をして、会話が終われば退場するようにしています。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample20/

## sample21

スピーチ機能の実装を使ったサンプルです。

ネコにマウスオーバーすると「なになにどうしたの？」と繰り返します。

ネコをクリックすると「そこそこ、そこがかゆいの」とスピーチします。

https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample21/


