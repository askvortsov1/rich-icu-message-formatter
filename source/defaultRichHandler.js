export default function defaultRichHandler(tag, values, contents) {
	return `<${tag}>${contents}</${tag}>`;
}
