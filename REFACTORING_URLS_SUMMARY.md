# 📋 Refactorización de URLs y Autenticación

## ✅ Cambios Realizados

### 1. **urlConstants.js** - Actualizado
- ✅ URLs actualizadas a `http://127.0.0.1:3000` (desarrollo local)
- ✅ Separados endpoints públicos (auth) de privados (requieren token)
- ✅ Array `PUBLIC_ENDPOINTS` para identificar qué no requiere token
- ✅ Estructura centralizada de endpoints

### 2. **apiService.js** - Nuevo archivo
- ✅ Servicio centralizado para requests HTTP
- ✅ Manejo automático de tokens (`Authorization` header)
- ✅ Funciones: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
- ✅ Redirección automática a login si token expira (401)
- ✅ Manejo de errores mejorado

### 3. **Login.vue** - Actualizado
- ✅ Usa `AUTH_ENDPOINTS` en lugar de URLs hardcodeadas
- ✅ Usa `apiPost()` en lugar de `fetch()`
- ✅ Logs mejorados con emojis
- ✅ Manejo de errores más limpio

### 4. **VideoPlayer.vue** - Actualizado
- ✅ Importa `VIDEO_ENDPOINTS` y `apiPost`
- ✅ Usa `apiPost()` para obtener URL de video
- ✅ Código más limpio y mantenible

---

## 🚀 Componentes que Aún Necesitan Actualización

### Pendientes:
- [ ] **CatalogoPelis.vue** - Usa endpoints de videos
- [ ] **CatalogoShows.vue** - Usa endpoints de videos
- [ ] **UploadVideo.vue** - Usa endpoints de upload
- [ ] **Pagos.vue** - Usa endpoints de pagos
- [ ] **Search.vue** - Búsqueda de videos/shows
- [ ] **Home.vue** (si existe) - Carga de catálogo

---

## 📝 Cómo Usar el Nuevo Servicio

### Ejemplo 1: GET request
```javascript
import { apiGet } from '../services/apiService'
import { USER_ENDPOINTS } from '../constants/urlConstants'

// Automáticamente agrega el token
const user = await apiGet(USER_ENDPOINTS.GET_DETAILS)
```

### Ejemplo 2: POST request
```javascript
import { apiPost } from '../services/apiService'
import { PAYMENT_ENDPOINTS } from '../constants/urlConstants'

const result = await apiPost(PAYMENT_ENDPOINTS.PAY_SUBSCRIPTION, {
    userId: 1,
    planId: 2
})
```

### Ejemplo 3: Sin token (auth endpoints)
```javascript
import { apiPost } from '../services/apiService'
import { AUTH_ENDPOINTS } from '../constants/urlConstants'

// No requiere token, lo detecta automáticamente
const loginData = await apiPost(AUTH_ENDPOINTS.LOGIN, {
    email: 'user@example.com',
    password: 'password'
})
```

---

## ✨ Beneficios de Este Cambio

1. **Centralizado** - Todas las URLs en un lugar
2. **Automático** - Token incluido automáticamente
3. **Seguro** - Si token expira, redirige a login
4. **Limpio** - Código más legible y mantenible
5. **DRY** - No se repite el código de autenticación

---

## 🔧 Próximos Pasos

Para actualizar los componentes pendientes, sigue este patrón:

```javascript
// ANTES
const response = await fetch('http://127.0.0.1:3000/endpoint', {
    headers: { Authorization: `Bearer ${token}` }
})

// DESPUÉS
import { apiGet } from '../services/apiService'
import { ENDPOINTS } from '../constants/urlConstants'

const data = await apiGet(ENDPOINTS.ENDPOINT)
```

---

## 📌 Notas Importantes

- El `apiService.js` obtiene el token automáticamente de `localStorage`
- Si el token está expirado (respuesta 401), redirige a `/login`
- Los endpoints en `PUBLIC_ENDPOINTS` no requieren token
- Los logs incluyen emojis para fácil identificación

¿Necesitas ayuda actualizando los demás componentes?
