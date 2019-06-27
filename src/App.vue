<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Tracking</span>
				<span class="font-weight-light">3</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>

		<v-content>
			<Index/>
		</v-content>
	</v-app>
</template>

<script>
    import Index from './components/index'

    export default {
        name: 'App',
        components: {
            Index
        },
    }
</script>
