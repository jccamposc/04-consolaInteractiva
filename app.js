require("colors");

const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require("./helpers/inquirer");
const Tareas = require("./models/tareas");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //cargar tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        // Crear Tarea
        const desc = await leerInput("Descripcion: ");
        tareas.crearTarea(desc);
        break;
      case "2":
        //Listar Tareas
        tareas.listadoCompleto();
        break;
      case "3":
        //Listar Tareas completadas
        tareas.listarPendientesCompletadas(true);
        break;
      case "4":
        //Listar Tareas pendientes
        tareas.listarPendientesCompletadas(false);
        break;
        case "5":
        //completado || pendiente
        const ids = await mostrarListadoChecklist( tareas.listadoArr );
        tareas.toggleCompletadas( ids );
        break;
        case "6":
            //Listar Tareas borrar
            const id = await listadoTareasBorrar( tareas.listadoArr );
            const ok = await confirmar('¿Estas seguro?') ;
            if ( ok ) {
                tareas.borrarTarea( id );
                console.log('Tarea Borrada');
            }
            break;
    }

    guardarDB(tareas.listadoArr);
    await pausa();
  } while (opt !== "0");
  {
  }
};

main();
