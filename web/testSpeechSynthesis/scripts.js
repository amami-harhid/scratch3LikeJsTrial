/**
 * TEST SPEECH
 * 
 * 汎用スピーチの実験
 * 
 * Scratch3のスピーチは 次の仕組みです
 * 
 * https://github.com/scratchfoundation/scratch-vm/blob/develop/src/extensions/scratch3_text2speech/index.js#L742
 *
 * (1) URL を組み立てる
 * (2) fetchして音をGETする
 * (3) 音を soundPlayer に食わせて
 * (4) ピッチや音量を与えて 再生する
 * (5) soundPlayer.play() の中で stop を EMIT している。それを受けて SoundPlayerをdeleteしている。
 * 
 * ■ ja-JP, male, あいうえお 
 * https://synthesis-service.scratch.mit.edu/synth?locale=ja-JP&gender=male&text=%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A
 * 
 */



// 発言定義
const Speech = [
    {'text': "Hi, Dave.", "lang": "en-US", "rate": 0.5, "pitch": 0.5, "volume": 0.75},
    {'text': "Hi, Dave.", "lang": "ja-JP", "rate": 0.5, "pitch": 0.5, "volume": 0.75},
]


P.prepare = function() {

    
}

const AYUMI = /Ayumi/;
const HARUKA = /Haruka/;
const ICHIRO = /Ichiro/;
const SAYAKA = /Sayaka/;
const US_FAMELE = /US.+English/;
const UK_MAN = /UK.+Male/;
const UK_FAMALE = /UK.+Female/;
const Target = SAYAKA;

P.setting = function() {
    console.log('setting')
    P.runtime.on("Speech", function(voices) {
        voices.map(v=>{
            console.log(v)
        })

        const voiceArr = voices.filter(v=>{
            return v.name.match(Target)
        })
        if(voiceArr.length>0){
            const voice = voiceArr[0]
            P.speech(voice, "今日はよい天気ですね")
    
        }
    })

    function appendVoices() {
        console.log('appendVoices')
        // ①　使える声の配列を取得
        // 配列の中身は SpeechSynthesisVoice オブジェクト
        const voices = speechSynthesis.getVoices()
        if(voices) {
            const v = voices.filter(v=>{
                const name = v.name;
                return name.match(/Japanes|English/)
            });
            P.runtime.emit('Speech', v)
        }
    }
    speechSynthesis.onvoiceschanged = e => {
        appendVoices()
    }

    
}

P.speech = function(voice, text) {
    console.log('voice=',voice);
    const uttr = new SpeechSynthesisUtterance(text)
    uttr.voice = voice
    speechSynthesis.speak(uttr)

}

