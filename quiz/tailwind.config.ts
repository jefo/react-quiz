import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			colors: {
				primary: '#2563EB',    // основной синий
				accent: '#4F46E5',     // акцентный индиго
				text: {
					DEFAULT: '#1F2937', // основной текст
				}
			},
			fontFamily: {
				sans: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
				display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
				'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
				'base': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
			},
			borderRadius: {
				'button': '8px',
				'card': '12px',
			},
			padding: {
				'button': '12px 24px',
			},
			maxWidth: {
				'content': '1120px',
			},
			spacing: {
				'container-mobile': '24px',
				'container-tablet': '32px',
				'container-desktop': '48px',
			},
			transitionDuration: {
				'default': '300ms',
			},
			transitionTimingFunction: {
				'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			backdropBlur: {
				'card': '8px',
			},
			screens: {
				'mobile': '640px',
				'tablet': '1024px',
				'desktop': '1025px',
			},
		}
	},

	plugins: [
		skeleton({
			themes: { preset: ["skeleton"] }
		}),
		typography,
		forms,
		containerQueries,
		aspectRatio
	]
} satisfies Config;
