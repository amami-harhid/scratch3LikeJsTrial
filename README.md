# scratch3LikeJsTrial
Support for using Scratch3 libraries

Scratch3 の各種ライブラリを試すための実験場です。

ScratchRender, ScratchAudio が使えます。

# サンプル

## sample01

### scratch-render
ScratchRender で 画像(SVG)の取り込み、座標変更、エフェクト効果、などを試行しています。

### scratch-audio
ScratchAudio でサウンド(wav,mp3)の取り込み、再生、などを試行しています。「終わるまで鳴らす」、音の大きさを変更、などを試行しています。

### WEBページ
https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample01/

## sample02

### scratch-audio
クラスSoundsとしてまとめ中( sample02/main.js )
scratch-audioの  Pan のエフェクトの設定がうまくいかない（未調査）。
使い方を間違えているのかもしれない、これは今後の継続調査課題である。

#### 音量
Sounds#volume = 〇〇〇; // 〇〇〇は数字
再生中でも音量を変化させることができる

#### ピッチ
Sounds#pitch = 〇〇〇; // 〇〇〇は数字
再生中でもピッチを変化させることができる

#### パン
未調査


### WEBページ
https://amami-harhid.github.io/scratch3LikeJsTrial/web/sample02/


### 緑の旗
今後の改善課題：表示可能なウィンドウ域が狭いとき 旗表示が崩れてしまう。