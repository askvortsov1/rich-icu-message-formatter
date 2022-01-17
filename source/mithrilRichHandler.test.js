/* eslint-env jest */
import MessageFormatter from './RichMessageFormatter';
import mithrilRichHandler from './mithrilRichHandler';

/**
 * Tests for the mithril rich handler
 */
describe('mithrilRichHandler', function() {
	const vnode1 = m('a');

	test('Returns simple string', function() {
		const vnode2 = m('a');
		vnode2.children = m.fragment('Contents').children;
		let result = mithrilRichHandler('a', { a: vnode1}, 'Contents');
		expect(result).toStrictEqual(vnode2);
	});

	test('Works with empty contents', function() {
		const vnode2 = m('a');
		vnode2.children = m.fragment('').children;
		let result = mithrilRichHandler('a', { a: vnode1 }, '');
		expect(result).toStrictEqual(vnode2);
	});

	test('Works with undefined tag', function() {
		const vnode2 = m('p');
		vnode2.children = m.fragment('').children;
		let result = mithrilRichHandler('p', { a: vnode1 }, '');
		expect(result).toStrictEqual(vnode2);
	});
});

describe('Integration tests with full rich formatter', function() {
	test('Does transform HTML from template', function() {
		let formatter = new MessageFormatter('en-NZ', {}, mithrilRichHandler);

		let result = formatter.rich('have a <a>{contents}</a>', { contents: 'link!' });

		const vnode = m('a');
		vnode.children = m.fragment('link!').children;
		expect(result).toStrictEqual(['have a ', vnode]);
	});

	test('Doesnt transform HTML from argument', function() {
		let formatter = new MessageFormatter('en-NZ', {}, mithrilRichHandler);

		let result = formatter.rich('have a {contents}', { contents: '<a>link!</a>' });

		expect(result).toStrictEqual(['have a ', '<a>link!</a>']);
	});

	test('Correctly outputs complicated, dangerous nested sequence.', function() {
		let formatter = new MessageFormatter('en-NZ', {}, mithrilRichHandler);

		let result = formatter.rich('Start: <a><i><b>{contents}</b></i></a> <strong><hr></hr></strong>', { contents: 'Hi <script>prompt("gotcha");</script>' });

		const vnode1 = m('a', {}, m('i', {}, m('b')));
		vnode1.children[0].children[0].children = m.fragment('Hi <script>prompt("gotcha");</script>').children;
		expect(result).toStrictEqual(['Start: ', vnode1, ' ', m('strong', {}, m('hr'))]);
	});
});
