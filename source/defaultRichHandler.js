import { unEscapeHtml } from './utilities';

export default function defaultRichHandler(tag, values, contents) {
	return `<${tag}>${unEscapeHtml(contents)}</${tag}>`;
}
