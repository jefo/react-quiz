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
				primary: {
					DEFAULT: '#2563EB',
					50: '#EFF6FF',
					100: '#DBEAFE',
					200: '#BFDBFE',
					300: '#93C5FD',
					400: '#60A5FA',
					500: '#3B82F6',
					600: '#2563EB',
					700: '#1D4ED8',
					800: '#1E40AF',
					900: '#1E3A8A',
					950: '#172554'
				},
				accent: '#4F46E5',     // акцентный индиго
				text: {
					DEFAULT: '#1F2937', // основной текст
				}
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			fontFamily: {
				sans: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
				display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
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
