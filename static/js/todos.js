const section = document.querySelector(".todoapp"),
form = section.querySelector(".new-todo-1"),
input = form.querySelector("input"),
ul = section.querySelector(".todo-list"),
countDiv = section.querySelector('.count-container'),
span = countDiv.querySelector(".todo-count");;

const finishForm = section.querySelector('.toDoFinish')
const all = document.querySelector(".all")
const active = document.querySelector(".active")
const completed = document.querySelector(".completed")
const APIURL = 'http://localhost:3000/todos/'
let toDo = [];
const checkClick = {
    All: true,
    Active: false,
    Completed: false
}

function clearScreen(){
    const li = ul.querySelectorAll("li")
    li.forEach(function(li){
        ul.removeChild(li);
    })
}
function clickAll(){
    clearScreen();
    loadToDo();
    all.classList.add("selected")
    completed.classList.remove("selected")
    active.classList.remove("selected")
    checkClick.All = true
    checkClick.Active = false
    checkClick.Completed = false
}


function clickActive(){
    clearScreen();
    const filtToDo = toDo.filter(function(toDo){
        return !toDo.finish
    })
    filtToDo.forEach(function(toDos){
        paintToDo(toDos.text, toDos.todo_id, toDos.finish)
    })
    all.classList.remove("selected")
    completed.classList.remove("selected")
    active.classList.add("selected")
    checkClick.All = false
    checkClick.Active = true
    checkClick.Completed = false
}


function clickCom(){
    clearScreen();
    const filtToDo = toDo.filter(function(toDo){
        return toDo.finish
    })
    filtToDo.forEach(function(toDos){
        paintToDo(toDos.text, toDos.todo_id, toDos.finish)
    })
    all.classList.remove("selected")
    completed.classList.add("selected")
    active.classList.remove("selected")
    checkClick.All = false
    checkClick.Active = false
    checkClick.Completed = true
}

function paintToDo(todos, id, finish){
    const li = document.createElement("li");
    const div = document.createElement('div');
    const input = document.createElement('input');
    const input_2 = document.createElement('input');
    const label = document.createElement('label');
    const btn = document.createElement('button');
    btn.addEventListener("click", deleeteToDo);
    div.classList.add("view");
    label.classList.add("label");
    btn.classList.add("destroy");
    input.classList.add("toggle");
    input.type = "checkbox"
    input.value = "finish"
    if(finish){
        input.checked = "checked"
        li.classList.add("completed")
    } else {
        input.checked = ""
    }
    label.innerText = todos;
    input_2.classList.add("edit");
    input_2.value = "새로운 타이틀";
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(btn);
    li.appendChild(div);
    li.appendChild(input_2);
    li.id = id;
    ul.appendChild(li);
}

function paincount(){
    if(toDo !== null){
        span.innerHTML = `총 <strong>${toDo.length}</strong> 개`
    }
}


function deleeteToDo(event){
    const btn = event.target;
    const div = btn.parentNode;
    const li = div.parentNode;
    ul.removeChild(li);
    const cleanToDos = toDo.filter(function(toDo){
        return toDo.todo_id !== parseInt(li.id);
    });
    toDo.forEach(function(todo){
        if(todo.todo_id == parseInt(li.id)){
            fetch(`http://localhost:3000/todos/${todo.todo_id}`, {
            method: 'DELETE'
        })
    }
        })
    toDo = cleanToDos
    console.log(cleanToDos)
    paincount();
}

function addToDo(todos){
    const li = document.createElement("li");
    const div = document.createElement('div');
    const input = document.createElement('input');
    const input_2 = document.createElement('input');
    const label = document.createElement('label');
    const btn = document.createElement('button');
    let newId = 0
    if(toDo.length === 0){
        newId = toDo.length + 1
    } else {
        lastToDo = toDo[toDo.length -1]
        newId = lastToDo.todo_id + 1
    }
    btn.addEventListener("click", deleeteToDo);
    div.classList.add("view");
    label.classList.add("label");
    btn.classList.add("destroy");
    input.classList.add("toggle");
    input.type = "checkbox"
    input.value = "finish"
    input.checked = ""
    input_2.classList.add("edit");
    input_2.value = "새로운 타이틀";
    label.innerText = todos;
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(btn);
    li.appendChild(div);
    li.appendChild(input_2);
    li.id = newId;
    ul.appendChild(li);
    const toDoObj = {
        text: todos,
        todo_id: newId,
        finish: false
    };
    toDo.push(toDoObj);
    fetch(APIURL, {
        method: 'POST',
        body: JSON.stringify(toDoObj),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response){
        return response.json()
    }).then(function(json){
        console.log(json)
    })
}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = input.value;
    input.value = "";
    addToDo(currentValue);
    paincount();
    if(checkClick.All) {
        clickAll();
    } else if (checkClick.Active){
        clickActive();
    } else if (checkClick.Completed){
        clickCom();
    }
}

function loadToDo(){
    if(toDo !== null){
        toDo.forEach(function(toDo){
            paintToDo(toDo.text, toDo.todo_id, toDo.finish)
        })
    } else {
    }
    paincount();
}

function handleChek(event){
    event.preventDefault();
    const finish = event.target;
    const div = finish.parentNode;
    const li = div.parentNode;
    toDo.forEach(function(todo){
        if(todo.todo_id === parseInt(li.id)){
            if(event.target.checked){
                li.classList.add("completed")
                todo.finish = true
            } else {
                li.classList.remove("completed")
                todo.finish = false
            }
            console.log(todo.finish)
            fetch(`http://localhost:3000/todos/${todo.todo_id}/`, {
                method: 'PUT',
                body: JSON.stringify({
                    text: todo.text,
                    todo_id: todo.todo_id,
                    finish: todo.finish
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        }
    })
    if(checkClick.All) {

    } else if (checkClick.Active){
        clickActive();
    } else if (checkClick.Completed){
        clickCom();
    }
}

function init(){
    loadToDo();
    form.addEventListener("submit", handleSubmit);
    finishForm.addEventListener("change", handleChek);
    all.addEventListener("click", clickAll);
    active.addEventListener("click", clickActive);
    completed.addEventListener("click", clickCom);
}

fetch(APIURL).then(function(res){
    return res.json();
}).then(function(json){
    toDo = json
    init();
})