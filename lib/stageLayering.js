class StageLayering {
    static get BACKGROUND_LAYER () {
        return 'background';
    }

    static get VIDEO_LAYER () {
        return 'video';
    }

    static get PEN_LAYER () {
        return 'pen';
    }

    static get SPRITE_LAYER () {
        return 'sprite';
    }

    static get TEXT_LAYER () {
        return 'text';
    }

    // Order of layer groups relative to each other,
    static get LAYER_GROUPS () {
        return [
            StageLayering.BACKGROUND_LAYER,
            StageLayering.VIDEO_LAYER,
            StageLayering.PEN_LAYER,
            StageLayering.SPRITE_LAYER,
            StageLayering.TEXT_LAYER
        ];
    }
}

module.exports = StageLayering;