<script setup lang="ts">
	import { nanoid } from "nanoid";
	import type { Task } from "~/types";

	const emit = defineEmits<{
		(e: "addTask", payload: Task): void;
	}>();

	const focused = ref(false);
	const title = ref("");

	function createTask(e: Event) {
		if (title.value.trim()) {
			e.preventDefault();
			emit("addTask", {
				title: title.value.trim(),
				createdAt: new Date(),
				id: nanoid(),
			} as Task);
		}
		title.value = "";
	}
</script>
<template>
	<div>
		<textarea
			v-model="title"
			@keydown.tab="createTask"
			@keydown.enter="createTask"
			class="focus:bg-white focus:shadow resize-none rounded w-full border-none p-2"
			:class="{
				'h-10': !focused,
				'h-20': focused,
			}"
			style="outline: none !important"
			@focus="focused = true"
			@blur="focused = false"
			:placeholder="
				!focused ? 'Add A Task' : 'Enter a title for this task'
			"
		></textarea>
	</div>
</template>

<style scoped></style>
