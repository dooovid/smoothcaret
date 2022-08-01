# smoothcaret
A smooth caret library for javascript. <br />
See a live demo <a href="https://dooovid.github.io/smoothcaret/demo/index.html">here</a>.

<img src="https://dooovid.github.io/smoothcaret/demo/demo.gif"></img>

# How to use:

Put this anywhere in your HTML file:
```html
<script src="https://dooovid.github.io/smoothcaret/demo/smoothCaret.min.js" defer></script>
```

Simply put your input element inside a container and add a caret div with the required class names and styling on everytything (shown bellow)
<br />
*note: this also works on type=password inputs*
```html
<div class="sc-container">
  <input data-sc="" class="smoothCaretInput" placeholder="type something..." type="text" >
  <div class="caret" style="width: 2px; height: 60%; background-color: #00a6ff;" ></div>
</div>
```
