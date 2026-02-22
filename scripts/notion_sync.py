import json
import os
import subprocess

import requests

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
}


def obtener_data_notion(guardar_json=False, archivo_salida="notion_data.json"):
    """
    Consulta la base de datos de Notion y devuelve las páginas (historias de usuario).

    Args:
        guardar_json: Si es True, guarda la data en un archivo JSON
        archivo_salida: Nombre del archivo JSON de salida
    """
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    respuesta = requests.post(url=url, headers=headers)
    data = respuesta.json().get("results", [])

    if guardar_json:
        with open(archivo_salida, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data guardada en {archivo_salida}")

    return data


def obtener_issues_existentes():
    """
    Obtiene títulos de issues abiertos para evitar duplicados
    """
    result = subprocess.run(
        ["gh", "issue", "list", "--json", "title", "--limit", "100"],
        capture_output=True,
        text=True,
    )

    issues = json.loads(result.stdout)
    return [i["title"] for i in issues]


def sync(guardar_serializado=False, archivo_salida="historias_usuario.json"):
    """
    Sincroniza las historias de usuario de Notion con GitHub Issues.

    Args:
        guardar_serializado: Si es True, guarda las historias serializadas en JSON
        archivo_salida: Nombre del archivo de salida
    """
    data = obtener_data_notion()
    titulos_existentes = obtener_issues_existentes()
    historias_serializadas = []

    for page in data:
        props = page["properties"]

        id_list = props.get("ID", {}).get("title", [])
        id = id_list[0].get("plain_text", "000") if id_list else "000"

        try:
            id_numero = int(id.split("-")[1]) if "-" in id else 0
        except (IndexError, ValueError):
            id_numero = 0

        titulo_list = props.get("Titulo", {}).get("rich_text", [])
        title_text = (
            titulo_list[0].get("plain_text", "Sin Título")
            if titulo_list
            else "Sin Título"
        )

        prioridad = (
            props.get("Prioridad", {}).get("select", {}).get("name", "Media")
            if props.get("Prioridad", {}).get("select")
            else "Media"
        )

        titulo_final = f"HU #{id_numero} {title_text}"

        # Validar si ya existe
        if titulo_final in titulos_existentes:
            print(f"⊘ Saltando: {titulo_final} (Ya existe en GitHub)")
            continue

        historia_list = props.get("Historia", {}).get("rich_text", [])
        historia = historia_list[0].get("plain_text", "") if historia_list else ""

        criterios_list = props.get("Criterios de Aceptación", {}).get("rich_text", [])
        criterios = criterios_list[0].get("plain_text", "") if criterios_list else ""

        descripcion_final = (
            f"{historia}\n\nCriterios de aceptacion\n\n{criterios}".strip()
        )

        historia_serializada = {
            "title": titulo_final,
            "description": descripcion_final,
            "labels": prioridad,
        }
        historias_serializadas.append(historia_serializada)

        print(f"✓ Serializada: {titulo_final}")

        subprocess.run(
            [
                "gh",
                "issue",
                "create",
                "--title",
                titulo_final,
                "--body",
                descripcion_final,
                "--label",
                prioridad,
            ]
        )

        print(f"Serializada: {titulo_final}")

    if guardar_serializado:
        with open(archivo_salida, "w", encoding="utf-8") as f:
            json.dump(historias_serializadas, f, indent=2, ensure_ascii=False)
        print(f"\nHistorias serializadas guardadas en {archivo_salida}")
        print(f"Total: {len(historias_serializadas)} historias")


sync()
