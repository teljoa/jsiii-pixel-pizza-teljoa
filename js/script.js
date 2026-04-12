const URL_BASE="http://localhost:3000"

const catalog=document.getElementsByClassName("catalog-section")[0]
const divcar=document.getElementById("pizzas-grid")
const ploading=document.getElementsByClassName("loading-text")[0]
const filtres=document.getElementById("filters-container")
const carritoDiv=document.getElementById("cart-items");
const totalDiv=document.getElementById("total-price")
const form = document.getElementById("order-form");

const nombre=document.getElementById("nombre");
const direccion=document.getElementById("direccion");
const telefono=document.getElementById("telefono");
const email=document.getElementById("email");

let pizzasData = [];
let carrito = [];

//Funcion para guardar carrito de forma local
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Funcion para cargar carrito
function cargarCarrito() {
    const data = localStorage.getItem("carrito");
    if (data) carrito = JSON.parse(data);
}

//Funcion para mostrar pizzas
function mostrarPizzas(){
    fetch(`${URL_BASE}/pizzas`)
    .then(response=>response.json())
    .then(pizzas=>{
        pizzasData = pizzas;
        renderPizzas(pizzasData);
        ploading.hidden=true;
    })
    .catch(error => console.log(error));
}

//Funcion para renderizar las pizzas
function renderPizzas(pizzas){
    divcar.innerHTML = "";

    let arraypiz=pizzas;
    arraypiz.forEach(pizza => {
        let cart=document.createElement("div");
        cart.classList.add("pizza-card");

        let emoPiz = document.createElement("span");
        emoPiz.classList.add("pizza-emoji");
        emoPiz.id=pizza.imagen;
        emoPiz.textContent = pizza.imagen;

        let titPiz = document.createElement("span");
        titPiz.classList.add("pizza-title");
        titPiz.id=pizza.nombre;
        titPiz.textContent = pizza.nombre;

        let catPiz = document.createElement("span");
        catPiz.classList.add("pizza-category");
        catPiz.id=pizza.categoria;
        catPiz.textContent = pizza.categoria;

        let priPiz = document.createElement("span");
        priPiz.classList.add("pizza-price");
        priPiz.id=pizza.precio;
        priPiz.textContent = pizza.precio;

        let button = document.createElement("button");
        button.classList.add("btn-add");
        button.dataset.id=pizza.id;
        button.textContent = "Añadir";

        cart.appendChild(emoPiz);
        cart.appendChild(titPiz);
        cart.appendChild(catPiz);
        cart.appendChild(priPiz);
        cart.appendChild(button);
        divcar.appendChild(cart);
        
    });
}
//Funcion para filtrar
function filtrers(categoria){
    if(categoria == "all"){
        renderPizzas(pizzasData);
    }else{
        const filtersPiz = pizzasData.filter(p=>p.categoria === categoria);
        renderPizzas(filtersPiz);
    }
}

//Evento de filtros
filtres.addEventListener("click",(e)=>{
    if(e.target.classList.contains("btn-filter")){
        const botones = document.querySelectorAll(".btn-filter");
        botones.forEach(btn => btn.classList.remove("active"));

        e.target.classList.add("active");

        const categoria = e.target.dataset.category;

        filtrers(categoria);
    }
})

//Añadir al carrito
divcar.addEventListener("click",(e)=>{
    if(e.target.classList.contains("btn-add")){
        const id = e.target.dataset.id;

        const pizza=pizzasData.find(p=>p.id == id);

        const existe=carrito.find(p=>p.id ==id);

        if(existe){
            existe.cantidad++;
        }else{
            carrito.push({...pizza,cantidad:1});
        }
        guardarCarrito();
        renderCarrito();
    }
})

//Funcion para renderizar el carrito
function renderCarrito(){
    carritoDiv.innerHTML="";

    if(carrito.length===0){
        const empty=document.createElement("li");
        empty.textContent="El carrito está vacío";
        empty.classList.add("empty-msg");
        carritoDiv.appendChild(empty);
        totalDiv.textContent="0€";
        return;
    }

    let total=0;

    carrito.forEach(pizza=>{
        total+= pizza.precio * pizza.cantidad;

        const li=document.createElement("li");
        li.classList.add("cart-item");

        const name=document.createElement("span");
        name.textContent=pizza.nombre;

        const control=document.createElement("div");
        control.classList.add("qty-controls");

        const btnDecrease=document.createElement("button");
        btnDecrease.textContent="-";
        btnDecrease.classList.add("btn-tiny");
        btnDecrease.dataset.id=pizza.id;
        btnDecrease.dataset.action="decrease";

        const qty=document.createElement("span");
        qty.classList.add("qty-value");
        qty.textContent=pizza.cantidad;

        const btnIncrease=document.createElement("button");
        btnIncrease.textContent="+";
        btnIncrease.classList.add("btn-tiny");
        btnIncrease.dataset.id=pizza.id;
        btnIncrease.dataset.action="increase";

        control.appendChild(btnDecrease);
        control.appendChild(qty);
        control.appendChild(btnIncrease);

        const price= document.createElement("span");
        price.textContent =  `${pizza.precio*pizza.cantidad}€`;

        li.appendChild(name);
        li.appendChild(control);
        li.appendChild(price);
        carritoDiv.appendChild(li);
    })
    totalDiv.textContent=`${total}€`;
}

carritoDiv.addEventListener("click",(e)=>{
    const id=e.target.dataset.id;
    const action=e.target.dataset.action;

    const pizza=carrito.find(p=>p.id==id);

    if (!pizza) return;

    if(action=="increase"){
        pizza.cantidad++;
    }

    if(action=="decrease"){
        pizza.cantidad--;
        if(pizza.cantidad==0){
            carrito=carrito.filter(p=>p.id != id);
        }
    }
    guardarCarrito();
    renderCarrito();
})

const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/;
const regexTelefono = /^[0-9]{9}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const showError = (input, message) => {
    const formField = input.parentElement;

    formField.classList.remove("input-success");
    formField.classList.add("input-error");

    const error = formField.querySelector("small");
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;

    formField.classList.remove("input-error");
    formField.classList.add("input-success");

    const error = formField.querySelector("small");
    error.textContent = "";
};

const checkName=()=>{
    let valit=false;
    const value=nombre.value.trim();

    if(value==""){
        showError(nombre,"El nombre es obligatorio.");
    }else if(!regexNombre.test(value)){
        showError(nombre,"Minimo 3 letras y no puede contener numeros.");
    }else{
        showSuccess(nombre);
        valit=true;
    }
    return valit;
}

const checkDireccion=()=>{
    let valit=false;
    const min=10;
    const value=direccion.value.trim();

    if(value==""){
        showError(direccion,"El nombre es obligatorio.");
    }else if(value.length<min){
        showError(direccion,"Minimo 10 caracters.");
    }else{
        showSuccess(direccion);
        valit=true;
    }
    return valit;
}

const checkTelefono = () => {
    let valid = false;
    const value = telefono.value.trim();

    if (value === "") {
        showError(telefono, "Campo obligatorio");
    } else if (!regexTelefono.test(value)) {
        showError(telefono, "9 dígitos");
    } else {
        showSuccess(telefono);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;
    const value = email.value.trim();

    if (value === "") {
        showError(email, "Campo obligatorio");
    } else if (!regexEmail.test(value)) {
        showError(email, "Email inválido");
    } else {
        showSuccess(email);
        valid = true;
    }
    return valid;
};

form.addEventListener("input", (e) => {
    switch (e.target.id) {
        case "nombre": 
            checkName(); 
            break;
        case "direccion": 
            checkDireccion(); 
            break;
        case "telefono": 
            checkTelefono(); 
            break;
        case "email": 
            checkEmail(); 
            break;
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valid =
        checkName() &&
        checkDireccion() &&
        checkTelefono() &&
        checkEmail();

    if (!valid) return;

    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    const pedido = {
        nombre: nombre.value.trim(),
        direccion: direccion.value.trim(),
        telefono: telefono.value.trim(),
        email: email.value.trim(),
        carrito: carrito,
        total: carrito.reduce((c, p) => c + p.precio * p.cantidad, 0),
        fecha: new Date().toISOString()
    };

    fetch(`${URL_BASE}/pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    });

    alert("Pedido realizado");

    carrito = [];
    guardarCarrito();
    renderCarrito();
    form.reset();
});

cargarCarrito();
renderCarrito();
mostrarPizzas();