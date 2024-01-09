const Process = require('../lib/process');
const _P = Process.default;
window.P = _P;
const Element = _P.Element;
Element.insertCss();

window.onload = async function(){
    await _P._init();
};
