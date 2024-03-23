<script setup lang="ts">
	import type {Task, ID} from '~/types';

	const props = defineProps<{ task: Task; }>();

	const emit = defineEmits<{
		(e: "deleteTask", payload: ID): void;
	}>();

const focused = ref(false);

onKeyStroke("Backspace", (e)=> {
	if (focused.value){
		 emit("deleteTask", props.task.id)
	}
})
		
</script>
<template>
	<div :title="task.createdAt.toLocaleDateString()" class="task bg-white p-2 mb-2 rounded shadow-sm w-full max-w-[400px]"
		@focus="focused = true" @blur="focused = false" tabindex="0">
		<div class="flex">
			<DragHandle />
			<span> {{ task.title }}</span>
		</div>
		<p class="text-sm text-right text-slate-500"> {{ task.createdAt.toLocaleDateString() }}</p>
	</div>
</template>


<style scoped>
.sortable-chosen {}

.sortable-drag .task{
	transform: rotate(5deg);
}
.sortable-ghost .task{
	position: relative;
}
.sortable-ghost .task::after{
	content: '';
	@apply absolute inset-0 bg-slate-300 opacity-80 rounded;
}
.task:focus,
.task:focus-visible {
	@apply outline outline-2 outline-offset-0 outline-gray-400 !important;
	/* outline: gray solid 2px; */
}

</style> 