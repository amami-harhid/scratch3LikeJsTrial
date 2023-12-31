const Importer = class {

    static get REGEX_DATA_IMAGE_URL() {
        return /^data:image\\/;
    }
    static get REGEX_SVG_DATA_IMAGE_URL() {
        return /^<svg\s/;
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
    static async loadImage(image) {
        if(image) {
            if(typeof image === 'string') {
                if(image.match(Importer.REGEX_DATA_IMAGE_URL)){
                    const dataImageUrl = image;
                    if(dataImageUrl.match(Importer.REGEX_SVG_DATA_IMAGE_URL)){

                    }else{

                    }
                    return dataImageUrl;
                }else{
                    const localUrl = image;
                    let _text = await Importer._svgText(localUrl);
                    return _text;
                }
            }
        }
    }
    static async _svgText(image) {
        let svg = await fetch(image);
        let _text = await svg.text();
        return _text;
    }

};

module.exports = Importer;