
let itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
const outputInfo = document.getElementById('output-info')
const paginationBtn = document.querySelectorAll('button')

async function fetchTodos() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await res.json();

    const arr = []
    itemsArray = arr.concat(data)
    localStorage.setItem("items", JSON.stringify(itemsArray));
}

const renderTodos = (arr) => {
    let items = '';
    arr.forEach(todo => {
        items += 
        `<div class="container-info">
            <p class="title ${todo.completed ? "" : "line"}">${todo.title}</p>
            <div class="coltrol-todos">
                <i class="fa-solid fa-pen-to-square"></i>
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>`
    })
    outputInfo.innerHTML = items
    deleteItem()
    toggleCompleted()

}

function paginationPage(page) {
    const pageNumber = itemsArray.filter(item => item.userId === page)
    renderTodos(pageNumber);
    paginationBtn.forEach(elem => elem.removeEventListener('click', paginationPage))
}

function pagination() {
    paginationBtn.forEach(elem => {
        elem.addEventListener('click', (e) => paginationPage(Number(e.target.value)));
    })
}

function deleteItem() {
    let deleteBtn = document.querySelectorAll('.fa-trash');
    deleteBtn.forEach((todo, i) => {
        todo.addEventListener('click', () => deleteTodo(i));
    })
    deleteBtn.forEach (todo => todo.removeEventListener('click', deleteTodo))
}


function deleteTodo(id) {
    itemsArray.splice(id, 1);
    localStorage.removeItem('items')
    localStorage.setItem('items', JSON.stringify(itemsArray));
    // location.reload()
    renderTodos(itemsArray)
}


function toggleCompleted() {
    let checkedTodo = document.querySelectorAll('.fa-pen-to-square')
    
    checkedTodo.forEach((elem, idx) => {
        elem.addEventListener('click', () => toggleElem(idx))
    })
}

function toggleElem(idx) {
    if (itemsArray) {
        itemsArray = itemsArray.map((item, i) => {
            return {
                ...item,
                completed: i === idx ? !item.completed : item.completed
            }
        })
    }

    localStorage.setItem('items', JSON.stringify(itemsArray));
    renderTodos(itemsArray)
}


function searchValue() {
    const allTodos = document.querySelectorAll(':scope #output-info .container-info')
    const serachInputValue = document.querySelector('#input')
    serachInputValue.addEventListener('input', function(e) {
        outputInfo.innerHTML = ''
        const searchStr = e.target.value.toLowerCase()
        allTodos.forEach(el => {
            const valueTitle = el.querySelectorAll('.title')
            if(valueTitle[0].innerText.toLowerCase().indexOf(searchStr) > -1) {
                outputInfo.appendChild(el)
            }
        })
    })
}


// наш fetch отрабатывает один раз. далее данные берем с localStorage.
const onceFetch = () => {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            fetchTodos()
        }
    };
   
}

window.onload = function() {
    onceFetch()
    renderTodos(itemsArray.slice(0, 20))
    searchValue()
    pagination()
}