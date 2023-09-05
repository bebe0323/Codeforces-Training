
export default async function TodoList() {
  let problemList = [];
  const response = await fetch('http://localhost:4000/todoList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.status === 200) {
    response.json()
      .then(data => {
        problemList = data;
      })
  } else {
    response.json()
      .then(data => alert(data))
  }
  return (
    <div>
      todo List
    </div>
  )
}