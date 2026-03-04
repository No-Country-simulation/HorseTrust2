import {
    Sex,
    Discipline,
    TypeDocument,
    Category,
    DocumentPurpose,
    HorseSaleStatus,
    ExamType,
    ExamResult,
} from '@/lib/database/enums';

export const sexLabel: Record<Sex, string> = {
    [Sex.male]: 'Macho',
    [Sex.female]: 'Hembra',
};

export const disciplineLabel: Record<Discipline, string> = {
    [Discipline.racing]: 'Carreras',
    [Discipline.jumping]: 'Salto',
    [Discipline.dressage]: 'Doma',
    [Discipline.recreational]: 'Recreacional',
};

export const typeDocumentLabel: Record<TypeDocument, string> = {
    [TypeDocument.image]: 'Imagen',
    [TypeDocument.document]: 'Documento',
    [TypeDocument.video]: 'Video',
};

export const categoryLabel: Record<Category, string> = {
    [Category.ownership]: 'Propiedad',
    [Category.veterinary]: 'Veterinario',
    [Category.competition]: 'Competencia',
    [Category.identification]: 'Identificación',
};

export const documentPurposeLabel: Record<DocumentPurpose, string> = {
    [DocumentPurpose.cover]: 'Portada',
    [DocumentPurpose.title]: 'Título',
    [DocumentPurpose.passport]: 'Pasaporte',
    [DocumentPurpose.xray]: 'Rayos X',
    [DocumentPurpose.vaccine_card]: 'Carnet de Vacunas',
    [DocumentPurpose.certificate]: 'Certificado',
};

export const horseSaleStatusLabel: Record<HorseSaleStatus, string> = {
    [HorseSaleStatus.for_sale]: 'En Venta',
    [HorseSaleStatus.reserved]: 'Reservado',
    [HorseSaleStatus.sold]: 'Vendido',
};

export const examTypeLabel: Record<ExamType, string> = {
    [ExamType.basic]: 'Básico',
    [ExamType.advanced]: 'Avanzado',
};

export const examResultLabel: Record<ExamResult, string> = {
    [ExamResult.apt]: 'Apto',
    [ExamResult.with_observations]: 'Con Observaciones',
};
