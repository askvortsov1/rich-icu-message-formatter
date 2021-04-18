/* eslint-env jest */
import { replaceRichTags } from './utilities';

describe('replaceRichTags', function() {
	const replaceWithObject = (tag, values, contents) => {
		return { tag, contents };
	};

	describe('No tags', function() {
		test('Doesnt change single empty string', function() {
			let result = replaceRichTags(['no tags here!'], {}, replaceWithObject);

			expect(result).toStrictEqual(['no tags here!']);
		});

		test('Doesnt change multiple empty strings', function() {
			let result = replaceRichTags(['no', 'tags', 'here!'], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 'here!']);
		});
	});

	describe('Invalid tags', function() {
		test('No spaces in tags', function() {
			let result;

			result = replaceRichTags(['<a >Hello!</a>'], {}, replaceWithObject);
			expect(result).toStrictEqual(['<a >Hello!</a>']);

			result = replaceRichTags(['< a>Hello!</a>'], {}, replaceWithObject);
			expect(result).toStrictEqual(['< a>Hello!</a>']);
		});

		test('No attributes', function() {
			let result = replaceRichTags(["<a src='hello world'>Hello!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual(["<a src='hello world'>Hello!</a>"]);
		});

		test('No self-closing tags', function() {
			let result = replaceRichTags(['Hello World <br />'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Hello World <br />']);
		});

		test('Errors when tag unclosed', function() {
			expect(() => {
				replaceRichTags(['<a>Hello!'], {}, replaceWithObject);
			}).toThrowError();
		});

		test('Doesnt change multiple empty strings', function() {
			let result = replaceRichTags(['no', 'tags', 'here!'], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 'here!']);
		});

		test('Passes through non-string segments', function() {

			let result = replaceRichTags(['no', 'tags', 42, 'here!'], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 42, 'here!']);
		});
	});

	describe('Single tag', function() {
		test('Replaces simple tag', function() {
			let result = replaceRichTags(['<a>Hello!</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello!'], tag: 'a' }]);
		});

		test('Replaces simple tag with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello!</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello!'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});

		test('Replaces simple tag in consecutive segments', function() {
			let result = replaceRichTags(['<a>Hello', 'world</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }]);
		});

		test('Replaces simple tag in consecutive segments with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello', 'world</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});

		test('Replaces simple tag in disconnected segments', function() {
			let result = replaceRichTags(['<a>Hello', 'beautiful', 'world</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'beautiful', 'world'], tag: 'a' }]);
		});

		test('Replaces simple tag in disconnected segments with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello', 'beautiful', 'world</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});

		test('includes non-string contents', function() {
			let result = replaceRichTags(['<a>Hello, ', 42, ' world</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello, ', 42, ' world'], tag: 'a' }]);
		});
	});

	describe('disjoint tags', function() {
		test('Replaces disjoint tags', function() {
			let result = replaceRichTags(['<a>Hello!</a> <a>Hello 2!</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello!'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello!</a> <a>Hello 2!</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello!'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});

		test('Replaces disjoint tags, one split one not', function() {
			let result = replaceRichTags(['<a>Hello', 'world</a> <a>Hello 2!</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags, one split one not in consecutive segments with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello', 'world</a> <a>Hello 2!</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});

		test('Replaces disjoint tags, both split', function() {
			let result = replaceRichTags(['<a>Hello', 'world</a> <a>Hello', ' 2!</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello', ' 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags, both split in consecutive segments with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello', 'world</a> <a>Hello', ' 2!</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello', ' 2!'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});


		test('Replaces disjoint tags in disconnected segments', function() {
			let result = replaceRichTags(['<a>Hello', 'beautiful', 'world</a><a>', 'Pizza', 'is', 'good', '</a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, { contents: ['Pizza', 'is', 'good'], tag: 'a' }]);
		});

		test('Replaces disjoint tags in disconnected segments with surrounding text', function() {
			let result = replaceRichTags(['Some Prefix <a>Hello', 'beautiful', 'world</a><a>', 'Pizza', 'is', 'good', '</a> Some Suffix', 'Next Segment'], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, { contents: ['Pizza', 'is', 'good'], tag: 'a' }, ' Some Suffix', 'Next Segment']);
		});
	});

	describe('nested tags', function() {
		test('nested different tags', function() {
			let result = replaceRichTags(['<a><b>Hello!</b></a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: [{ contents: ['Hello!'], tag: 'b' }], tag: 'a' }]);
		});

		test('nested different tags with surrounding text', function() {
			let result = replaceRichTags(['PreOuter<a>PreInner<b>Hello!</b>PostInner</a>PostOuter'], {}, replaceWithObject);

			expect(result).toStrictEqual(['PreOuter', { contents: ['PreInner', { contents: ['Hello!'], tag: 'b' }, 'PostInner'], tag: 'a' }, 'PostOuter']);
		});

		test('nested same tags', function() {
			let result = replaceRichTags(['<a><a>Hello!</a></a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: [{ contents: ['Hello!'], tag: 'a' }], tag: 'a' }]);
		});

		test('nested same tags with surrounding text', function() {
			let result = replaceRichTags(['PreOuter<a>PreInner<a>Hello!</a>PostInner</a>PostOuter'], {}, replaceWithObject);

			expect(result).toStrictEqual(['PreOuter', { contents: ['PreInner', { contents: ['Hello!'], tag: 'a' }, 'PostInner'], tag: 'a' }, 'PostOuter']);
		});

		test('nested invalid inner ignored', function() {
			let result = replaceRichTags(['<a>< b>Hello!</b></a>'], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['< b>Hello!</b>'], tag: 'a' }]);
		});
	});
});
