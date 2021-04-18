/* eslint-env jest */
import defaultRichHandler from './defaultRichHandler';

/**
 * Tests for the default rich handler
 */
describe('defaultRichHandler', function() {

	test('Returns simple string', function() {
		let result = defaultRichHandler('a', 'literally anything', 'Contents');
		expect(result).toBe('<a>Contents</a>');
	});

	test('Works with empty contents', function() {
		let result = defaultRichHandler('a', 'literally anything', '');
		expect(result).toBe('<a></a>');
	});

	test('Works with empty tag and contents', function() {
		let result = defaultRichHandler('', 'literally anything', '');
		expect(result).toBe('<></>');
	});
});
