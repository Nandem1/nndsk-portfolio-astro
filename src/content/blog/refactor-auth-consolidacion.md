---
title: 'Devlog: Cómo consolidé 4 sistemas de Auth en 1'
description: 'De un caos de 4 hooks de autenticación a un sistema unificado y tipado. Reduciendo deuda técnica acumulada durante el lanzamiento acelerado.'
pubDate: 2026-02-07
tags: ['typescript', 'react', 'refactoring', 'auth']
author: 'Nande'
role: 'Fullstack Developer'
readTime: '6 min'
draft: false
---

Desde abril de 2025, empecé a construir el sistema de gestión de Mercado House desde cero.
Teniendo apenas un año en esto y aprendiendo sobre la marcha, mi prioridad no fue la arquitectura perfecta (En ese entonces), sino que el sistema funcionara y la empresa pudiera tener soluciones innovadoras.

El resultado fue un producto que funcionaba digamos que bien (o no?). Los usuarios entraban y salían sin problemas, las facturas, nominas, rindegastos, cero quejas (ya quisiera).

Pero yo sabía. Sabía que por debajo estaba cargando con una deuda técnica acumulada por mi propio aprendizaje: tenía 4 formas diferentes de manejar la sesión del usuario.

Este fin de semana, además de agregar nuevas features, decidí pagar esa deuda técnica que yo mismo generé. Aquí está el log de los cambios, esta interesante.

## Estado Anterior (El Problema)

Fruto de iterar rápido y aprender en el camino, terminé con 4 fuentes de verdad compitiendo entre sí:

1.  `AuthContext`
2.  `useAuth`
3.  `useCajaChicaAuth`
4.  `useAuthStatus`

Esto resultaba en **interfaces inconsistentes**: en algunos lugares el `id_local` era obligatorio, en otros opcional, y en otros ni siquiera existía.

## El Refactor (Changelog)

Decidí **no migrar a NextAuth.js** porque el backend ya maneja cookies HTTP-only de forma segura y performante. El problema no era la tecnología, era el orden.

### Eliminado (Cleanup)

Borrar código da un poco de miedo, pero también satisfacción. Eliminamos abstracciones que solo añadían ruido:

- **`src/hooks/useAuthStatus.ts`**: Eliminado completamente. (0 usos reales).
- **`src/hooks/useCajaChicaAuth.ts`**: Lógica movida a `usePermissions`.
- **`AuthContext`**: Reemplazado totalmente por React Query state.
- **Roles Hardcodeados**: Se eliminaron 15 instancias de `user.rol_id === 1`.

### Unificado (Single Source of Truth)

Creamos una única definición de tipos para el usuario en todo el sistema.

**`src/types/auth.ts`**

```typescript
export interface User {
  id_auth_user: number;
  usuario_id: number | null;
  rol_id: number;
  nombre: string;
  email: string;
  id_local: number; // Ahora siempre es obligatorio y consistente
  local_nombre: string;
}
```

### Nuevo: Sistema de Permisos

En lugar de verificar IDs de roles dispersos por los componentes, centralizamos la lógica en hooks semánticos.

**`src/hooks/usePermissions.ts`**

```typescript
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.rol_id === 1,
    isSupervisor: user?.rol_id === 2,
    canManageUsers: [1, 2].includes(user?.rol_id),
    canAccessNominas: user?.rol_id === 1 || (user?.rol_id === 2 && user?.id_local === 1),
  };
};
```

## Impacto

| Métrica              | Antes | Después             |
| -------------------- | ----- | ------------------- |
| Hooks de Auth        | 4     | 1 (`useAuth`)       |
| Definiciones de User | 3     | 1 (`types/auth.ts`) |
| Archivos modificados | -     | 8                   |
| Líneas eliminadas    | -     | ~150                |
| Breaking changes     | -     | 0                   |

## Por qué importa esto

Este refactor no cambió nada visualmente para el usuario. El sistema se ve igual.

Pero para mí, la diferencia es entender mi propio código. Ya no tengo que adivinar "¿cuál hook uso aquí?" ni cruzar los dedos esperando que el ID del admin no cambie.

La deuda técnica fue lo que me permitió entregar rápido cuando más se necesitaba, pero aprender a pagarla es parte de crecer como desarrollador.

Hoy, el sistema es un poco más predecible, y yo entiendo un poco mejor lo que construí.

> "Release early. Release often. And listen to your customers."
>
> — _Linus Torvalds_
