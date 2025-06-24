<template>
         <div class="app-container">
           <div class="todo-card">
             <!-- Header -->
             <div class="header">
               <h1 class="title">My Todo List</h1>
               <p class="subtitle">Stay organized and productive</p>
             </div>
       
             <!-- Add Task Form -->
             <div class="form-section">
               <form @submit.prevent="addTask" class="add-form">
                 <div class="input-group">
                   <label for="taskInput" class="input-label">
                     Add a new task
                   </label>
                   <input
                     id="taskInput"
                     v-model="newTaskText"
                     type="text"
                     placeholder="Enter your task..."
                     class="task-input"
                   />
                 </div>
                 <button
                   type="submit"
                   :disabled="!newTaskText.trim()"
                   class="add-button"
                   :class="{ 'disabled': !newTaskText.trim() }"
                 >
                   Add Task
                 </button>
               </form>
             </div>
       
             <!-- Tasks List -->
             <div class="tasks-section">
               <!-- Empty State -->
               <div v-if="tasks.length === 0" class="empty-state">
                 <div class="empty-icon">📝</div>
                 <p class="empty-title">No tasks yet</p>
                 <p class="empty-subtitle">Add your first task above to get started!</p>
               </div>
       
               <!-- Tasks List -->
               <div v-else class="tasks-container">
                 <div class="tasks-header">
                   <span class="task-count">{{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }}</span>
                   <button
                     @click="clearAllTasks"
                     class="clear-all-button"
                   >
                     Clear All
                   </button>
                 </div>
                 
                 <div
                   v-for="task in tasks"
                   :key="task.id"
                   class="task-item"
                 >
                   <!-- Normal View -->
                   <div v-if="!task.isEditing" class="task-content">
                     <div class="task-indicator"></div>
                     <div class="task-details">
                       <p class="task-text">{{ task.text }}</p>
                       <p class="task-meta">
                         Added {{ formatDate(task.createdAt) }}
                         <span v-if="task.updatedAt && task.updatedAt !== task.createdAt">
                           • Updated {{ formatDate(task.updatedAt) }}
                         </span>
                       </p>
                     </div>
                     <div class="task-actions">
                       <!-- Edit Button -->
                       <button
                         @click="startEditing(task)"
                         class="action-button edit-button"
                         title="Edit task"
                       >
                         ✏️
                       </button>
                       <!-- Delete Button -->
                       <button
                         @click="deleteTask(task.id)"
                         class="action-button delete-button"
                         title="Delete task"
                       >
                         🗑️
                       </button>
                     </div>
                   </div>
       
                   <!-- Edit View -->
                   <div v-else class="edit-container">
                     <div class="edit-content">
                       <div class="edit-indicator"></div>
                       <div class="edit-input-container">
                         <input
                           v-model="task.editText"
                           type="text"
                           class="edit-input"
                           @keyup.enter="saveEdit(task)"
                           @keyup.escape="cancelEdit(task)"
                           ref="editInput"
                         />
                         <p class="edit-hint">
                           Press Enter to save, Escape to cancel
                         </p>
                       </div>
                     </div>
                     <div class="edit-actions">
                       <button
                         @click="cancelEdit(task)"
                         class="cancel-button"
                       >
                         Cancel
                       </button>
                       <button
                         @click="saveEdit(task)"
                         :disabled="!task.editText.trim()"
                         class="save-button"
                         :class="{ 'disabled': !task.editText.trim() }"
                       >
                         Save
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
       
             <!-- Success Message -->
             <div
               v-if="successMessage"
               class="success-message"
               :class="{ 'fade-out': !successMessage }"
             >
               {{ successMessage }}
             </div>
           </div>
         </div>
       </template>
       
       <script>
       export default {
         name: 'TodoApp',
         data() {
           return {
             tasks: [
               {
                 id: 1,
                 text: 'Complete the project documentation',
                 createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                 updatedAt: null,
                 isEditing: false,
                 editText: ''
               },
               {
                 id: 2,
                 text: 'Review code changes',
                 createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                 updatedAt: null,
                 isEditing: false,
                 editText: ''
               },
               {
                 id: 3,
                 text: 'Prepare for team meeting',
                 createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                 updatedAt: null,
                 isEditing: false,
                 editText: ''
               }
             ],
             newTaskText: '',
             successMessage: '',
             nextId: 4
           }
         },
         methods: {
           addTask() {
             if (!this.newTaskText.trim()) return
             
             const newTask = {
               id: this.nextId++,
               text: this.newTaskText.trim(),
               createdAt: new Date().toISOString(),
               updatedAt: null,
               isEditing: false,
               editText: ''
             }
             
             this.tasks.unshift(newTask)
             this.newTaskText = ''
             this.showSuccessMessage('Task added successfully!')
           },
           
           startEditing(task) {
             this.tasks.forEach(t => {
               if (t.id !== task.id) {
                 this.cancelEdit(t)
               }
             })
             
             task.isEditing = true
             task.editText = task.text
             
             this.$nextTick(() => {
               const editInputs = this.$refs.editInput
               if (editInputs) {
                 const inputArray = Array.isArray(editInputs) ? editInputs : [editInputs]
                 const targetInput = inputArray.find(input => input.value === task.text)
                 if (targetInput) {
                   targetInput.focus()
                   targetInput.select()
                 }
               }
             })
           },
           
           saveEdit(task) {
             if (!task.editText.trim()) {
               this.showSuccessMessage('Task text cannot be empty!')
               return
             }
             
             if (task.editText.trim() === task.text) {
               this.cancelEdit(task)
               return
             }
             
             task.text = task.editText.trim()
             task.updatedAt = new Date().toISOString()
             task.isEditing = false
             task.editText = ''
             
             this.showSuccessMessage('Task updated successfully!')
           },
           
           cancelEdit(task) {
             task.isEditing = false
             task.editText = ''
           },
           
           deleteTask(taskId) {
             const task = this.tasks.find(t => t.id === taskId)
             if (!task) return
             
             if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
               this.tasks = this.tasks.filter(t => t.id !== taskId)
               this.showSuccessMessage('Task deleted successfully!')
             }
           },
           
           clearAllTasks() {
             if (confirm('Are you sure you want to clear all tasks?')) {
               this.tasks = []
               this.showSuccessMessage('All tasks cleared!')
             }
           },
           
           showSuccessMessage(message) {
             this.successMessage = message
             setTimeout(() => {
               this.successMessage = ''
             }, 3000)
           },
           
           formatDate(dateString) {
             const date = new Date(dateString)
             const now = new Date()
             const diffInMinutes = (now - date) / (1000 * 60)
             const diffInHours = diffInMinutes / 60
             const diffInDays = diffInHours / 24
             
             if (diffInMinutes < 1) {
               return 'just now'
             } else if (diffInMinutes < 60) {
               return `${Math.floor(diffInMinutes)} minutes ago`
             } else if (diffInHours < 24) {
               return `${Math.floor(diffInHours)} hours ago`
             } else if (diffInDays < 7) {
               return `${Math.floor(diffInDays)} days ago`
             } else {
               return date.toLocaleDateString()
             }
           }
         }
       }
       </script>
       
       <style scoped>
       /* Container Styles */
       .app-container {
         min-height: 100vh;
         background-color: #f9fafb;
         padding: 2rem 1rem;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
       }
       
       .todo-card {
         max-width: 28rem;
         margin: 0 auto;
         background: white;
         border-radius: 0.5rem;
         box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
         overflow: hidden;
       }
       
       /* Header Styles */
       .header {
         background-color: #3b82f6;
         color: white;
         padding: 1.5rem;
         text-align: center;
       }
       
       .title {
         font-size: 1.5rem;
         font-weight: bold;
         margin: 0 0 0.25rem 0;
       }
       
       .subtitle {
         color: #bfdbfe;
         margin: 0;
         font-size: 0.875rem;
       }
       
       /* Form Styles */
       .form-section {
         padding: 1.5rem;
         border-bottom: 1px solid #e5e7eb;
       }
       
       .add-form {
         display: flex;
         flex-direction: column;
         gap: 1rem;
       }
       
       .input-group {
         display: flex;
         flex-direction: column;
       }
       
       .input-label {
         font-size: 0.875rem;
         font-weight: 500;
         color: #374151;
         margin-bottom: 0.5rem;
       }
       
       .task-input {
         width: 100%;
         padding: 0.5rem 1rem;
         border: 1px solid #d1d5db;
         border-radius: 0.375rem;
         font-size: 1rem;
         transition: border-color 0.2s, box-shadow 0.2s;
         box-sizing: border-box;
       }
       
       .task-input:focus {
         outline: none;
         border-color: #3b82f6;
         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
       }
       
       .add-button {
         width: 100%;
         background-color: #3b82f6;
         color: white;
         padding: 0.5rem 1rem;
         border: none;
         border-radius: 0.375rem;
         font-size: 1rem;
         cursor: pointer;
         transition: background-color 0.2s;
       }
       
       .add-button:hover:not(.disabled) {
         background-color: #2563eb;
       }
       
       .add-button.disabled {
         opacity: 0.5;
         cursor: not-allowed;
       }
       
       /* Tasks Section */
       .tasks-section {
         padding: 1.5rem;
       }
       
       /* Empty State */
       .empty-state {
         text-align: center;
         padding: 2rem 0;
       }
       
       .empty-icon {
         font-size: 4rem;
         margin-bottom: 1rem;
       }
       
       .empty-title {
         color: #6b7280;
         font-size: 1.125rem;
         font-weight: 500;
         margin: 0 0 0.25rem 0;
       }
       
       .empty-subtitle {
         color: #9ca3af;
         margin: 0;
         font-size: 0.875rem;
       }
       
       /* Tasks Container */
       .tasks-container {
         display: flex;
         flex-direction: column;
         gap: 0.75rem;
       }
       
       .tasks-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         font-size: 0.875rem;
         color: #6b7280;
         margin-bottom: 1rem;
       }
       
       .task-count {
         font-weight: 500;
       }
       
       .clear-all-button {
         color: #ef4444;
         background: none;
         border: none;
         font-weight: 500;
         cursor: pointer;
         font-size: 0.875rem;
         transition: color 0.2s;
       }
       
       .clear-all-button:hover {
         color: #dc2626;
       }
       
       /* Task Item */
       .task-item {
         background-color: #f9fafb;
         border-radius: 0.5rem;
         padding: 1rem;
         border: 1px solid #e5e7eb;
         transition: border-color 0.2s;
       }
       
       .task-item:hover {
         border-color: #d1d5db;
       }
       
       .task-content {
         display: flex;
         align-items: flex-start;
         gap: 0.75rem;
       }
       
       .task-indicator {
         width: 0.75rem;
         height: 0.75rem;
         background-color: #3b82f6;
         border-radius: 50%;
         margin-top: 0.125rem;
         flex-shrink: 0;
       }
       
       .task-details {
         flex: 1;
       }
       
       .task-text {
         color: #111827;
         font-weight: 500;
         margin: 0 0 0.25rem 0;
         line-height: 1.4;
       }
       
       .task-meta {
         color: #6b7280;
         font-size: 0.875rem;
         margin: 0;
       }
       
       .task-actions {
         display: flex;
         gap: 0.5rem;
       }
       
       .action-button {
         background: none;
         border: none;
         cursor: pointer;
         padding: 0.25rem;
         border-radius: 0.25rem;
         font-size: 1rem;
         transition: background-color 0.2s;
       }
       
       .action-button:hover {
         background-color: #f3f4f6;
       }
       
       .edit-button:hover {
         background-color: #dbeafe;
       }
       
       .delete-button:hover {
         background-color: #fee2e2;
       }
       
       /* Edit Mode */
       .edit-container {
         display: flex;
         flex-direction: column;
         gap: 0.75rem;
       }
       
       .edit-content {
         display: flex;
         align-items: flex-start;
         gap: 0.75rem;
       }
       
       .edit-indicator {
         width: 0.75rem;
         height: 0.75rem;
         background-color: #f59e0b;
         border-radius: 50%;
         margin-top: 0.125rem;
         flex-shrink: 0;
       }
       
       .edit-input-container {
         flex: 1;
       }
       
       .edit-input {
         width: 100%;
         padding: 0.5rem 0.75rem;
         border: 1px solid #d1d5db;
         border-radius: 0.375rem;
         font-size: 1rem;
         box-sizing: border-box;
       }
       
       .edit-input:focus {
         outline: none;
         border-color: #3b82f6;
         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
       }
       
       .edit-hint {
         color: #6b7280;
         font-size: 0.75rem;
         margin: 0.25rem 0 0 0;
       }
       
       .edit-actions {
         display: flex;
         justify-content: flex-end;
         gap: 0.5rem;
       }
       
       .cancel-button {
         padding: 0.25rem 0.75rem;
         font-size: 0.875rem;
         color: #6b7280;
         background: none;
         border: none;
         cursor: pointer;
         transition: color 0.2s;
       }
       
       .cancel-button:hover {
         color: #374151;
       }
       
       .save-button {
         padding: 0.25rem 0.75rem;
         font-size: 0.875rem;
         background-color: #3b82f6;
         color: white;
         border: none;
         border-radius: 0.25rem;
         cursor: pointer;
         transition: background-color 0.2s;
       }
       
       .save-button:hover:not(.disabled) {
         background-color: #2563eb;
       }
       
       .save-button.disabled {
         opacity: 0.5;
         cursor: not-allowed;
       }
       
       /* Success Message */
       .success-message {
         position: fixed;
         bottom: 1rem;
         right: 1rem;
         background-color: #10b981;
         color: white;
         padding: 0.75rem 1.5rem;
         border-radius: 0.375rem;
         box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
         transition: opacity 0.3s ease-in-out;
         z-index: 1000;
       }
       
       .success-message.fade-out {
         opacity: 0;
       }
       
       /* Responsive Design */
       @media (max-width: 640px) {
         .app-container {
           padding: 1rem 0.5rem;
         }
         
         .todo-card {
           margin: 0;
           border-radius: 0;
         }
         
         .success-message {
           left: 1rem;
           right: 1rem;
           bottom: 1rem;
         }
       }
       </style>