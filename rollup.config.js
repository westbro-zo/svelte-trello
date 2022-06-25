// built-in: node js 에서 별도 외부 설치 없이 사용할 수 있는 모듈.
import path from 'path';

// @rollup: 비교적 최신에 만들어진 모듈 (구분을 위해 @붙어있음)
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';

// rollup: 비교적 시간이 지난 모듈
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
// import preprocess from 'svelte/types/compiler/preprocess';

// rollup 이 동작할 때 현재 환경이 개발모드인지 제품모드인지 판단하는 변수
// Rollup Watch가 켜져 있으면 '개발모드'로 판단.
const production = !process.env.ROLLUP_WATCH;

// rollup 이 로컬서버를 정의할 때 실행하는 함수
function serve() {
	let server;

	function toExit() {
		// 서버 있으면 바로 종료
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			// 서버가 있으면 실행하지 않음
			if (server) return;

			// 서버 생성
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			// 프로세스 종료 이벤트(SIGTERM, exit)에 서버 종료하도록 핸들링.
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

// 본격적인 rollup의 구성 옵션
export default {
	// 진입점 (어떤 파일부터 읽어나갈지에 대해 명시)
	input: 'src/main.js',
	// 번들 출력
	output: {
		// 소스맵 파일을 생성할 것인지. (소스맵은 난독화 파일을 해석해서 성능 향성에 도움을 줍니다.)
		sourcemap: true,
		// 번들의 포멧을 지정. `iife`는 HTML SCRIPT 태그에서 사용하기에 적합한 번들을 생성합니다.
		format: 'iife',
		// 번들의 전역변수 이름. `iife` 포맷을 사용하는 경우에 필요.
		name: 'app',
		// 번들이 생성되는 경로. 어디에 어떤 이름으로 저장될지.
		file: 'public/build/bundle.js'
	},
	// rollup 이 번들 결과를 내기 전에 plugins 의 여러가지 내용을 바탕으로 프로젝트를 해석해서 결과를 낸다.
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				// 개발모드에서 런타임 검사를 활성화한다.
				dev: !production
			},
			// 전처리 옵션을 지정.
			// preprocess: sveltePreprocss({
			// 	scss: {
			// 		// 전역에서 사용할 scss 파일을 지정.
			// 		prependData: '@import "./src/scss/main.scss";',
			// 	},
			// }),
			// component가 해석되고 css 결과가 나온 후, 후처리에 대한 옵션
			// autoprefixer는 css에 자동으로 벤더 프리픽스를 적용한다. -ms- -webkit-
			postcss: {
				plugins: [
					require('autoprefixer')() // 가지고 오자마자 실행
				]
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		// Svelte 컴포넌트의 CSS를 별도 번들로 생성합니다.
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		// npm 으로 설치하는 외부 모듈을 번들에 포함한다.
		resolve({
			// 브라우저 환경을 위한 번들로 포함하도록 지시.
			browser: true,
			// 중복 번들을 방지하기 위한 외부 모듈 이름을 지정.
			// ex) 외부 모듈에서도 svelte를 사용하는 경우. 우리의 번들에서 중복 발생. 중복을 제거하여 번들의 용량 줄여줌.
			dedupe: ['svelte']
		}),
		// 외부 모듈을 ES6 번들로 변환.
		commonjs(),

		// 경로 별칭을 지정.
		// 상대 경로에 대한 별칭이 없으면, 프로젝트를 리팩토링할 때 문제가 생길 확률이 매우 높아진더.
		alias({
			entries: [
				{ find: '~', replacement: path.resolve(__dirname, 'src/') }
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// 개발모드일 때 serve 함수 실행
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// 개발 모드에서는 'public' 디렉토리에서 변경사항이 확인되면 브라우저를 새로고침.
		!production && livereload('public'),

		// 제품 모드에서는 'console.log' 같은 Console 명령을 제거.
		production && strip({
			include: '**/*.(svelte|js)',
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		// 제품 모드에서는 번들을 최소화(최적화)한다.
		production && terser()
	],
	watch: {
		// 다시 빌드할 때, 터미널 화면을 초기화하지 않는다. 기본값은 'true'
		clearScreen: false
	}
};
