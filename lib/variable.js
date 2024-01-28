const Utils = require('./utils');

const Variable = class {
    constructor(name, label, no=1, scale=1) {
        this.name = name;
        if( label == undefined) {
            this.label = name;
        }else{
            this.label = label;
        }
        this.id = Utils.generateUUID();
        this.value = '';
        this.stageMonitorContainer = null;
        this.monitorLabel = null;
        this.monitorLabel = null;
        this.no = no
        this.scale = scale;
        this.init();
    }

    init() {

        const getElementById = (id) => document.getElementById(id)
        const createElement = (node) => document.createElement(node); 
        const _stageCanvasWrapper = getElementById('stageCanvasWrapper');
    
        const stageMonitorContainer = createElement('div');
        this.stageMonitorContainer = stageMonitorContainer;
        stageMonitorContainer.classList.add('monitor_monitor-container');
        stageMonitorContainer.classList.add('dragged-item');
        stageMonitorContainer.classList.add('dragTarget');
        stageMonitorContainer.id = `stageMonitorContainer_${this.id}`
        stageMonitorContainer.setAttribute("style","touch-action: none;");
    
        _stageCanvasWrapper.appendChild(stageMonitorContainer);
    
        const defaultMonitor = createElement('div');
        defaultMonitor.top = "100px";
        defaultMonitor.left = "100px";
        defaultMonitor.classList.add('monitor_default-monitor');
        stageMonitorContainer.appendChild(defaultMonitor);
        
        const monitorRaw = createElement('div');
        monitorRaw.classList.add('monitor_row');
        defaultMonitor.appendChild(monitorRaw);
    
        const monitorLabel = createElement('div');
        this.monitorLabel = monitorLabel;

        monitorLabel.classList.add('monitor_label');
        monitorRaw.appendChild(monitorLabel);
        monitorLabel.innerHTML  = `${this.label}`;

        const monitorValue = createElement('div');
        this.monitorValue = monitorValue;

        monitorValue.classList.add('monitor_value');
        monitorRaw.appendChild(monitorValue);
        monitorValue.innerHTML  = '    '; // 初期値スペース４文字分
    
        // canvas左上基準で位置決めする
        // すでに存在する Variable の表示をさけて表示させたい。
        // canvas のサイズ変更に合わせて top, left を変更したい。
        const top = 10;
        const left = 10;
        const scale = this.scale;
        stageMonitorContainer.style.top = `${top}px`;// (canvasClientRect.top+50) +"px";
        stageMonitorContainer.style.left =`${left}px` ;// (canvasClientRect.left+50) +"px";
        stageMonitorContainer.style.transform = `scale(${scale})`
        interact(stageMonitorContainer).styleCursor(false)
        interact(stageMonitorContainer).draggable({
          manualStart: false,
          listeners: {
            start(event) {
              event.target.classList.add('dragging');
            },
            move(event) {
              pos.x += event.dx
              pos.y += event.dy
              if( !event.target.classList.contains('dragging')) {
                //event.target.classList.add('dragging');
              }
              event.target.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`
            },
            end(event) {
              event.target.classList.remove('dragging');
            }
          },
        })
            
    }
    hide() {
        this.stageMonitorContainer.style.display = 'none';
    }
    show() {
        this.stageMonitorContainer.style.display = '';

    }
    changeLabel(label) {
        this.label = label;
        this.monitorLabel.innerHTML = `${this.label}`;
    }
    setValue(value, maxSize=10) {
        this.value = value;
        const _maxSize = maxSize;
        if(Utils.isNumber(this.value)) {
            const str = String(this.value);
            this.monitorValue.innerHTML = str.padStart(_maxSize, ' ');
        }else{
            this.monitorValue.innerHTML = this.value.padEnd(_maxSize, ' ');
        }
    }
}

module.exports = Variable;