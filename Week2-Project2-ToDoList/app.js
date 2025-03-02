const TaskManager = (function () {
    
    const DOM = {
        form: document.getElementById('task-form'),
        tasksList: document.getElementById('tasks-list'),
        emptyMessage: document.getElementById('empty-message'),
        titleInput: document.getElementById('task-title'),
        descriptionInput: document.getElementById('task-description'),
        errorMessage: document.getElementById('error-message'),
        showCompletedBtn: document.getElementById('show-completed'),
        priorityFilter: document.getElementById('priority-filter'),
        sortOptions: document.getElementById('sort-options'),
        taskTemplate: document.getElementById('task-template') 
    };

    let tasks = [];

    let filters = {
        completionFilter: 'all',
        priorityFilter: 'all'
    };


    let draggedItem = null;
    let draggedItemIndex = null;

    
    function init() {
        registerEventListeners();

        updateUI();
    }


    function registerEventListeners() {

        DOM.form.addEventListener('submit', onFormSubmit);

        DOM.tasksList.addEventListener('click', onTaskClick);

        DOM.showCompletedBtn.addEventListener('click', toggleCompletedFilter);
        
        DOM.priorityFilter.addEventListener('change', handlePriorityFilter);

        DOM.sortOptions.addEventListener('change', handleSort);

        DOM.tasksList.addEventListener('dragstart', onDragStart);
        DOM.tasksList.addEventListener('dragend', onDragEnd);
        DOM.tasksList.addEventListener('dragover', onDragOver);
        DOM.tasksList.addEventListener('drop', onDrop);
    }


    function onFormSubmit(event) {
        event.preventDefault();

        try {
            const formData = getFormData();

            if (!validateFormData(formData)) {
                return;
            }

            addNewTask(formData);

            resetForm();

            updateUI();

            setTimeout(() => {
                const newTask = document.querySelector(`.task-item[data-id="${formData.id}"]`);

                if (newTask) {
                    newTask.classList.add('highlight');

                    setTimeout(() => {
                        newTask.classList.remove('highlight');
                    }, 1500);
                }
            }, 100);
        } catch (error) {
            showError(`Beklenmedik bir hata oluştu: ${error.message}`);
            console.error(error);
        }
    }



    function getFormData() {
        const title = DOM.titleInput.value.trim();
        const description = DOM.descriptionInput.value.trim();
        const priorityInput = document.querySelector('input[name="priority"]:checked');

        if (!title) {
            throw new Error('Görev başlığı boş olamaz.');
        }

        if (!priorityInput) {
            throw new Error('Lütfen bir öncelik seviyesi seçiniz.');
        }

        return {
            title,
            description,
            priority: priorityInput.value,
            completed: false,
            id: Date.now().toString()
        };
    }


    function validateFormData(data) {
        if (!data.title) {
            showError('Görev başlığı boş olamaz!');
            return false;
        }

        if (!data.priority) {
            showError('Lütfen bir öncelik seviyesi seçiniz!');
            return false;
        }

        hideError();
        return true;
    }


    function addNewTask(taskData) {
        tasks.push(taskData);
    }


    function deleteTask(taskId) {
        const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);

        if (taskElement) {
            taskElement.classList.add('removing');

            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== taskId);
                updateUI();
            }, 500);
        } else {
            tasks = tasks.filter(task => task.id !== taskId);
            updateUI();
        }
    }


    function toggleTaskCompletion(taskId) {
        const task = tasks.find(task => task.id === taskId);

        if (task) {
            task.completed = !task.completed;

            const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);

            if (taskElement) {
                if(task.completed) {
                    taskElement.classList.add('completed');
                } else {
                    taskElement.classList.remove('completed');
                }

                const completeBtn = taskElement.querySelector('.complete-btn');
                completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
                completeBtn.title = task.completed ? 'Geri Al' : 'Tamamla';

                if ((filters.completionFilter === 'completed' && !task.completed) || (filters.completionFilter === 'active' && task.completed)) {
                    taskElement.classList.add('removing');

                    setTimeout(() => {
                        updateUI();
                    }, 500);
                }
            } else {
                updateUI();
            }
        }
    }



    function toggleCompletedFilter() {

        switch(filters.completionFilter) {

            case 'all':
                filters.completionFilter = 'completed';
                DOM.showCompletedBtn.innerHTML = '<i class="fas fa-filter"></i> Tamamlanmayanları Göster';
                break;

            case 'completed':
                filters.completionFilter = 'active';
                DOM.showCompletedBtn.innerHTML = '<i class="fas fa-filter"></i> Tümünü Göster';
                break;

            case 'active':
                filters.completionFilter = 'all';
                DOM.showCompletedBtn.innerHTML = '<i class="fas fa-filter"></i> Tamamlananları Göster';
                break;

            default:
                filters.completionFilter = 'all';
                DOM.showCompletedBtn.innerHTML = '<i class="fas fa-filter"></i> Tamamlananları Göster';
        }

        updateUI();
    }



    function handlePriorityFilter() {
        filters.priorityFilter = DOM.priorityFilter.value;
        updateUI();
    }


    function handleSort() {
        const sortType = DOM.sortOptions.value;
        
        if (sortType === 'default') return;
        
        switch(sortType) {
            case 'priority-desc':
                sortByPriorityDesc();
                break;
            case 'priority-asc':
                sortByPriorityAsc();
                break;
            case 'date-asc':
                sortByDateAsc();
                break;
            case 'date-desc':
                sortByDateDesc();
                break;
        }
        
        updateUI();
    }


    function sortByPriorityDesc() {
        const priorityOrder = {'high': 0, 'medium': 1, 'low': 2};
        
        tasks.sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }


    function sortByPriorityAsc() {
        const priorityOrder = {'high': 0, 'medium': 1, 'low': 2};
        
        tasks.sort((a, b) => {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }


    function sortByDateAsc() {
        tasks.sort((a, b) => {
            return parseInt(a.id) - parseInt(b.id);
        });
    }


    function sortByDateDesc() {
        tasks.sort((a, b) => {
            return parseInt(b.id) - parseInt(a.id);
        });
    }



    function onTaskClick(event) {
        event.stopPropagation();

        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        if (event.target.closest('.complete-btn')) {
            toggleTaskCompletion(taskId);
        }

        if (event.target.closest('.delete-btn')) {
            deleteTask(taskId);
        }
    }



    function onDragStart(event) {
        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return;

        draggedItem = taskItem;
        draggedItemIndex = Array.from(DOM.tasksList.getElementsByClassName('task-item')).indexOf(taskItem);

        setTimeout(() => {
            taskItem.classList.add('dragging');
        }, 0);

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', taskItem.dataset.id);
    }

    function onDragEnd(event) {
        if (!draggedItem) return;

        draggedItem.classList.remove('dragging');

        const placeholder = document.querySelector('.sortable-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        draggedItem = null;
        draggedItemIndex = null;
    }

    function onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const taskItem = event.target.closest('.task-item');
        if (!taskItem || taskItem === draggedItem) return;

        let placeholder = document.querySelector('.sortable-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.classList.add('sortable-placeholder');
            DOM.tasksList.appendChild(placeholder);
        }

        const tasksList = DOM.tasksList;
        const taskItems = Array.from(tasksList.getElementsByClassName('task-item'));
        const targetIndex = taskItems.indexOf(taskItem);

        if (targetIndex > draggedItemIndex) {
            tasksList.insertBefore(draggedItem, taskItem.nextSibling);

            tasksList.insertBefore(placeholder, draggedItem.nextSibling);
        } else {
            tasksList.insertBefore(draggedItem, taskItem);

            tasksList.insertBefore(placeholder, taskItem);
        }

        const draggedTaskId = draggedItem.dataset.id;
        const draggedTask = tasks.find(task => task.id === draggedTaskId);
        tasks = tasks.filter(task => task.id !== draggedTaskId);
        tasks.splice(targetIndex, 0, draggedTask);
    }




    function onDrop(event) {
        event.preventDefault();

        const placeholder = document.querySelector('.sortable-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.classList.add('highlight');

            setTimeout(() => {
                draggedItem.classList.remove('highlight');
            }, 1500);
        }

        draggedItem = null;
        draggedItemIndex = null;
    }



    function renderTasks() {
        DOM.emptyMessage.style.display = 'none';

        const taskElements = DOM.tasksList.querySelectorAll('.task-item');
        taskElements.forEach(element => {
            if (!element.matches('#task-template')) {
                element.remove();
            }
        });

        const filteredTasks = getFilteredTasks();

        if (filteredTasks.length === 0) {
            DOM.emptyMessage.style.display = 'block';
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = document.importNode(DOM.taskTemplate.content, true).querySelector('.task-item');

            taskElement.dataset.id = task.id;

            if (task.completed) {
                taskElement.classList.add('completed');
            }

            taskElement.classList.add(`priority-${task.priority}`);

            taskElement.querySelector('.task-title').textContent = task.title;
            taskElement.querySelector('.task-description').textContent = task.description || 'Açıklama yok';

            const priorityElement = taskElement.querySelector('.task-priority');
            priorityElement.textContent = getPriorityText(task.priority);
            priorityElement.classList.add(`priority-${task.priority}`);

            const completeBtn = taskElement.querySelector('.complete-btn');
            completeBtn.innerHTML = task.completed 
                ? '<i class="fas fa-undo"></i>' 
                : '<i class="fas fa-check"></i>';
            completeBtn.title = task.completed ? 'Geri Al' : 'Tamamla';

            DOM.tasksList.appendChild(taskElement);
        });
    }



    function getFilteredTasks() {
        return tasks.filter(task => {
            if (filters.completionFilter === 'completed' && !task.completed) {
                return false;
            }

            if (filters.completionFilter === 'active' && task.completed) {
                return false;
            }

            if (filters.priorityFilter !== 'all' && task.priority !== filters.priorityFilter) {
                return false;
            }

            return true;
        });
    }


    function getPriorityText(priority) {
        const priorityTexts = {
            'high': 'Yüksek',
            'medium': 'Orta',
            'low': 'Düşük'
        };
        return priorityTexts[priority] || priority;
    }


    function resetForm() {
        DOM.form.reset();
    }



    function showError(message) {
        DOM.errorMessage.textContent = message;
        DOM.errorMessage.style.display = 'block';

        DOM.errorMessage.classList.add('shake');

        setTimeout(() => {
            DOM.errorMessage.classList.remove('shake');
        }, 500);
    }

    function hideError() {
        DOM.errorMessage.style.display = 'none';
    }

    function updateUI() {
        document.body.classList.remove('filter-all', 'filter-completed', 'filter-active');
        document.body.classList.add(`filter-${filters.completionFilter}`);

        renderTasks();
    }

    return {
        init
    };

})();

document.addEventListener('DOMContentLoaded', function() {
    
    try {
        TaskManager.init();
    } catch (error) {
        console.error('Uygulama başlatılırken bir hata oluştu:', error);
        alert('Uygulama başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});