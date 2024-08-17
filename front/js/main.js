//Llamamos la funcion para que se muestren las personas que existen actualmente
extraerPersonas();

//declaramos variable tabla para modificarla con los datos que extraigamos
let tabla = document.getElementById("tabla");

//declaramos variable formInsertar para extraer los datos que se desean insertar
let formInsertar = document.getElementById("formInsertar");

//declaramos variable formeditar para extraer los datos que se desean editar
let formEditar = document.getElementById("formEditar");

//declaramos variable myModal para poder abrir el modal de insertar y editar
let myModal = new bootstrap.Modal(document.getElementById('modalInsertar'));
let myModalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));

//declaramos variable personas para guardar los datos que extraigamos de manera global
let personas = [];


//hacemos un evento de onclick para insertar las personas con el btn insertar
formInsertar.addEventListener("submit", function (event) {
    event.preventDefault();
    insertarPersonas();
});

//hacemos un evento de onclick para editar las personas con el btn editar
formEditar.addEventListener("submit", function (event) {
    event.preventDefault();
    editarPersona();
});


//Consumimos api para obtener las personas que estan insertadas y las mostramos en tablas mediante forEach
//tambien se agregan botones de eliminar y editar con su llamado a la respectiva funcion
function extraerPersonas() {
    let endpoint = "http://localhost:3000/libros"
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            personas = data.books;

            tabla.innerHTML = "";
            personas.forEach((persona) => {
                let i = personas.indexOf(persona) + 1;
                tabla.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${persona.nombre}</td>
            <td>${persona.autor}</td>
            <td>${persona.publicationYear}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarPersona(${persona.id})"> X </button>
            </td>
            <td>
                <button class="btn btn-primary" onclick="temp(${i - 1})" data-bs-toggle="modal" data-bs-target="#modalEditar"> -> </button>
            </td>
        </tr>
        `
            });
        })

}

//Consumimos api para insertar personas obteniendo los valores del formInsertar
function insertarPersonas() {
    let datos = {
        nombre: formInsertar.elements['nombre'].value,
        autor: formInsertar.elements['autor'].value,
        publicationYear: formInsertar.elements['publicationYear'].value
    };

    let configuracion = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    };

    fetch("http://localhost:3000/crear", configuracion)
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                myModal.hide();
                formInsertar.reset();
                extraerPersonas();
            } else {
                alert("ERROR");
            }
        });
}



//consumo de api para eliminar personas usando el boton eliminar que agregamos en la funcion extraer personas
function eliminarPersona(id) {
    let configuracion = {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
        }
    };

    fetch(`http://localhost:3000/eliminar/${id}`, configuracion)
        .then(response => response.json())
        .then(data => {
            extraerPersonas();
        })
        .catch(error => console.error('Error:', error));
}



//consumo de api para editar personas usando el boton editar que agregamos en la funcion extraer personas y obteniendo los datos del formEditar, agregando los valores uno por uno para envierlo en el debido formato que pide el api
function editarPersona() {


    let id = ("id", formEditar.idEditar.value);

    let datos = {
        nombre: formEditar.elements['nombreEditar'].value,
        autor: formEditar.elements['autorEditar'].value,
        publicationYear: formEditar.elements['fechaEditar'].value
    };
    console.log(datos)

    let configuracion = {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    };

    fetch(`http://localhost:3000/editar/${id}`, configuracion)
        .then(response => response.json())
        .then(data => {

            if (data.id) {
                myModalEditar.hide();
                formEditar.reset();
                extraerPersonas();
            } else {
                formEditar.reset();
                alert("ERROR");

            }

        })



}

//funcion para que se muestren los datos de la persona que se desee editar
function temp(i) {
    document.getElementsByName('idEditar')[0].value = personas[i].id;
    document.getElementsByName('nombreEditar')[0].value = personas[i].nombre;
    document.getElementsByName('autorEditar')[0].value = personas[i].autor;
    document.getElementsByName('fechaEditar')[0].value = personas[i].publicationYear;

}
