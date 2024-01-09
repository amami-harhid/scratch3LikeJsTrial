const Importer = class {

    static get REGEX_DATA_IMAGE_URL() {
        return /^data:image\\/;
    }
    static get REGEX_SVG_DATA_IMAGE_URL() {
        return /^<svg\s/;
    }
    static get REGEX_SVG_DATA_IMAGE_FILE() {
        return /^.+\.svg$/;
    }
    static isSVG(image) {
        if(typeof image === 'string') {
            const dataImageUrl = image;
            if(dataImageUrl.match(Importer.REGEX_SVG_DATA_IMAGE_URL)){
                return true;
            }
        }
        return false;
    }
    static async loadImage(image, name) {
        if(image) {
            if(typeof image === 'string') {
                if(image.match(Importer.REGEX_SVG_DATA_IMAGE_FILE)){
                    let _text = await Importer._svgText(image);
                    return {name:name,data:_text};
                }else{
                    const localUrl = image;
                    let _img = await Importer._loadImage(localUrl);
                    return {name:name,data:_img};
                }
            }
        }
    }
    static async _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = src;
        });
    }
    static async _svgText(image) {
        let svg = await fetch(image);
        let _text = await svg.text();
        return _text;
    }

    static async loadSound(sound, name) {
        if(sound) {
            if(typeof sound === 'string') {
                let responce = await fetch(sound);
                let buffer = await responce.arrayBuffer();
                let data =  new Uint8Array(buffer);
                return {name:name, data:data};
            }
        }
        // 例外を起こすべきところ。
    }

};

module.exports = Importer;