/* eslint-env jest */
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
