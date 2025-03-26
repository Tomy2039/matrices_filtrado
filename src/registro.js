const readline = require("readline");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data/datos.json");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu() {
    console.log("\n=== Menú Principal ===");
    console.log("1. Ingresar una nueva persona");
    console.log("2. Mostrar todos los datos");
    console.log("3. Filtrar por DNI");
    console.log("4. Salir");

    rl.question("Seleccione una opción: ", (opcion) => {
        switch (opcion) {
            case "1":
                registrarPersona();
                break;
            case "2":
                mostrarDatos();
                break;
            case "3":
                filtrarPorDNI();  
                break;
            case "4":
                console.log("Saliendo del programa...");
                rl.close();
                break;
            default:
                console.log("Opción inválida. Inténtelo de nuevo.");
                mostrarMenu();
        }
    });
}

// Registrar una persona
function registrarPersona() { 
    rl.question("Ingrese el nombre: ", (nombre) => {
        rl.question("Ingrese el apellido: ", (apellido) => {
            rl.question("Ingrese el DNI: ", (dni) => {
                let telefonos = [];
                let hijos = [];

                function agregarTelefono() {
                    rl.question("Ingrese un teléfono (o Enter para continuar): ", (telefono) => {
                        if (telefono) {
                            telefonos.push(telefono);
                            agregarTelefono();
                        } else {
                            agregarHijos();  
                        }
                    });
                }

                function agregarHijos() {
                    rl.question("Ingrese el nombre de un hijo (o Enter para finalizar): ", (hijo) => {
                        if (hijo) {
                            hijos.push(hijo);
                            agregarHijos();
                        } else {
                            guardarPersona(nombre, apellido, dni, telefonos, hijos);
                        }
                    });
                }

                agregarTelefono(); 
            });
        });
    });
}

// Guardar persona en archivo JSON
function guardarPersona(nombre, apellido, dni, telefonos, hijos) {
    let personas = [];

    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, "utf8");
        if (data) {
            personas = JSON.parse(data);
        }
    }

    personas.push([nombre, apellido, dni, telefonos, hijos]);

    fs.writeFileSync(dataFile, JSON.stringify(personas, null, 4));

    console.log("Persona registrada con éxito.");
    mostrarMenu();
}

// Mostrar todos los datos con Python
function mostrarDatos() {
    const pythonProcess = spawn("python", ["proceso.py", "mostrar_todo"]);  

    pythonProcess.stdout.on("data", (data) => {
        console.log("\n" + data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Error en Python:\n" + data.toString());
    });

    pythonProcess.on("close", () => {
        mostrarMenu();
    });
}

// Filtrar persona por DNI con Python
function filtrarPorDNI() {
    rl.question("Ingrese el DNI a buscar: ", (dni) => {
        const pythonProcess = spawn("python", ["proceso.py", "filtrar", dni]);  

        pythonProcess.stdout.on("data", (data) => {
            console.log("\n" + data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Error en Python:\n" + data.toString());
        });

        pythonProcess.on("close", () => {
            mostrarMenu();
        });
    });
}

mostrarMenu();
