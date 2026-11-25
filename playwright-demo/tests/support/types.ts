export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductPayload {
  name: string;
  price: number;
}

export interface ApiErrorResponse {
  message: string;
}

export interface HealthResponse {
  status: string;
}

export interface ServiceInfoResponse {
  name: string;
  status: string;
}
