// src/services/sesion.service.ts
import api from '@/lib/api';
import { SesionResponse, Disponibilidad } from '@/models/sesion.models';
// La lógica de pago y reserva se ha movido a sus propios servicios.

export const getMisTutorias = async (): Promise<SesionResponse[]> => {
    try {
        const response = await api.get<SesionResponse[]>('/sesiones/mis-solicitudes');
        return response.data || [];
    } catch (error: any) {
        if (error.response?.status === 204) return [];
        throw new Error(error.response?.data?.message || "Error al obtener tus tutorías.");
    }
};

export const getDisponibilidadTutor = async (tutorId: number): Promise<Disponibilidad[]> => {
  try {
    const response = await api.get<Disponibilidad[]>(`/tutores/${tutorId}/disponibilidades`);
    return response.data || [];
  } catch (error: any) {
    if (error.response?.status === 204) return [];
    throw new Error(error.response?.data?.message || "No se pudo cargar la disponibilidad del tutor.");
  }
};