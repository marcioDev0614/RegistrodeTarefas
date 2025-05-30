// Seleção de elementos

// Adicionar nova tarefa
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

// Listar as tarefas
const todoList = document.querySelector("#todo-list");

// Editar tarefs
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");

// Cancelar tarefa
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

// Busca de tarefas
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

//Texto antigo no input editar
let oldInputValue;

// Funções

const saveTodo = (text, done = 0, save = 1)=>{

    // Cria a div
    const todo = document.createElement("div")
    todo.classList.add("todo")

    // Adiciona o h3 na div
    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    // Adicionar botões em cada tarefa na lista
    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check-double"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-todo")
    deleteBtn.innerHTML = ' <i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    // Utilizando dados da local storage

    if(done){
        todo.classList.add("done")
    }

    if(save){
        saveTodoLocalStorage({text, done})
    }


    // Adiciona a tarefa completa na lista
    todoList.appendChild(todo)

    // Limpa o campo após salvar
    todoInput.value = ''

    // Dar foco ao campo input
    todoInput.focus()


};

const toggleForms = () =>{
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text

            updateTodoLocalStorage(oldInputValue, text)
        }
    })

}

const getSearchTodos = (search) =>{

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase()

        const normalizedSearch = search.toLowerCase()

        todo.style.display = "flex"

        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none"
        }
    })
}

// Eventos


const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo")

    switch(filterValue){
        case "all":
            todos.forEach((todo) =>
                todo.style.display = "flex")
            break;
            case "done":
                todos.forEach((todo) => todo.classList.contains("done") 
                ? (todo.style.display = "flex") 
                : (todo.style.display = "none"))
            break;
            case "todo":
                todos.forEach((todo) => !todo.classList.contains("done") 
                ? (todo.style.display = "flex") 
                : (todo.style.display = "none"))
            break;

            default:
                break;
    }

}



todoForm.addEventListener("submit", (e)=> {
    e.preventDefault()

    const inputValue  = todoInput.value 
    // Save input
    if(inputValue){
        saveTodo(inputValue)
    }
})


document.addEventListener("click", (e) =>{
    const targetEl = e.target
    const parentEl = targetEl.closest("div")
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
    parentEl.classList.toggle("done")

    updateTodoStatusLocalStorage(todoTitle)

    }
    if(targetEl.classList.contains("delete-todo")){
        parentEl.remove()

        removeTodoLocalStorage(todoTitle)
    }
    

    if(targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener("click", (e) =>{
    e.preventDefault()

    toggleForms()
})


editForm.addEventListener("submit", (e) =>{
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
        // Atualizar
          updateTodo(editInputValue)  

    }

    toggleForms()
})


searchInput.addEventListener("keyup", (e)=>{

    const search = e.target.value

    getSearchTodos(search)

})


eraseBtn.addEventListener("click", (e) =>{
    e.preventDefault()

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"))
})

filterBtn.addEventListener("change", (e) => {

const filterValue = e.target.value

filterTodos(filterValue)

})

// Local storage

const getTodosLocalStogare = () =>{

    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos
}

const loadTodos = ()=>{
    const todos = getTodosLocalStogare()

    todos.forEach((todo) =>{
        saveTodo(todo.text, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todo)=>{

    // Pegar todos os todos da local storage
        const todos = getTodosLocalStogare()

    // adicionar o novo todo no array
      todos.push(todo)

    //  salvar tudo no local storage
    localStorage.setItem("todos", JSON.stringify(todos))

}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStogare();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos))
}


const updateTodoStatusLocalStorage = (todoText) =>{
    const todos = getTodosLocalStogare();

    todos.map((todo) => todo.text == todoText ? todo.done = !todo.done : null)

    localStorage.setItem("todos", JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) =>{
    const todos = getTodosLocalStogare();

    todos.map((todo) => todo.text == todoOldText ? (todo.text = todoNewText) : null)

    localStorage.setItem("todos", JSON.stringify(todos))
}

loadTodos();