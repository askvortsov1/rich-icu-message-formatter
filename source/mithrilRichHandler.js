export default function mithrilRichHandler(tag, values, contents) {
	const vnode = values[tag] || m(tag);
	const children = m.fragment(contents).children;
	return { ...vnode, children };
}
