# Visually Script

`visually-script` is a lightweight, zero-dependency library for programmatically creating Visually presentations using TypeScript or JavaScript.

It empowers developers to automate presentation creation, integrate Visually with other systems, or simply build complex presentations more efficiently.

## Installation

You can use this library directly in a Node.js environment or even in the browser. Since it has no dependencies, you can simply copy the `visually-script` directory into your project.

## Quick Start

The core idea is to build a `Presentation` object, add media and slides to it, and then export it as a JSON string. This JSON can then be imported into the Visually application.

Here's a simple example:

```javascript
// Import the necessary classes.
// The 'vis' object is provided by the Visually app when you drop a .js file.
// In a local Node.js environment, you would use:
// const { Presentation, Slide } = require('./visually-script');

const { Presentation, Slide } = vis;

// 1. Create a new presentation
const pres = new Presentation();

// 2. Add different types of media
pres.addImage({ name: 'A beautiful landscape', dataUrl: 'https://picsum.photos/seed/1/1280/720' });
pres.addYouTube({ name: 'Next.js Conf', url: 'https://www.youtube.com/watch?v=k_x21-J2d-I' });

// 3. Create a custom slide
const titleSlide = new Slide('Title Slide');
titleSlide.setBackgroundColor('#5B8E7D');
titleSlide.addText({
    content: 'Welcome to Visually Script!',
    fontSize: 60,
    color: '#FFFFFF',
    fontFamily: 'Belleza',
    x: 150, y: 200, width: 700, height: 100,
    textAlign: 'center'
});
pres.addSlide(titleSlide);

// 4. Add a source for the final slide
pres.addSource({
    title: 'Visually Script Documentation',
    url: 'https://github.com/your-repo/visually-script',
    notes: 'The official documentation.'
});

// 5. Return the presentation object. Visually will handle the export.
return pres;

```

## How to Use with Visually App

1.  Create a `.js` file (e.g., `my-presentation.js`).
2.  Write your script using the classes and methods documented below. Make sure your script returns an instance of the `Presentation` class.
3.  Drag and drop your `.js` file directly into the "Upload File" area in the Visually application.
4.  Visually will execute the script, generate the presentation JSON, and load it into the media queue automatically.

## API Reference

### `Presentation` Class

This is the main class for creating a presentation.

#### `new Presentation()`

Creates a new, empty presentation object.

#### `.addMediaItem(item)`

A generic method to add any valid `MediaItem`. It's generally easier to use the specific helper methods below.

#### `.addPdf({ name, dataUrl, ... })`
#### `.addImage({ name, dataUrl, ... })`
#### `.addYouTube({ name, url, ... })`
#### `.addVideo({ name, dataUrl, ... })`
#### `.addUrl({ name, url, ... })`

Adds a media item of the specified type to the presentation queue.
- **`name`**: `string` - The name displayed in the queue.
- **`dataUrl`**: `string` - The URL or base64 data URI for the media.
- **`url`**: `string` - The original URL for YouTube or websites.
- **`...`**: Other optional properties like `notes`, `transition`.

#### `.addSlide(slide)`

Adds a custom slide to the queue.
- **`slide`**: `Slide` - An instance of the `Slide` class.

#### `.addSource({ title, url, ... })`

Adds a source to the presentation's bibliography.
- **`title`**: `string` - The title of the source.
- **`url`**: `string` - The URL of the source.
- **`...`**: Other optional properties like `notes`, `tags`.

#### `.toJSON()`

Returns the complete presentation object as a JSON string, ready for import into Visually.

---

### `Slide` Class

Used to build custom slides.

#### `new Slide(title, backgroundColor?)`

Creates a new slide.
- **`title`**: `string` - The name of the slide.
- **`backgroundColor`**: `string` (optional) - Hex color for the background (e.g., `#FFFFFF`).

#### `.addText({ content, x, y, ... })`

Adds a text element to the slide.
- **`content`**: `string` - The text to display.
- **`x`, `y`, `width`, `height`**: `number` - Position and dimensions.
- **`...`**: Styling properties like `fontSize`, `color`, `fontFamily`, `textAlign`, `animation`.

#### `.addImage({ src, x, y, ... })`

Adds an image element to the slide.
- **`src`**: `string` - The URL or base64 data URI for the image.
- **`x`, `y`, `width`, `height`**: `number` - Position and dimensions.
- **`...`**: `alt` text.

#### `.addMath({ content, x, y, ... })`

Adds a formula element to the slide.
- **`content`**: `string` - The formula string (e.g., `E = mc^2`).
- **`...`**: Styling properties like `fontSize`, `color`.

#### `.addShape({ shape, x, y, ... })`

Adds a shape element (rectangle, line, arrow) to the slide.
- **`shape`**: `'rectangle' | 'line' | 'arrow'`
- **`...`**: Styling properties like `strokeColor`, `strokeWidth`, `fillColor`.
