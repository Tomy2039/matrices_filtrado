import json
import os
import sys

data_file = os.path.join(os.path.dirname(__file__), "../data/datos.json")

if not os.path.exists(data_file):
    print("No hay datos registrados")
    sys.exit()

with open(data_file, "r") as file:
    personas = json.load(file)

if len(sys.argv) > 1:
    opcion = sys.argv[1]

    if opcion == "mostrar_todo":
        print("\n=== Lista de Personas Registradas ===")
        for persona in personas:
            print(f"Nombre: {persona[0]}, Apellido: {persona[1]}, DNI: {persona[2]}, Telefonos: {', '.join(persona[3])}, hijos/as: {', '.join(persona[4])}")
    elif opcion == "filtrar" and len(sys.argv) == 3:
        dni_buscar = sys.argv[2]
        encontrados = [p for p in personas if p[2] == dni_buscar]

        if encontrados:
            print("\n=== Resultado de la búsqueda ===")
            for persona in encontrados:
                print(f"Nombre: {persona[0]}, Apellido: {persona[1]}, DNI: {persona[2]}, Telefonos: {', '.join(persona[3])}, hijos/as: {', '.join(persona[4])}")
        else:
            print("No se encontro ninguna persona con ese DNI.")
    else:
        print("Opcion no valida")
else:
    print("No se especifico ninguna opcion")