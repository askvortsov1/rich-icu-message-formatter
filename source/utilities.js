/**
 * Replaces rich tags with elements, as per a provided handler.
 * No spaces allowed in tag name, syntax MUST be <TAG_NAME>SOME_CONTENTS</TAG_NAME>.
 * Currently does not support tags with attributes.
 * Currently does not support self closing tags.
 *
 * @param {String[]|any[]} message
 * @param {Object} values
 * @param {Function} handler
 * @return {String[]|any[]}
 */
export function replaceRichTags(message, values, handler) {
	const result = [];

	const onTagClose = (
		segment,
		currTagIsClosing,
		currTag,
		i,
		j,
		currTagStart
	) => {
		if (currTagIsClosing) {
			return {
				break: true
			};
		}

		const endingLocation = findClosingTag(message, currTag, i, j);

		if (!endingLocation) {
			throw new Error(`Unbalanced tags: no closing tag found for <${currTag}>`);
		}

		const entireTagInSegment = endingLocation.segmentIndex === i;
		const segmentContainingClosingTag = message[endingLocation.segmentIndex];

		const tagContents = [];

		if (entireTagInSegment) {
			tagContents.push(segment.slice(j + 1, endingLocation.segmentStart));
		}
		else {
			tagContents.push(segment.slice(j + 1));

			for (let k = i + 1; k < endingLocation.segmentIndex; k++) {
				tagContents.push(message[k]);
			}
			tagContents.push(
				segmentContainingClosingTag.slice(0, endingLocation.segmentStart)
			);
		}

		result.push(segment.slice(0, currTagStart));

		result.push(
			handler(
				currTag,
				values,
				replaceRichTags(
					tagContents.filter((s) => s !== ''),
					values,
					handler
				)
			)
		);

		message.splice(
			endingLocation.segmentIndex + 1,
			0,
			segmentContainingClosingTag.slice(endingLocation.segmentEnd + 1)
		);

		return {
			processedSegment: true,
			newSegmentIndex: endingLocation.segmentIndex,
			break: true
		};
	};

	traverseMessageTags(message, 0, 0, result, onTagClose);

	return result.filter((s) => s !== '').map((s) => unEscapeHtml(s));
}

/**
 * Finds the index of the matching closing tag, including through strings that
 * could have nested tags.
 *
 * @param {String[]|any[]} message
 * @param {String} tag
 * @param {Number} startIndex
 * @param {Number} startSegmentIndex
 * @return {Boolean}
 */
function findClosingTag(message, tag, startIndex, startSegmentIndex) {
	let position; // set in callback
	let depth = 1;

	const onTagClose = (
		segment,
		currTagIsClosing,
		currTag,
		i,
		j,
		currTagStart
	) => {
		if (currTag === tag) {
			if (currTagIsClosing) {
				depth--;
			}
			else {
				depth++;
			}

			if (depth === 0) {
				position = {
					segmentIndex: i,
					segmentStart: currTagStart,
					segmentEnd: j
				};

				return { exit: true };
			}
		}

		return { exit: false };
	};

	traverseMessageTags(message, startIndex, startSegmentIndex, [], onTagClose);

	return position;
}

function traverseMessageTags(message, startI, startJ, result, onTagClose) {
	const isHtmlTagChar = (ch) => /[a-zA-Z-_]/.test(ch);
	for (let i = startI; i < message.length; i++) {
		const segment = message[i];

		if (typeof segment !== 'string') {
			result.push(segment);
			continue;
		}

		let currTagIsClosing = false;
		let currTagStart = null;
		let inTag = false;

		let processedSegment = false;
		for (let j = i === startI ? startJ : 0; j < segment.length; j++) {
			// Start of tag
			if (!inTag && segment[j] === '<') {
				currTagStart = j;
				inTag = true;

				if (segment[j + 1] === '/') {
					currTagIsClosing = true;
					j++;
				}
			}

			// Tag ended
			else if (inTag && segment[j] === '>') {
				const currTag = segment.slice(currTagStart + 1 + currTagIsClosing, j);

				const instructions = onTagClose(
					segment,
					currTagIsClosing,
					currTag,
					i,
					j,
					currTagStart
				);

				if (instructions.exit) {
					return;
				}
				if (instructions.newSegmentIndex) {
					i = instructions.newSegmentIndex;
				}
				if (instructions.processedSegment) {
					processedSegment = true;
				}
				if (instructions.break) {
					break;
				}

				currTagIsClosing = false;
				currTagStart = null;
				inTag = false;
			}

			// Not a valid tag, reset state.
			else if (inTag && !isHtmlTagChar(segment[j])) {
				currTagIsClosing = false;
				currTagStart = null;
				inTag = false;
			}
		}

		if (!processedSegment) {
			result.push(segment);
		}
	}
}

/**
 * Escapes HTML markup in string and nested array arguments.
 *
 * @param {Object} values
 * @return {Object}
 */
export function sanitizeValues(values) {
	return Object.keys(values).reduce((acc, key) => {
		acc[key] = recSanitizeArr(values[key]);

		return acc;
	}, {});
}

/**
 * De-sanitizes HTML markup.
 *
 * @param {any} str
 * @return {string}
 */
export function unEscapeHtml(str) {
	if (typeof str !== 'string') {
		return str;
	}

	return str
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

/**
 * Recursively escape HTML in string or string array.
 *
 * @param {string[]|string} input
 * @return {string[]|string}
 */
function recSanitizeArr(input) {
	if (typeof input === 'string' || input instanceof String) {
		return input
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
	else if (Array.isArray(input)) {
		return input.map(recSanitizeArr);
	}

	return input;
}
