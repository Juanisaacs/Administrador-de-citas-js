//Campos de formulario

const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//interface del usuario
const formulario = document.querySelector('#nueva-cita');
const conetnedorCitas = document.querySelector('#citas');
let editando = false;

class Citas {
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
      
    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    };
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {

    imprimirAlerta(mensaje, tipo ){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert','d-block', 'col-12');

        //clases para el error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else{
            divMensaje.classList.add('alert-success');
        }
            divMensaje.textContent = mensaje;

            // Agregar al DOM
            document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
            // quitar la Alerta despues de 5 seg

            setTimeout(() => {
                divMensaje.remove();
            },5000)

    }
        imprimirCitas({citas}){

            this.limpiarHTML();
            
            citas.forEach(cita => {
                const {mascota, propietario,telefono, fecha, hora, sintomas, id } = cita ;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

              //Scripting de los elementos de la citas
              const mascotaParrafo = document.createElement('h2');
              mascotaParrafo.classList.add( 'card-title', 'font-weight-bolder');
              mascotaParrafo.textContent = mascota;

              const propietarioParrafo = document.createElement('p');
              propietarioParrafo.innerHTML = `
               <span class="font-weight-bolder">Propietario: </span> ${propietario}
              `;
              const telefonoParrafo = document.createElement('p');
              telefonoParrafo.innerHTML = `
               <span class="font-weight-bolder">Telefono: </span> ${telefono}
              `;
              const fechaParrafo = document.createElement('p');
              fechaParrafo.innerHTML = `
               <span class="font-weight-bolder">Fecha: </span> ${fecha}
              `;
              const horaParrafo = document.createElement('p');
              horaParrafo.innerHTML = `
               <span class="font-weight-bolder">Hora: </span> ${hora}
              `;
              const sintomasParrafo = document.createElement('p');
              sintomasParrafo.innerHTML = `
               <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
              `;
                 // Botn para eliminar una cita 
                 const btnEliminar = document.createElement('button');
                 btnEliminar.classList.add('btn','btn-danger', 'mr-2');
                 btnEliminar.innerHTML = 'Eliminar X';

                 btnEliminar.onclick = ()=> eliminarCita(id);
                 // Añade un boton par editar
                 const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn','btn-info', 'mr-2')
                btnEditar.innerHTML = 'Editar X'
                btnEditar.onclick = ()=> cargarEdicion(cita);

              // Agregar los parrafos al div citas
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);

                //Agregar las citas
                conetnedorCitas.appendChild(divCita);

            });

        }
        limpiarHTML(){
            while(conetnedorCitas.firstChild){
                conetnedorCitas.removeChild(conetnedorCitas.firstChild)
            }
        }
}

const ui = new UI();
const administrarCitas = new Citas();

//Registro de eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
    
    formulario.addEventListener('submit',nuevaCita)
}
//Objeto con la informacion de la cita
const citaObj = {
    mascota:'',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//agregar datos de la cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;

}

// valida y agrega una nueva cita 

function nuevaCita(e) {
    e.preventDefault();

    // extraer la informacion del objeto citaObj
    const {mascota, propietario,telefono, fecha, hora, sintomas} = citaObj;

    //validacion
    if (mascota === ''|| propietario ==='' || telefono === ''||fecha === '' || hora === '' || sintomas === ''){
    ui.imprimirAlerta('Todos los campos son obligatorios','error');
    return;
    }
    if (editando ){

        administrarCitas.editarCita({...citaObj})

       ui.imprimirAlerta('Guardado correctamente');
        // pasar el objeto
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        editando = false;
    } else{
            // Generar un Id

     citaObj.id = Date.now();
            // Crear nueva cita

     administrarCitas.agregarCita({...citaObj});

     ui.imprimirAlerta('Se agrego correctamente');
  
    }

    // Reiniciar objeto
     reiniciarOjt();
     //Reinicia el formulario
     formulario.reset();

     //Mostrar el Html de las citas
     ui.imprimirCitas(administrarCitas);

}
    //Reiniciar el Objeto
function reiniciarOjt(){
    citaObj.mascota = '';
    citaObj.propietario='';
    citaObj.telefono= '';
    citaObj.fecha='';
    citaObj.hora='';
    citaObj.sintomas='';
}

function eliminarCita (id) {
    // Eliminar cita
    administrarCitas.eliminarCita(id);
    // Mostar el mensaje 
    ui.imprimirAlerta('La cita se elimino correctamente');
    //Refrescar las citas
    ui.imprimirCitas(administrarCitas);

}

 // cargar datos y el modo ediccion
function cargarEdicion(cita){
    const {mascota, propietario,telefono, fecha, hora, sintomas, id} = cita;

    // llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'guardar cambios';
    editando = true;

}















