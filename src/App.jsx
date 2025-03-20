import { useState, useEffect } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<>
			<div className={styles.app}>
				<h1>Список дел</h1>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					<div className={styles.todoList}>
						{todos.map(({ id, title, completed }) => (
							<div key={id} className={styles.todo}>
								<span>{title}</span>
								<span>{completed ? '✅' : '❌'}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
};
