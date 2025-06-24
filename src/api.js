const API_BASE = 'http://localhost:4000/v1/tasks';

export async function getTasks() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(title) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(taskId, updates) {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
} 