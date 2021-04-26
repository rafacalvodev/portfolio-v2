const { DateTime } = require('luxon');
const fs = require('fs');
const socialImages = require('@11tyrocks/eleventy-plugin-social-images');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const emojiRegex = require('emoji-regex');
const emojiReadTime = require('@11tyrocks/eleventy-plugin-emoji-readtime');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const Image = require('@11ty/eleventy-img');
const pluginCloudinaryImage = require('eleventy-plugin-cloudinary');
const eleventyGoogleFonts = require('eleventy-google-fonts');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ['avif', 'jpeg', 'png', 'svg', 'jpg'],
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets/fonts');
  eleventyConfig.addPlugin(eleventyGoogleFonts);
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/assets/img');
  // Watch sass folder for changes
  eleventyConfig.addWatchTarget('src/sass/');

  //Cloudinary
  eleventyConfig.cloudinaryCloudName = 'dd6wemi8c';
  eleventyConfig.addPlugin(pluginCloudinaryImage);

  //Images configs
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addJavaScriptFunction('image', imageShortcode);

  eleventyConfig.addFilter('jsonTitle', (str) => {
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, '$2&nbsp;$3&nbsp;$4');
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(emojiReadTime, {
    emoji: '👓',
    label: 'mins',
    wpm: 300,
    bucketSize: 3,
  });

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Alias `layout: post` to `layout: layouts/post.njk`
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addFilter('filterTagList', (tags) => {
    // should match the list in tags.njk
    return (tags || []).filter(
      (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1
    );
  });

  // Create an array of all tags
  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return [...tagSet];
  });

  eleventyConfig.addFilter('slug', (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, '');

    return slugify(string, {
      lower: true,
      replacement: '-',
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: 'https://www.rafacalvo.me/',
    },
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#',
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, '-')
        .replace(/[().`,%·'"!?¿:@*]/g, ''),
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          const content_404 = fs.readFileSync('public/404.html');
          // Add 404 http status code in request header.
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};
