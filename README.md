# scratch3LikeJs

Javascript library for Scratch3-style programming

## Version

0.0.1  ( 作成中 )

## 組み込みをしない機能

- マイク機能
- カメラ機能

## 解説

### P

scratch3LikeJsは、トップ変数 P を経由して使います。

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
空のステージを表示する

https://amami-harhid.github.io/scratch3LikeJs/web/sample00/

## sample01
画像をロードして ステージに表示する

https://amami-harhid.github.io/scratch3LikeJs/web/sample01/

## sample02
画像をロードして 旗クリック時に ステージ時に画像をステージに表示する

https://amami-harhid.github.io/scratch3LikeJs/web/sample02/

## sample03
音をロードして「終わるまで音を鳴らす」をずっと繰り返す。

https://amami-harhid.github.io/scratch3LikeJs/web/sample03/

## sample04
ステージをクリック（タッチ）したときに「終わるまで音を鳴らす」をずっと繰り返す

https://amami-harhid.github.io/scratch3LikeJs/web/sample04/


## sample05
ステージをクリック（タッチ）したときに「終わるまで音を鳴らす」をずっと繰り返す
再度クリック（タッチ）したときに音を止める。

https://amami-harhid.github.io/scratch3LikeJs/web/sample05/

## sample06
スプライトを作って表示する

https://amami-harhid.github.io/scratch3LikeJs/web/sample06/

## sample07
スプライトを 動かす。もし端に着いたら跳ね返る。

https://amami-harhid.github.io/scratch3LikeJs/web/sample07/

## sample08
スプライトを 動かす。端に触れたらミャーと鳴く。

https://amami-harhid.github.io/scratch3LikeJs/web/sample08/

## sample09
スプライトのクローンを作る。
スプライトをクリック（タッチ）したら、クローンを作る。
クローンされたら動きだす(もし端に着いたら跳ね返る)

https://amami-harhid.github.io/scratch3LikeJs/web/sample09/

## sample10
スプライトのクローンを作る。
マウスポインターがスプライトに触ったらクローンを作る(端に触れたら跳ね返りミャーと鳴く)

https://amami-harhid.github.io/scratch3LikeJs/web/sample10/

## sample11
スプライトが １秒で「どこかの」場所へ移動する

https://amami-harhid.github.io/scratch3LikeJs/web/sample11/

## sample12
スプライトが クリックした場所へ移動する

https://amami-harhid.github.io/scratch3LikeJs/web/sample12/

## sample13
スプライトがクリックした位置へ１秒で移動する

https://amami-harhid.github.io/scratch3LikeJs/web/sample13/

## sample14
スプライトが マウスポインターを追いかける。
マウスポインターがステージの外にあってもマウスポインターを追いかける。

https://amami-harhid.github.io/scratch3LikeJs/web/sample14/

## sample15
スプライトはステージの端を越えては進めない。途中で止まる。

https://amami-harhid.github.io/scratch3LikeJs/web/sample15/

## sample16
３つのスプライトがマウスポインターを追いかける。
回転方向として、「左右のみ回転」「回転しない」「自由に回転」を用意する

https://amami-harhid.github.io/scratch3LikeJs/web/sample16/

## sample17
十字スプライトを 右側に回転させ、マウスポインターに触れたら 蝶のクローンを作る。
蝶のクローンはマウスポインターの位置に出現させる。
蝶のスプライトは非表示とし、クローンされたときにクローンを表示に切り替える。
クローンは指定した時間数（ﾐﾘ秒）だけ生きているようにし、時間を経過したクローンは消える。

https://amami-harhid.github.io/scratch3LikeJs/web/sample17/

## sample18
キーボード入力を受け取り、スプライトの動きを制御します。
矢印キーにより左右に動き、スペースキーで弾を発射するシューティングゲームのサンプルです。

【未完成】

