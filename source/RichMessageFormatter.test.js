/* eslint-env jest */
import MessageFormatter from './RichMessageFormatter';

/**
 * Tests for the Rich ICU message formatter.
 */
describe('RichMessageFormatter', function() {
	describe('#rich', function() {
		test('Rich formatting works on simple string', function() {
			let formatter = new MessageFormatter('en-NZ', {});

			let result = formatter.rich('simple text');

			expect(result).toStrictEqual(['simple text']);
		});

		test('Rich formatting applies default formatter to string with tags', function() {
			let formatter = new MessageFormatter('en-NZ', {});

			let result = formatter.rich('have a <a>link!</a>');

			expect(result).toStrictEqual(['have a ', '<a>link!</a>']);
		});

		test('Rich formatting applies custom formatter to string with tags', function() {
			const customFormatter = (tag, values, contents) => {
				return { tag, contents };
			};

			let formatter = new MessageFormatter('en-NZ', {}, customFormatter);

			let result = formatter.rich('have a <a>link!</a>');

			expect(result).toStrictEqual(['have a ', {contents: ['link!'], tag: 'a'}]);
		});
	});
});
