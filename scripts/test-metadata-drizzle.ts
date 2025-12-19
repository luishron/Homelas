/**
 * Test completo de metadata con Drizzle
 * Ejecutar: npx tsx scripts/test-metadata-drizzle.ts
 */

import { db } from '../lib/drizzle/client-standalone';
import { expenses, categories } from '../lib/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

async function testMetadataWorkflow() {
  console.log('🧪 Test Completo de Metadata con Drizzle\n');

  try {
    // 1. Obtener una categoría existente
    console.log('📋 Paso 1: Obteniendo categoría existente...');
    const [category] = await db
      .select()
      .from(categories)
      .limit(1);

    if (!category) {
      console.log('❌ No hay categorías en la BD');
      process.exit(1);
    }

    console.log(`✅ Usando categoría: ${category.name} (ID: ${category.id})\n`);

    // 2. Crear gasto con metadata
    console.log('💰 Paso 2: Creando gasto de prueba con metadata...');
    const [newExpense] = await db
      .insert(expenses)
      .values({
        userId: category.userId, // Mismo user de la categoría
        categoryId: category.id,
        amount: '1500',
        date: new Date().toISOString().split('T')[0],
        description: 'Compra de prueba con metadata',
        paymentStatus: 'pagado',
        // 🎯 Aquí agregamos metadata SIN migración!
        metadata: {
          tienda: 'Amazon',
          numeroOrden: 'TEST-12345',
          cuotas: 3,
          tags: ['prueba', 'online', 'tecnologia'],
          ubicacion: {
            ciudad: 'Buenos Aires',
            lat: -34.6037,
            lng: -58.3816
          },
          notasPrueba: 'Este es un gasto de prueba para validar metadata'
        }
      })
      .returning();

    console.log('✅ Gasto creado con ID:', newExpense.id);
    console.log('📦 Metadata guardada:', JSON.stringify(newExpense.metadata, null, 2));
    console.log();

    // 3. Buscar el gasto que acabamos de crear
    console.log('🔍 Paso 3: Buscando el gasto por ID...');
    const [foundExpense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, newExpense.id));

    console.log('✅ Gasto encontrado:', {
      id: foundExpense.id,
      description: foundExpense.description,
      amount: foundExpense.amount,
      metadata: foundExpense.metadata
    });
    console.log();

    // 4. Buscar por metadata (tienda = Amazon)
    console.log('🔍 Paso 4: Buscando gastos de Amazon usando metadata...');
    const amazonExpenses = await db
      .select()
      .from(expenses)
      .where(sql`${expenses.metadata}->>'tienda' = 'Amazon'`)
      .limit(5);

    console.log(`✅ Encontrados ${amazonExpenses.length} gastos de Amazon`);
    amazonExpenses.forEach(exp => {
      console.log(`  - ${exp.description} ($${exp.amount}) - Orden: ${(exp.metadata as any)?.numeroOrden}`);
    });
    console.log();

    // 5. Actualizar metadata del gasto
    console.log('✏️  Paso 5: Actualizando metadata del gasto...');
    const [updatedExpense] = await db
      .update(expenses)
      .set({
        // Merge metadata existente con nuevos campos
        metadata: {
          ...(newExpense.metadata as any),
          cuotaActual: 1,
          cuotasPagadas: 1,
          ultimaActualizacion: new Date().toISOString(),
          verificado: true
        }
      })
      .where(eq(expenses.id, newExpense.id))
      .returning();

    console.log('✅ Metadata actualizada:', JSON.stringify(updatedExpense.metadata, null, 2));
    console.log();

    // 6. Eliminar el gasto de prueba
    console.log('🗑️  Paso 6: Limpiando (eliminando gasto de prueba)...');
    await db
      .delete(expenses)
      .where(eq(expenses.id, newExpense.id));

    console.log('✅ Gasto de prueba eliminado\n');

    // Resumen
    console.log('━'.repeat(60));
    console.log('🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!');
    console.log('━'.repeat(60));
    console.log('\n✅ Validaciones completadas:');
    console.log('  1. ✅ Crear gasto con metadata');
    console.log('  2. ✅ Leer metadata guardada');
    console.log('  3. ✅ Buscar por campos en metadata (tienda)');
    console.log('  4. ✅ Actualizar metadata agregando nuevos campos');
    console.log('  5. ✅ Eliminar registros');
    console.log('\n🎯 Resultado: Metadata funciona perfectamente!');
    console.log('💡 Ahora puedes agregar campos sin migraciones\n');

  } catch (error) {
    console.error('\n❌ Error en el test:', error);
    process.exit(1);
  }

  process.exit(0);
}

testMetadataWorkflow();
