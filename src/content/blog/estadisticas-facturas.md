---
title: "De 97% de Errores a 99% de Precisión: La Historia Que Descubrí Buscando Estadísticas de Cheques"
description: "De query simple a arqueología de datos: cómo descubrí la historia completa de nuestro sistema de facturas mediante análisis SQL."
pubDate: 2026-02-05
tags: ["postgresql", "data-analysis", "sql", "learning"]
author: "Nande"
role: "Fullstack Developer"
readTime: "8 min"
draft: false
---

Me pidieron sacar estadísticas de cuánto gastábamos en facturas pagadas con cheque. Pensé que sería una query rápida y ya. Lo que no esperaba era terminar haciendo arqueología de datos y descubrir toda la historia de cómo evolucionó nuestro sistema de facturas.

## El Bug Que No Era Bug

Empecé explorando la tabla:

```sql
SELECT COUNT(*) FROM facturas WHERE monto != null;
-- 0 filas
```

Esperaba miles de registros, pero obtuve cero. Pensé que había un bug. Spoiler: el bug era mi query.

En PostgreSQL, NULL es especial. No puedes compararlo con operadores normales:

```sql
-- Incorrecto
WHERE monto != null

-- Correcto  
WHERE monto IS NOT NULL
```

Una vez corregido:

```sql
SELECT COUNT(*) FROM facturas WHERE monto = 0.00;
-- 2,158 facturas

SELECT COUNT(*) FROM facturas WHERE monto > 0;
-- 4,549 facturas
```

32% de las facturas tenían monto en cero. Me dio curiosidad entender por qué.

## Rastreando el Origen

Busqué la primera factura con monto:

```sql
SELECT id, folio, monto, created_at, nombre_proveedor
FROM facturas 
WHERE monto > 0 
ORDER BY created_at ASC 
LIMIT 1;

-- ID: 2, Monto: $1.00, Fecha: 2025-04-29 18:42:18
```

Había un gap de 30 días hasta la siguiente:

```sql
-- ID: 733, Monto: $117,930, Fecha: 2025-05-29 17:53:50
```

La primera era claramente una prueba. La implementación real comenzó el 29 de mayo de 2025.

## La Curva Que No Esperaba Ver

Aquí es donde se puso interesante. Decidí ver cómo había evolucionado esto mes a mes:

```sql
SELECT 
    DATE_TRUNC('month', created_at) as mes,
    COUNT(*) as total,
    COUNT(CASE WHEN monto = 0 THEN 1 END) as sin_monto,
    ROUND(100.0 * COUNT(CASE WHEN monto = 0 THEN 1 END) / COUNT(*), 2) as error_rate
FROM facturas
WHERE id_proveedor IS NOT NULL
AND created_at >= '2025-05-29'
GROUP BY DATE_TRUNC('month', created_at);
```

Los números me sorprendieron:

| Mes    | Total | Sin Monto | Error Rate | Mejora   |
| ------ | ----- | --------- | ---------- | -------- |
| May-25 | 90    | 87        | 96.67%     | -        |
| Jun-25 | 629   | 597       | 94.91%     | -1.76pp  |
| Jul-25 | 709   | 521       | 73.48%     | -21.43pp |
| Aug-25 | 670   | 149       | 22.24%     | -51.24pp |
| Sep-25 | 632   | 9         | 1.42%      | -20.82pp |
| Oct-25 | 804   | 28        | 3.48%      | +2.06pp  |
| Nov-25 | 654   | 13        | 1.99%      | -1.49pp  |
| Dec-25 | 745   | 18        | 2.42%      | +0.43pp  |
| Jan-26 | 834   | 14        | 1.68%      | -0.74pp  |
| Feb-26 | 107   | 1         | 0.93%      | -0.75pp  |

De 96.67% a 0.93% de error en 9 meses.

Pero cuando revisé los detalles por local, todo cobró sentido:

### Mayo - Julio: Solo La Cantera (96% → 73%)

Durante estos tres meses, solo nosotros en La Cantera estábamos usando el sistema completo. Los otros locales subían facturas, sí, pero no configuraban montos.

No era que fueran perezosos o nada, simplemente el sistema estaba en desarrollo. Nosotros lo estábamos probando en vivo, iterando, rompiendo cosas, aprendiendo sobre la marcha.

El 96% de error no era fracaso, era experimentación. Para julio ya estábamos en 73%, lo cual considerando que partimos de cero sin manual ni nada, no estaba tan mal.

### Agosto: El Lanzamiento Real (73% → 22%)

Agosto fue cuando implementamos el sistema completo en su primera versión para todos los locales. La caída de 51 puntos porcentuales tiene sentido ahora: los otros locales entraron con un sistema que ya había sido probado por 3 meses en La Cantera.

No entraron a ciegas. Entraron a algo que ya sabíamos que funcionaba (más o menos).

### Septiembre: Cuando Todos Se Adaptaron (22% → 1.4%)

Este mes me impresiona. Una mejora de 20 puntos porcentuales de golpe.

No implementé validaciones nuevas ni nada especial. El equipo simplemente entendió el sistema. Ya no era "la cosa nueva", era la forma estándar de trabajar.

### Octubre en adelante: Estabilización (<3%)

Los tres locales operando consistentemente bajo 3.5% de error. El sistema se volvió parte del día a día.

Lo que me sorprende es que básicamente el equipo aprendió solo. Solo construimos algo que tenía sentido y ellos se adaptaron.

## El Campo Fantasma

Durante la investigación encontré algo medio vergonzoso. Teníamos DOS campos para proveedor:

- `nombre_proveedor` (VARCHAR)
- `id_proveedor` (FK)

```sql
SELECT 
    DATE_TRUNC('month', created_at) as mes,
    COUNT(CASE WHEN nombre_proveedor IS NOT NULL AND nombre_proveedor != '' THEN 1 END) as con_nombre,
    COUNT(CASE WHEN id_proveedor IS NOT NULL THEN 1 END) as con_id
FROM facturas
GROUP BY mes;
```

| Mes    | Con Nombre | Con ID |
| ------ | ---------- | ------ |
| May-25 | 750        | 772    |
| Jun-25 | 612        | 629    |
| Jul-25 | 563        | 709    |
| Aug-25 | 0          | 670    |

En agosto, `nombre_proveedor` desapareció. Sin migracion, sin documentación, nada.

La verdad es que siempre supe que `id_proveedor` como FK era lo correcto. Pero en ese momento, optimicé para la velocidad de iteración, no para la pureza del esquema. Y funcionó para validar la idea.

La lección no es "nunca hagas esto", sino "sé consciente de cuándo lo estás haciendo". El **vibe coding** es genial para descubrir *qué* construir, pero el planning es obligatorio para mantenerlo vivo. Ese campo fantasma es el impuesto que pagué por moverme rápido en mayo.

## El Misterio del Usuario 10

Revisando por usuario encontré algo curioso:

```sql
SELECT 
    id_usuario,
    COUNT(*) as total,
    COUNT(CASE WHEN monto = 0 THEN 1 END) as errores,
    ROUND(100.0 * COUNT(CASE WHEN monto = 0 THEN 1 END) / COUNT(*), 2) as error_rate
FROM facturas
WHERE id_proveedor IS NOT NULL
AND created_at >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY id_usuario
ORDER BY errores DESC;
```

Usuario 10: 15 facturas, 15 sin monto. 100% de error. Todas en un período corto, y después nada. No volvió a subir facturas.

La pregunta que me hago inmediatamente es: **¿Por qué el sistema falló en comunicar cómo usarse?**

Es fácil construir para La Cantera porque estoy aquí. Soy el manual de usuario viviente. Pero cuando el código viaja a otro local sin mí, debe defenderse solo. Si la interfaz no es clara o el flujo tiene fricción, es probable que el usuario simplemente abandone la herramienta.

Esto me deja planteada una gran incógnita. Me gustaría que mis desarrollos se adopten en todos los locales, pero claramente hay una barrera que no es solo de código. ¿Cómo logro transmitir la "cultura" del sistema sin estar ahí? Honestamente, es un desafío de escalabilidad humana que aún no sé cómo voy a resolver.

## Lo Que Aprendí

### 1. Los equipos se adaptan si les das tiempo

La curva de mejora no fue por validaciones estrictas ni nada que yo haya forzado. Fue gente usando el sistema, entendiéndolo, y mejorando con el tiempo. A veces lo mejor es construir algo claro y dejar que el equipo se adapte.

### 2. Construir para otros es más difícil que construir para ti

En La Cantera puedo iterar rápido porque estoy ahí. Veo problemas, hablo con la gente, arreglo en tiempo real. En otros locales no estoy. No sé qué pasó con esas 15 facturas. No sé si fue UX, capacitación, o simplemente que no les hizo sentido.

Extender lo que creo requiere más que código. Requiere documentación, comunicación, y estar disponible. Y sinceramente, me cuesta.

### 3. Los datos cuentan historias

Esta tabla almacena facturas, pero también cuenta:

- El experimento de mayo-julio
- El lanzamiento de agosto
- La adopción de septiembre
- El misterio del Usuario 10
- Mi evolución del vibe coding al planning

El código muestra lo que quisiste hacer. Los datos muestran lo que realmente pasó.

## Conclusión

Vine a buscar estadísticas de cheques y me quedé con la historia completa del sistema.

Descubrí que pasamos de 96% de error a 99% de precisión en 9 meses. Que cada fase (experimentación, lanzamiento, adopción) dejó una huella digital en los datos.

Pero sobre todo, confirmé que los equipos tienen su propia curva de madurez. Mi rol no es solo tirar código, sino dar el tiempo y las herramientas para que esa curva suceda. A veces, la mejor validación es simplemente dejar que el sistema ruede y observar.

Si una simple query puede contar todo esto, quizás debería empezar a "escuchar" a mi base de datos más seguido.
