import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import styles from './app.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSorted, setIsSorted] = useState(false); // Состояние для отслеживания сортировки

	// Получение данных с сервера
	const refreshProducts = () => {
		setIsLoading(true);
		fetch('http://localhost:3000/todos')
			.then((res) => res.json())
			.then((data) => setTodos(data))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		refreshProducts();
	}, []);

	// Фильтрация дел по введённому тексту
	const filteredTodos = todos.filter((todo) =>
		todo.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Сортировка дел по алфавиту
	const sortedTodos = isSorted
		? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTodos;

	// Обработчик изменения searchTerm с debounce
	const handleSearchChange = debounce((value) => {
		setSearchTerm(value);
	}, 500); // Задержка в 500 мс

	// Отправка данных на сервер
	const requestAddTodo = () => {
		setIsCreating(true); // Для блокировки кнопки

		fetch('http://localhost:3000/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: 'Новое дело',
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача добавлена, ответ от сервера:', response);
				refreshProducts();
			})
			.finally(() => setIsCreating(false));
	};

	// Изменение данных на сервере
	const requestUpdateTodo = (id) => {
		setIsUpdating(true); // Для блокировки кнопки

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: 'Выполненное дело',
				completed: true,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача обновлена, ответ от сервера:', response);
				refreshProducts();
			})
			.finally(() => setIsUpdating(false));
	};

	// Удаление данных на сервере
	const requestDeleteTodo = (id) => {
		setIsDeleting(true); // Для блокировки кнопки

		fetch(`http://localhost:3000/todos/${id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				console.log('Задача удалена ответ от сервера:', response);
				refreshProducts();
			})
			.finally(() => setIsDeleting(false));
	};

	// Обработчик переключения сортировки
	const toggleSort = () => {
		setIsSorted(!isSorted);
	};

	return (
		<>
			<div className={styles.app}>
				<h1>Список дел</h1>

				<input
					type="text"
					placeholder="Поиск..."
					onChange={(e) => handleSearchChange(e.target.value)} // Вызываем debounce
				/>

				<button onClick={toggleSort}>
					{isSorted ? 'Сортировка по умолчанию' : 'Сортировка по алфавиту'}
				</button>

				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					<div className={styles.todoList}>
						{sortedTodos.map(({ id, title, completed }) => (
							<div key={id} className={styles.todo}>
								<span>{title}</span>
								<span>{completed ? '✅' : '❌'}</span>
								<button
									disabled={isUpdating}
									onClick={() => requestUpdateTodo(id)}
								>
									Обновить
								</button>
								<button
									disabled={isDeleting}
									onClick={() => requestDeleteTodo(id)}
								>
									Удалить
								</button>
							</div>
						))}
					</div>
				)}
				<button disabled={isCreating} onClick={requestAddTodo}>
					Добавить новое дело
				</button>
			</div>
		</>
	);
};
