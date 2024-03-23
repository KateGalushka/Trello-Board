// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
   ssr: false,
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/png', href: '/trello.png' }, 
			]
		}

	}

})
