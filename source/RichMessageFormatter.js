import { MessageFormatter } from '@ultraq/icu-message-formatter';
import { flatten } from '@ultraq/array-utils';

import defaultRichHandler from './defaultRichHandler';
import { replaceRichTags, sanitizeValues } from './utilities';

export default class RichMessageFormatter extends MessageFormatter {
	constructor(locale, typeHandlers = {}, richHandler = null) {
		super(locale, typeHandlers);
		this.richHandler = richHandler ? richHandler : defaultRichHandler;
	}

	rich(message, values = {}) {
		const cleanedValues = sanitizeValues(values);

		const formatted = flatten(this.process(message, cleanedValues));

		return replaceRichTags(formatted, cleanedValues, this.richHandler);
	}
}
