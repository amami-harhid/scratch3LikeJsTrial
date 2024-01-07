const MyStage = class extends P.Stage {
  constructor(name) {
    const render = new P.Render();
    super(render,name);
    this._init();
    const me = this;    
    this.whenFlagDirect(async ()=>{
      const sounds = [
        {name: 'Chill', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
        {name: 'Chill1', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova1', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
        {name: 'Chill2', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova2', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
        {name: 'Chill3', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova3', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
        {name: 'Chill4', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova4', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
        {name: 'Chill5', url: '../assets/Chill.wav', options: {'volume':5}},
        {name: 'BossaNova5', url: '../assets/Bossa Nova.wav', options: {'volume':100}},
      ];
      
      (async () => {
        await sounds.reduce((promise, _elem) => {
          return promise.then(async () => {
            const _name = _elem.name;
            const _url = _elem.url;
            const _options = ('options' in _elem)? _elem.options: {};
            //console.log(`name=${_name}`);
            await me.loadSound(_name, _url, _options);
          });
        }, Promise.resolve());
      })();
    });
  }
  async _init() {
    const me = this;    
    const sounds = [
      {name: 'mural', url: '../assets/Mural.png'},
      {name: 'mural2', url: '../assets/Mural.png'},
      {name: 'mural3', url: '../assets/Mural.png'},
      {name: 'mural4', url: '../assets/Mural.png'},
    ]
    const loader = async function(name, url) {
      return new Promise(async(resolve) => {

        await me.loadImage(name,url);
        resolve();
      });
    };
    (async () => {
      await Promise.all(
        sounds.map( async (_elem) => {
          const _name = _elem.name;
          const _url = _elem.url;
          await loader(_name, _url);
        })
      );
    })();
    
  }
}
