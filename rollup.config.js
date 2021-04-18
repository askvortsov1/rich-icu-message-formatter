
import babel       from '@rollup/plugin-babel';
import commonjs    from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
	input: 'source/RichIcuMessageFormatter.js',
	output: [
		{
			file: `lib/rich-icu-message-formatter.cjs.js`,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: `lib/rich-icu-message-formatter.es.js`,
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		babel({
			babelHelpers: 'runtime'
		}),
		commonjs(),
		nodeResolve()
	],
	external: [
		/@babel\/runtime/,
		'@ultraq/icu-message-formatter',
		"@ultraq/array-utils",
	]
};
