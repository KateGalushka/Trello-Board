<script setup lang="ts">
import { nanoid } from 'nanoid';
import draggable from 'vuedraggable';
import type { Card, Task, ID } from '~/types';


	const cards = useLocalStorage<Card[]>("Trello board", [
		{
			id: nanoid(),
			title: "Backlog",
			tasks: [
				{
					id: nanoid(),
					title: "Create landing page",
					createdAt: new Date()
				},
				{
					id: nanoid(),
					title: "Develop cool new feature",
					createdAt: new Date()
				},
				{
					id: nanoid(),
					title: "Fix page nav bug",
					createdAt: new Date()
				}
			]
		},
		{
			id: nanoid(),
			title: "Selected for Dev",
			tasks: []
		},
		{
			id: nanoid(),
			title: "In Progress",
			tasks: []
		},
		{
			id: nanoid(),
			title: "QA",
			tasks: []
		},
		{
			id: nanoid(),
			title: "Complete",
			tasks: []
		},
	],
	{
		serializer: {
			read: (value) => {
				return JSON.parse(value).map((card: Card) => {
					card.tasks = card.tasks.map((task: Task) => {
						task.createdAt = new Date(task.createdAt);
						return task;
					});
					return card;
				});
			},
			write: (value) => JSON.stringify(value)
		}
	}
	);

	// watch(
	// 	cards,
	// 	()=>{
	// 		//ajax request
	// 	},
	// 	{deep: true}
	// )

	const alt = useKeyModifier("Alt");

	function createCard(){
		const card: Card = {
			id: nanoid(),
			title: "",
			tasks: []
		};
		cards.value.push(card);
		nextTick(() => {
			(document.querySelector('.card:last-of-type .title-input') as HTMLInputElement).focus();
		});
	}
	function deleteCard(id: ID) {
		cards.value = cards.value.filter(card => card.id !== id);
	}

</script>
<template>
	<div class="flex flex-col items-start gap-4">
		<button class="bg-gray-200 whitespace-nowrap p-2 rounded opacity-50" @click="createCard">
			+ Add A Card
		</button>
		<draggable v-model="cards" group="cards" :animation="200" handle=".drag-handle" item-key="id"
			class="flex gap-4 flex-wrap md:justify-center md:align-center lg:justify-start ">
			<template #item="{element: card}: {element: Card}">
				<div class="card bg-gray-200 p-5 rounded min-w-[250px]">
					<header class="font-bold mb-4 flex items-center">
						<DragHandle />
						<input v-model="card.title"
							class="title-input bg-transparent focus:bg-white focus:outline focus:outline-offset-0 focus:outline-gray-400 rounded p-1 w-4/5 placeholder:font-normal"
							placeholder="Title" @keyup.enter="($event.target as HTMLInputElement).blur()"
							@keydown.backspace="card.title === '' ? deleteCard(card.id) : null" type="text">
						<img src="/delete.png" alt="delete" class="size-9 p-2" @click="deleteCard(card.id)">
					</header>

					<draggable v-model="card.tasks" :group="{ name: 'tasks', pull: alt ? 'clone' : true }" :animation="200"
						item-key="id">
						<template #item="{ element: task }:{ element: Task}">
							<div>
								<TrelloBoardTask :task="task"
									@delete-task="card.tasks = card.tasks.filter(t => t.id !== $event)" />
							</div>
						</template>
					</draggable>

					<footer>
						<!-- <button class="text-gray-500">+ Add a Card</button> -->
						<CreatingNewTask @add-task="card.tasks.push($event)" />
					</footer>
				</div>

			</template>
		</draggable>



	</div>
</template>


<style scoped>

</style>