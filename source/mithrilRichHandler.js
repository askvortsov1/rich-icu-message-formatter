import { unEscapeHtml } from './utilities';

export default function mithrilRichHandler(tag, values, contents) {
	const vnode = values[tag] || m(tag);
	let children = unEscapeHtml(m.fragment(contents).children);
	return { ...vnode, children };
}
