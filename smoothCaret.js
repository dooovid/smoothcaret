function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

function getTextWidth(text, font) {
    let ctx = document.querySelector('#sc-canvas').getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width;
}

//constants: necesary styling, canvas for measuring text and password cover character depending on browser
const styleString = '.sc-container{display:grid;grid-template-columns:repeat(1,1fr);}.smoothCaretInput{grid-column:1/3;caret-color:transparent}.caret{grid-column:2/-2;align-self:center;transition:.2s}.caret,.smoothCaretInput{grid-row:1/2}';
const style = document.createElement('style');
const canvElem = document.createElement('canvas');
const passwordChar = navigator.userAgent.match(/firefox|fxios/i) ? '\u25CF' : '\u2022';

//appending constants to dom
style.innerText = styleString
document.head.append(style);
canvElem.id = 'sc-canvas';
canvElem.style.display = 'none';
document.body.appendChild(canvElem);

let smoothCarets = [];
let caretPosString;

class SmoothCaret {
    constructor(caretElem, inputElem, index) {
        this.font = `${css(inputElem, 'font-size')} ${css(inputElem, 'font-family')}`;
        this.maxMargin = parseInt(css(inputElem.parentElement, 'width'))-10;
        this.caretMargin = parseInt(css(inputElem, 'padding-left')) + 2;
        this.caretWidth = parseInt(caretElem.style.width);
        this.caretElem = caretElem;
        this.inputElem = inputElem;
        this.textWidth = undefined;
        this.index = index;
    }

    init() {
        this.inputElem.dataset.sc = this.index;
        this.inputElem.addEventListener('input', (e) => this.update((e.target.type === 'password') ? Array(e.target.value.length + 1).join(passwordChar) : e.target.value));
        this.inputElem.addEventListener('blur', () => {this.caretElem.style.opacity = '0'; this.caretElem.style.marginLeft = '';});
    }

    update(text) {
        this.caretElem.style.opacity = '1';
        this.textWidth = (getTextWidth(text, this.font) > 0) ? getTextWidth(text, this.font) + this.caretMargin : this.caretMargin - this.caretWidth / 2;
        (this.textWidth > this.maxMargin) ? void(0) : this.caretElem.style.marginLeft = `${this.textWidth}px`;
    }
}

function initsmoothCarets() {
    document.querySelectorAll('.sc-container').forEach((element, index) => {
        smoothCarets.push(new SmoothCaret(element.children[1], element.children[0], index));
        smoothCarets[index].init();
    });

    setInterval(() => {
        if (document.activeElement.getAttribute('data-sc')) {
            caretPosString = (document.activeElement.type === 'password') ? caretPosString = Array(document.activeElement.value.length + 1).join(passwordChar).slice(0, document.activeElement.selectionStart) : caretPosString = document.activeElement.value.slice(0, document.activeElement.selectionStart);
            smoothCarets[parseInt(document.activeElement.dataset.sc)].update(caretPosString);
        }
    });
}

initsmoothCarets();