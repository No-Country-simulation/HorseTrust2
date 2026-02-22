import re
from collections import defaultdict

# Configuración
FILE_PATH = "issues.txt"


def analyze_hu_file(path):
    hu_pattern = re.compile(r"HU #(\d+)")
    hu_map = defaultdict(list)

    try:
        with open(path, "r", encoding="utf-8") as file:
            for line_number, line in enumerate(file, 1):
                clean_line = line.strip()
                if not clean_line:
                    continue

                match = hu_pattern.search(clean_line)
                if match:
                    hu_id = match.group(1)
                    # Guardamos la línea y el número de línea para referencia rápida
                    hu_map[hu_id].append(f"Línea {line_number}: {clean_line}")

        # Generación de reporte
        print(f"{'ID HU':<8} | {'REPETICIONES':<12}")
        print("-" * 25)

        duplicates_found = False
        for hu_id, entries in sorted(hu_map.items(), key=lambda x: int(x[0])):
            if len(entries) > 1:
                duplicates_found = True
                print(f"{hu_id:<8} | {len(entries):<12}")
                for entry in entries:
                    print(f"   [!] {entry}")
                print()

        if not duplicates_found:
            print("Resultado: No se detectaron IDs de HU duplicados.")

    except FileNotFoundError:
        print(f"Error: El archivo '{path}' no existe.")
    except Exception as e:
        print(f"Error inesperado: {e}")


analyze_hu_file(FILE_PATH)
