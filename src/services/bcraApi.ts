'use server';

import { PlazoFijo, CajaAhorro, Prestamo, TarjetaCredito, PaqueteProducto, DeudorResponse, DeudaHistoricaResponse } from '../types/bcra';

const BASE_URL = 'https://api.bcra.gob.ar/transparencia/v1.0';
// ... rest remains same but including getPaquetesProductos below
const DEUDORES_URL = 'https://api.bcra.gob.ar/centraldedeudores/v1.0';
const ESTADISTICAS_URL = 'https://api.bcra.gob.ar/estadisticas/v4.0';
const CAMBIARIAS_URL = 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0';

async function fetchFromBcra(url: string): Promise<any> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.results || (Array.isArray(data) ? data : data);
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function getPlazosFijos(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/PlazosFijos?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/PlazosFijos`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getCajasAhorros(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/CajasAhorros?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/CajasAhorros`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getTarjetasCredito(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/TarjetasCredito?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/TarjetasCredito`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getPaquetesProductos(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/PaquetesProductos?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/PaquetesProductos`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getPrestamosPersonales(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/Prestamos/Personales?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/Prestamos/Personales`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getPrestamosPrendarios(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/Prestamos/Prendarios?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/Prestamos/Prendarios`;
  return (await fetchFromBcra(url)) || []; 
}

export async function getPrestamosHipotecarios(codigoEntidad?: number) { 
  const url = codigoEntidad ? `${BASE_URL}/Prestamos/Hipotecarios?codigoEntidad=${codigoEntidad}` : `${BASE_URL}/Prestamos/Hipotecarios`;
  return (await fetchFromBcra(url)) || []; 
}

// Obtener todas las entidades reportadas
export async function getEntidades() {
  const pfs = await getPlazosFijos();
  const entidadesMap = new Map();
  pfs.forEach((pf: PlazoFijo) => {
    if (!entidadesMap.has(pf.codigoEntidad)) {
      entidadesMap.set(pf.codigoEntidad, pf.descripcionEntidad);
    }
  });
  return Array.from(entidadesMap.entries()).map(([codigo, nombre]) => ({ codigo, nombre }));
}

// Obtener nombre de una entidad por código
export async function getEntidadNombre(codigo: number) {
  const entidades = await getEntidades();
  return entidades.find(e => e.codigo === codigo)?.nombre || `Entidad ${codigo}`;
}

export async function getDeuda(identificacion: string): Promise<DeudorResponse | null> {
  try {
    const url = `${DEUDORES_URL}/Deudas/${identificacion}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.results) return data.results;
    if (data.identificacion) return data;
    return null;
  } catch (error) {
    console.error('Deuda fetch error:', error);
    return null;
  }
}

export async function getChequesRechazados(identificacion: string) {
  try {
    const url = `${DEUDORES_URL}/Deudas/ChequesRechazados/${identificacion}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.results || (data.status === 200 ? data : null);
  } catch (error) {
    console.error('Cheques fetch error:', error);
    return null;
  }
}

// NUEVOS SERVICIOS: ESTADISTICAS
export async function getPrincipalesVariables() {
  return await fetchFromBcra(`${ESTADISTICAS_URL}/monetarias`);
}

export async function getCotizaciones() {
  return await fetchFromBcra(`${CAMBIARIAS_URL}/Cotizaciones`);
}

export async function getDeudaHistorica(identificacion: string): Promise<DeudaHistoricaResponse | null> {
  try {
    const url = `${DEUDORES_URL}/Deudas/Historica/${identificacion}`;
    console.log(`Fetching Historical Debt from: ${url}`);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Historical Debt API error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    console.log('Historical Debt API response:', JSON.stringify(data).substring(0, 200));
    
    // El BCRA a veces devuelve los datos directamente en el objeto o dentro de 'results'
    const results = data.results || (data.identificacion ? data : null);
    
    if (results && results.periodos) {
       return results;
    }
    
    console.warn('Historical Debt: No periods found in response');
    return null;
  } catch (error) {
    console.error('Deuda Historica fetch error:', error);
    return null;
  }
}
