export interface BCRAApiResponse<T> {
  status: number;
  results: T[];
}

export interface PlazoFijo {
  codigoEntidad: number;
  descripcionEntidad: string;
  denominacion?: string;
  montoMinimoInvertir: number;
  plazoMinimoInvertirDias: number;
  canalConstitucion?: string;
  tasaEfectivaAnualMinima: number;
  fechaInformacion: string;
  nombreCompleto?: string;
  nombreCorto?: string;
  territorioValidez?: string;
  masInformacion?: string;
}

export interface CajaAhorro {
  codigoEntidad: number;
  descripcionEntidad: string;
  fechaInformacion: string;
  procesoSimplificadoDebidaDiligencia?: string;
  nombreCompleto?: string;
  nombreCorto?: string;
  moneda?: string;
  costoMantenimiento?: number;
}

export interface PaqueteProducto {
  codigoEntidad: number;
  descripcionEntidad: string;
  fechaInformacion: string;
  comisionMaximaMantenimiento?: number;
  ingresoMinimoMensual?: number;
  antiguedadLaboralMinimaMeses?: number;
  edadMaximaSolicitada?: number;
  beneficiarios?: string;
  segmento?: string;
  productosIntegrantes?: string;
  nombreCompleto?: string;
  nombreCorto?: string;
}

export interface Prestamo {
  codigoEntidad: number;
  descripcionEntidad: string;
  denominacion?: string;
  montoMinimoOtorgable?: number;
  montoMaximoOtorgable: number;
  plazoMaximoOtorgable: number;
  ingresoMinimoMensual?: number;
  antiguedadLaboralMinimaMeses?: number;
  edadMaximaSolicitada?: number;
  relacionCuotaIngreso?: number;
  beneficiario?: string;
  cargoMaximoCancelacionAnticipada?: number;
  tasaEfectivaAnualMaxima: number;
  tipoTasa?: string;
  costoFinancieroEfectivoTotalMaximo?: number;
  cuotaInicial?: number;
  fechaInformacion: string;
  nombreCompleto?: string;
  nombreCorto?: string;
}

export interface TarjetaCredito {
  codigoEntidad: number;
  descripcionEntidad: string;
  comisionMaximaRenovacion: number;
  comisionMaximaAdministracionMantenimiento: number;
  tasaEfectivaAnualMaximaFinanciacion: number;
  tasaEfectivaAnualMaximaAdelantoEfectivo?: number;
  ingresoMinimoMensual?: number;
  antiguedadLaboralMinimaMeses?: number;
  edadMaximaSolicitada?: number;
  segmento?: string;
  fechaInformacion: string;
  nombreCompleto?: string;
  nombreCorto?: string;
}

// Nuevas interfaces para Central de Deudores
export interface DeudaItem {
  entidad: string;
  periodo: string;
  situacion: number;
  monto: number;
  diasAtraso?: number;
}

export interface DeudorResponse {
  identificacion: string;
  denominacion: string;
  periodo: string;
  deudas: DeudaItem[];
}
