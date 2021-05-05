---
title: 'Create a Dark Mode toggle with CSS and JavaScript'
date: 2021-05-05
description: Let's make a dark mode toggle using CSS and JavaScript. It saves the user preference using localStorage so that the browser remembers it the next time the site is visited.
banner: 'https://i.ibb.co/7QW0y5v/andre-benz-Jn-B8-Gio4-GZo-unsplash.jpg'
social: 'https://i.ibb.co/PTXgyZV/Remodeling-Part-2.png'
tags:
  - general
  - recent
---

You probably heard a fair share of comments about Dark Mode, used apps and websites that have it, even your current OS has it activated. But as a web developer you've wondered "How do I implement it in a project?" Well, here I'll try to make a guide using HTML, CSS and the localStorage property in JavaScript.
\
\
**NOTE:** For a more in depth guide on Dark Mode I'd recommend [this article](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/#using-a-body-class) from [CSS Tricks](https://css-tricks.com/)
\
\
**Disclaimer:** We won't be making a full website, just a simple hero section with a button that toggles the dark mode on top of it.
\
\
Alright then, let's get started!
<br>
<br>
<br>

### Setting the HTML

<br>
Let's start by creating the boilerplate of the HTML:

```html
<body>
  <nav class="nav">
    <p>Click the button! →</p>
    <button
      id="dark-mode-toggle"
      class="dark-mode-toggle"
      aria-label="Icon-only Button"
      role="button"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z"
        ></path>
      </svg>
    </button>
  </nav>
  <section class="section">
    <h1>Your title goes here</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, unde
      tenetur! Error veniam tempore vel voluptatem temporibus quisquam ex iusto?
    </p>
    <div class="btn-group">
      <a href="#" class="btn btn-primary">Main Action</a>
      <a href="#" class="btn btn-secondary">Secondary Action</a>
    </div>
  </section>
</body>
```

<br>

Alright, this should be enough. Now, let's highlight a few things:

1. First of all, we use the `<button></button>` tags because **it is a button** and its function is to make anything happen on the site not take us to another site or section within the current site.
2. For accessibility issues, and because it's an icon button, we have to specify it's an icon button. That's why we added `aria-label="Icon-only Button"` and `role="button"`.
3. Since the SVG it's a decorative element and doesn't provide any semantic value we add the `aria-hidden="true"` attribute so that it can be ignored/skipped by any assistive technology used by the reader/user. Also we added the `focusable="false"` attribute so that when the button is focused a "double focus" is prevented. Also, we added `fill="currentColor"` inside it so that, as the name suggests, the color of the SVG is the same as the content of the body.

<br>
<br>

### Adding some styling

<br>

For the styling we have the following:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins&family=Rubik:wght@400;600;700;800;900&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --clr-light: #ffea64;
  --clr-dark: #212121;
  --clr-accent: #e63838;

  --foreground: var(--clr-dark);
  --background: var(--clr-light);

  --ff-title: 'Rubik', sans-serif;
  --ff-body: 'Poppins', sans-serif;
}

.darkmode {
  --clr-light: #ffea64;
  --clr-dark: #212121;
  --clr-primary: #202302;
  --clr-secondary: #fdf9dc;
  --clr-accent: #e63838;

  --foreground: var(--clr-light);
  --background: var(--clr-dark);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--ff-body);
  font-size: 18px;
  line-height: 1.6;
}

h1 {
  font-size: calc(3rem + 7vw);
  font-family: var(--ff-title);
  margin: 0 0 0.25em;
  line-height: 1;
}

.container {
  padding: 0 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtitle {
  max-width: 600px;
}

.cta-buttons {
  margin: 2em 0;
  display: relative;
}

.btn {
  padding: 1em 2em;
  text-decoration: none;
  text-transform: uppercase;
  border-radius: 0.5rem;
  position: relative;
  display: inline-block;
  line-height: 1;
}

.btn + .btn {
  margin-left: 1rem;
}

.btn-secondary {
  background: var(--background);
  color: var(--foreground);
  border: currentColor solid 2px;
}

.btn-primary {
  background: var(--clr-accent);
  color: var(--foreground);
}

.btn::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: var(--foreground) 2px solid;
  left: -4px;
  top: 4px;
  border-radius: inherit;
  z-index: -1;
}

.dark-mode-toggle {
  z-index: 100;
  color: var(--foreground);
  border: 2px solid currentColor;
  padding: 4px;
  background: transparent;
  cursor: pointer;
  border-radius: 100%;
  width: 30px;
  height: 30px;
}
```

<br>

If you're familiar with CSS this is a standard styling for a hero section with two buttons. Now, a couple of notable things:

1. We're using [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) inside the `:root` pseudo-class so that they can be used across the whole document and we don't have to memorize things like `#ffea64` and use `--clr-light` which can be easier to memorize, especially if the site grows and the CSS along with it by making the use of values more repetitive.

2. We added the `.darkmode` class but it's not directly in the HTML since it'll be added (and removed) using JavaScript every time the button is clicked/pressed.

<br>
<br>

### Adding JavaScript

<br>

Alright, here comes the juicy part. The code in JavaScript should look like this:

(**NOTE:** Don't forget to add the `<script></script>` tags right above the closing `</body>` tag.)

```js
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkMode', 'enabled');
};

const disableDarkMode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkMode', null);
};

if (darkMode === 'enabled') {
  enableDarkMode();
}

darkModeToggle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode');

  if (darkMode !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
```

<br>

Let's dissect this, here's what's happening:

1. We're declaring the variable `darkMode` and check the local storage to see if there's anything called `'darkMode'`. We used `let` because the variable will change over time within the site. Now, `localStorage` basically is the local storage inside our computer's browser that won't be loaded to any server (for any privacy issue `localStorage` is very safe since the data is stored inside your computer and not in some server).

2. Now, we have another variable called `darkModeToggle` which will search inside our document for the item with the id of `dark-mode-toggle`.

3. Our third variable will be called `enableDarkMode` which will do the following:

   - Add the `darkmode` class to the whole document (the body). And,
   - Update the `darkMode` in the local storage by enabling it.

4. Our fourth variable called `disableDarkMode` will do the opposite of the `enableDarkMode` and that is:

   - Remove the `darkmode` class from the whole document (the body). And,
   - Update the `darkMode` in the local storage by disabling it.

5. Now, if the user/visitor already visited the site and enabled the dark mode we'll check if it's true with an `if` statement that checks the state and enables the dark mode. If it wasn't enabled, nothing will happen and the site will be seen with the light mode on.

6. Now then, what happens when somebody clicks the button? Well, here we'll use our `darkModeToggle` variable and add an event listener to it. The event here is `'click'` and when it's triggered what will happen is the following:
   - It'll get the `darkMode` setting within the local storage.
   - If the `darkMode` setting isn't enabled, enable it with an `if` statement. If it's enabled, switch it off with an `else` statement.

Aaaand we're done. What we've done here is what I implemented to this website and, as you can see, we used a fairly short amount of colors. I did, in my website, because I like to keep it simple, but you can add more colors to see how it fares.
