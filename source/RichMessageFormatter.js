import { MessageFormatter } from '@ultraq/icu-message-formatter';
import { flatten } from '@ultraq/array-utils';

import defaultRichHandler from './defaultRichHandler';
import { replaceRichTags } from './utilities';

export default class RichMessageFormatter extends MessageFormatter {
    constructor(locale, typeHandlers = {}, richHandler = null) {
        super(locale, typeHandlers);
        this.richHandler = richHandler ? richHandler : defaultRichHandler;
    }

    rich(message, values = {}) {
        const formatted = flatten(this.process(message, values));

        return replaceRichTags(formatted, values, this.richHandler);
    }
}