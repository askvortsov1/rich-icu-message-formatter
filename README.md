
ICU Message Formatter: Rich Text Extension
=====================

[![npm](https://img.shields.io/npm/v/@askvortsov/rich-icu-message-formatter.svg?maxAge=3600)](https://www.npmjs.com/package/@askvortsov/rich-icu-message-formatter)
[![Bundlephobia minified size](https://img.shields.io/bundlephobia/min/@askvortsov/rich-icu-message-formatter)](https://bundlephobia.com/result?p=@askvortsov/rich-icu-message-formatter)

This library extends [@ultraq/icu-message-formatter](https://github.com/ultraq/icu-message-formatter) to add a `rich` method.

You'll still probably need @ultraq/icu-message-formatter for its default plural type handler and select type handler.

Installation
------------

```
npm install @askvortsov/rich-icu-message-formatter @ultraq/icu-message-formatter
```

Usage
-----

Usage is identical to that of [@ultraq/icu-message-formatter](https://github.com/ultraq/icu-message-formatter),
except that you'll need to `import {RichMessageFormatter} from '@askvortsov/rich-icu-message-formatter';`
instead of `import {MessageFormatter} from '@ultraq/icu-message-formatter';`.

You will also need to provide a "rich handler" as the 3rd constructor argument.
This should be a function that takes:

- the name of a rich tag
- the object of placeholder data
- Any "children" of this tag: this is an array that can contain strings and vdom elements

Rich handlers should return a vdom element or string.
See `defaultRichHandler` and `mithrilRichHandler` for examples.

To use the `mithrilRichHandler`, you must have mithril available via the `m` global.

For example, assuming mithril has been properly configured:

```js
import {RichMessageFormatter} from 'askvortsov/rich-icu-message-formatter';
import {pluralTypeHandler, selectTypeHandler} from '@ultraq/icu-message-formatter';

let formatter = new MessageFormatter('en', {
  
});

let message = formatter.rich('To register, visit <a>our website</a>!', {
  a: m(m.route.Link, {href: '/register'})
});
```

Message will be a mithril link to `/register`.

Limitations
-----------

Rich text formatting currently has the following limitations:

- Spaces are not allowed in opening/closing tags: syntax MUST be <TAG_NAME>SOME_CONTENTS</TAG_NAME>
- Tags with attributes are not supported
- Self closing tags are not supported.
