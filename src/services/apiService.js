import { PUBLIC_ENDPOINTS } from '../constants/urlConstants'

/**
 * Realiza un request HTTP con soporte automático para token
 * @param {string} url - URL del endpoint
 * @param {object} options - Opciones del fetch (method, body, etc.)
 * @param {boolean} requiresToken - Si requiere token (automático para endpoints privados)
 * @returns {Promise<Response>}
 */
export const apiRequest = async (url, options = {}, requiresToken = true) => {
  // Determinar si requiere token
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint))
  const needsToken = requiresToken && !isPublicEndpoint

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Agregar token si es necesario
  if (needsToken) {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No se encontró token de autenticación')
    }
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    // Si el token expiró (401), limpiar y redirigir a login
    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
      throw new Error('Token expirado. Por favor inicia sesión nuevamente.')
    }

    return response
  } catch (error) {
    console.error('❌ Error en apiRequest:', error)
    throw error
  }
}

/**
 * GET request
 */
export const apiGet = async (url) => {
  const response = await apiRequest(url, { method: 'GET' })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

/**
 * POST request
 */
export const apiPost = async (url, data) => {
  const response = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

/**
 * PUT request
 */
export const apiPut = async (url, data) => {
  const response = await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

/**
 * DELETE request
 */
export const apiDelete = async (url) => {
  const response = await apiRequest(url, { method: 'DELETE' })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

/**
 * POST request para crear un pago de suscripción
 * @param {string} url - URL del endpoint de pago
 * @param {object} paymentData - Datos del pago (planId, etc.)
 * @returns {Promise<object>} - Retorna objeto con initPoint o sandboxInitPoint
 */
export const apiPayment = async (url, paymentData) => {
  const response = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(paymentData)
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPayment
}
