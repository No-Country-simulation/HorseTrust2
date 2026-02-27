interface Props {
  horse: any
}

export default function HorseDetailContainer({ horse }: Props){
    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-4">
                {horse.name}
            </h1>

            <p>{horse.breed} • {horse.age} años</p>
            <p>{horse.discipline}</p>
            <p>Precio: {horse.price ?? "Consultar"}</p>

            <div className="mt-6">
                <h2 className="text-xl mb-2">Propietario</h2>
                <p>{horse.owner.first_name} {horse.owner.last_name}</p>
                <p>{horse.owner.email}</p>
            </div>

            <div className="mt-6">
                <h2 className="text-xl mb-2">Documentos</h2>
                {horse.documents.map((doc: any) => (
                <p key={doc.id}>{doc.category}</p>
                ))}
            </div>
        </div>
    )
}