//smoothCaret.js made by doovid <3
function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

function getTextWidth(text, font) {
    let ctx = document.querySelector('#sc-canvas').getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width;
}

//constants: necesary styling, canvas for measuring text and password cover character depending on browser
const styleString = '.sc-container{display:grid;grid-template-columns:repeat(1,1fr);}.smoothCaretInput{grid-column:1/3;caret-color:transparent}.caret{grid-column:2/-2;align-self:center;transition:.2s;opacity: 0;}.caret,.smoothCaretInput{grid-row:1/2}';
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
        this.font = (passwordChar == '\u2022' && inputElem.type == 'password' && !navigator.userAgent.match(/chrome|chromium|crios/i)) ? `${parseFloat(css(inputElem, 'font-size')) + 6.25}px ${css(inputElem, 'font-family')}` : `${css(inputElem, 'font-size')} ${css(inputElem, 'font-family')}`; 
        this.maxMargin = parseInt(css(inputElem.parentElement, 'width'))-10;
        this.caretMargin = parseInt(css(inputElem, 'padding-left')) + 2;
        this.caretWidth = parseInt(caretElem.style.width);
        this.letterSpacing = (parseInt(css(inputElem, 'letter-spacing'))) ? parseInt(css(inputElem, 'letter-spacing')) : 0;
        this.caretElem = caretElem;
        this.inputElem = inputElem;
        this.textWidth = undefined;
        this.index = index;
    }

    init() {
        console.log(this.letterSpacing)
        this.inputElem.dataset.sc = this.index;
        this.pw_ratio = (this.inputElem.type == 'password') ? getTextWidth(passwordChar+passwordChar, this.font) - getTextWidth(passwordChar, this.font) : null;
        this.inputElem.addEventListener('input', (e) => this.update((e.target.type === 'password') ? Array(e.target.value.length + 1).join(passwordChar) : e.target.value));
        this.inputElem.addEventListener('blur', () => {this.caretElem.style.opacity = ''; this.caretElem.style.transform = '';});
    }

    update(text) {
        this.caretElem.style.opacity = '1';
        this.textWidth = (this.pw_ratio) ? this.pw_ratio * text.length + this.caretMargin + this.letterSpacing * (text.length-1) : (getTextWidth(text, this.font) > 0) ? getTextWidth(text, this.font) + this.caretMargin + this.letterSpacing * (text.length-1) : this.caretMargin - this.caretWidth / 2;
        (this.textWidth > this.maxMargin) ? void(0) : this.caretElem.style.transform = `translateX(${this.textWidth}px)`;
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
