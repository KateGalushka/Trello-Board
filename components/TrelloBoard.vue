<script setup lang="ts">
	import { nanoid } from "nanoid";
	import draggable from "vuedraggable";
	import type { Card, Task, ID } from "~/types";

	const cardsData: Card[] = [
		{
			id: nanoid(),
			title: "My studies",
			tasks: [
				{
					id: nanoid(),
					title: "Create landing page",
					createdAt: new Date(),
				},
				{
					id: nanoid(),
					title: "Read Nuxt docs",
					createdAt: new Date(),
				},
				{
					id: nanoid(),
					title: "Make JS exercises",
					createdAt: new Date(),
				},
			],
		},
		{
			id: nanoid(),
			title: "Job search",
			tasks: [],
		},
		{
			id: nanoid(),
			title: "Shopping",
			tasks: [],
		},
		{
			id: nanoid(),
			title: "The chores",
			tasks: [],
		},
		{
			id: nanoid(),
			title: "Complete",
			tasks: [],
		},
	];

	const storedCards = useLocalStorage<Card[]>("Trello board", cardsData, {
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
			write: (value) => JSON.stringify(value),
		},
	});

	const noStoredCards = computed(() => !storedCards.value.length);

	const isHidden = ref<boolean>(true);
	const isButtonString = computed(() => {
		if(!isHidden.value) {
			return false;
		}
		return true;
	});

	const taskSearchString = ref<string>("");

	const filteredCards = computed(() => {
		const search = taskSearchString.value.toLocaleLowerCase();
		if (!search) {
			return storedCards.value;
		}
		return storedCards.value.filter((card: Card) =>
			card.tasks.find((task: Task) =>
				task.title.toLowerCase().includes(search)
			)
		);
	});

	const noCardFound = computed(() => !filteredCards.value.length);

	// watch(
	// 	cards,
	// 	()=>{
	// 		//ajax request
	// 	},
	// 	{deep: true}
	// )

	const alt = useKeyModifier("Alt");

	function createCard() {
		const card: Card = {
			id: nanoid(),
			title: "",
			tasks: [],
		};
		storedCards.value.push(card);
		nextTick(() => {
			(
				document.querySelector(
					".card:last-of-type .title-input"
				) as HTMLInputElement
			).focus();
		});
	}
	function deleteCard(id: ID) {
		storedCards.value = storedCards.value.filter((card) => card.id !== id);
	}
</script>
<template>
	<div class="flex flex-col items-start gap-4">
		<div class="flex flex-wrap gap-4 items-center">
			<button
				class="bg-gray-200 whitespace-nowrap p-2 rounded opacity-50 font-semibold hover:opacity-80 mx-auto transition-all"
				@click="createCard"
			>
				+ Add A Card
			</button>
			<div class="flex flex-wrap gap-2 items-center mx-auto">
				<input
					type="text"
					name="search"
					id="search"
					placeholder="Search a task"
					class="p-2 border-0 focus:outline-0 mr-2 rounded relative"
					:class="{ hidden: isHidden }"
					v-model="taskSearchString"
				/>
				<button
					class="bg-gray-200 mr-2 border-0 outline-0 rounded text-center p-2 hover:bg-gray-300 transition-all"
					@click="isHidden = false"
				>
					<img
						src="/public/loupe.png"
						alt="search-icon"
						class="inline-block h-[20px]"
					/>
					<span v-if="isButtonString" class="ml-2">Search a task</span>
				</button>
				<button
					class="bg-gray-200 border-0 outline-0 rounded text-center p-2"
					:class="{ hidden: isHidden || !taskSearchString }"
					@click="taskSearchString = ''"
				>
					<img
						src="/public/clear.png"
						alt="clear filter"
						class="inline-block mr-2 h-[20px]"
					/>
					<span>Clear search</span>
				</button>
			</div>
		</div>
		<div
			v-if="noStoredCards"
			class="text-xl text-gray-200 mt-4"
		>
			The Board is empty!
		</div>
		<div
			v-if="noCardFound"
			class="text-xl text-gray-200 mt-4"
		>
			No card found! Try input another search.
		</div>
		<draggable
			v-model="filteredCards"
			group="filteredCards"
			:animation="200"
			handle=".drag-handle"
			item-key="id"
			class="flex gap-4 flex-wrap justify-center md:align-center xl:justify-start"
		>
			<template #item="{ element: card }: { element: Card }">
				<div class="card bg-gray-200 p-5 rounded min-w-[250px]">
					<header class="font-bold mb-4 flex items-center">
						<DragHandle />
						<input
							v-model="card.title"
							class="title-input bg-transparent focus:bg-white focus:outline focus:outline-offset-0 focus:outline-gray-400 rounded p-1 w-4/5 placeholder:font-normal text-lg"
							placeholder="Title"
							@keyup.enter="
								($event.target as HTMLInputElement).blur()
							"
							@keydown.backspace="
								card.title === '' ? deleteCard(card.id) : null
							"
							type="text"
						/>
						<img
							src="/delete.png"
							alt="delete"
							class="size-9 p-2 cursor-pointer rounded hover:ring-1 hover:ring-rose-600"
							@click="deleteCard(card.id)"
						/>
					</header>

					<draggable
						v-model="card.tasks"
						:group="{ name: 'tasks', pull: alt ? 'clone' : true }"
						:animation="200"
						item-key="id"
					>
						<template #item="{ element: task }: { element: Task }">
							<div>
								<TrelloBoardTask
									:task="task"
									@delete-task="
										card.tasks = card.tasks.filter(
											(t) => t.id !== $event
										)
									"
								/>
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
		<ul class="font-semibold italic">
			<li>* To delete a task - use BackSpace</li>
			<li>* To copy a task to another card - use Alt and drag</li>
		</ul>
	</div>
</template>

<style scoped>
	.hidden {
		display: none;
	}
</style>
