const Variables = class {

    constructor() {
        this.map = new Map();

    }

    addVariable(variable) {
        if(!this.map.has(variable.name)) {
            this.map.set(variable.name, variable);
        }
    }

    changeLabel(name, label) {
        if(this.map.has(name)) {
            const variable = this.map.get(name);
            variable.changeLabel(label);
        }
    }
    setValue(name, value, maxSize=10) {
        if(this.map.has(name)) {
            const variable = this.map.get(name);
            variable.setValue(value, maxSize);
        }

    }
}
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

P.prepare = async function() {
    const a = new P.Stage();
    P.test01 = new P.Variable('test01','Counter', 1, 2);
    P.test01.changeLabel('Counter');
    P.test02 = new P.Variable('test02', 'マウス', 2, 2);
    P.test02.changeLabel('マウス');


    
}

P.setting = async function() {

    P.stage.whenFlag( async function() {
        this.addImage( P.images.Jurassic );

        let counter = 0;
        for(;;) {
    
            P.test01.setValue(counter,3);
    
            await P.wait(1000);
            counter += 1;
        }
    });

    P.stage.whenFlag( async function() {
        console.log('whenFlag')
        let counter = 0;
        for(;;) {
            const position = P.mousePosition;
            P.test02.setValue(` ${Math.ceil(position.x)} , ${Math.ceil(position.y)}`);
    
            await P.wait(33);
            counter += 1;
        }
    });

}