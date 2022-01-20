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

		// TODO
		// Should be a symbol but isn't because of conversion issues.
		// We use a random string instead. 
		let sym = Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36);
		const fakeValues = Object.fromEntries(Object.entries(values).map(([key, _value]) => [key, sym]));
		const formattedFake = flatten(this.process(message, fakeValues));
		const replaceFake = replaceRichTags(formattedFake, fakeValues, () => sym);
		const originalTemplateSegmentIndices = replaceFake.map((v, i) => v === sym ? null: i).filter(i => i !== null);

		return replaceRichTags(formatted, cleanedValues, this.richHandler, originalTemplateSegmentIndices);
	}
}
