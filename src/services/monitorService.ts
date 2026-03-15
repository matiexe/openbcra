'use server';

export interface EndpointStatus {
  name: string;
  url: string;
  status: 'online' | 'offline';
  latency: number;
  error?: string;
  lastChecked: string;
}

const ENDPOINTS = [
  { name: 'Plazos Fijos', url: 'https://api.bcra.gob.ar/transparencia/v1.0/PlazosFijos' },
  { name: 'Cajas de Ahorros', url: 'https://api.bcra.gob.ar/transparencia/v1.0/CajasAhorros' },
  { name: 'Tarjetas de Crédito', url: 'https://api.bcra.gob.ar/transparencia/v1.0/TarjetasCredito' },
  { name: 'Paquetes de Productos', url: 'https://api.bcra.gob.ar/transparencia/v1.0/PaquetesProductos' },
  { name: 'Préstamos Personales', url: 'https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Personales' },
  { name: 'Préstamos Prendarios', url: 'https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Prendarios' },
  { name: 'Préstamos Hipotecarios', url: 'https://api.bcra.gob.ar/transparencia/v1.0/Prestamos/Hipotecarios' },
  { name: 'Central de Deudores', url: 'https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/20345678901' },
  { name: 'Cheques Rechazados', url: 'https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/ChequesRechazados/20345678901' },
  { name: 'Estadísticas Monetarias', url: 'https://api.bcra.gob.ar/estadisticas/v4.0/monetarias' },
  { name: 'Cotizaciones Cambiarias', url: 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones' },
];

async function checkEndpoint(name: string, url: string): Promise<EndpointStatus> {
  const start = Date.now();
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
    });
    
    const latency = Date.now() - start;
    
    if (response.ok) {
      return {
        name,
        url,
        status: 'online',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        name,
        url,
        status: 'offline',
        latency,
        error: `HTTP Error: ${response.status} ${response.statusText}`,
        lastChecked: new Date().toISOString(),
      };
    }
  } catch (error: any) {
    const latency = Date.now() - start;
    return {
      name,
      url,
      status: 'offline',
      latency,
      error: error.message || 'Network error or timeout',
      lastChecked: new Date().toISOString(),
    };
  }
}

export async function getApiHealthStatus(): Promise<EndpointStatus[]> {
  const results = await Promise.all(
    ENDPOINTS.map(endpoint => checkEndpoint(endpoint.name, endpoint.url))
  );
  return results;
}
