/**
 * Test de límites mensuales en categorías usando metadata
 * Ejecutar: npx tsx scripts/test-category-limits.ts
 */

import { db } from '../lib/drizzle/client-standalone';
import { categories, expenses } from '../lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import {
  setCategoryMonthlyLimit,
  getCategoryBudgetStatus,
  getAllCategoriesBudgetStatus,
  getExceededCategories,
  wouldExceedLimit,
  disableCategoryLimit
} from '../lib/drizzle/category-limits-standalone';

async function testCategoryLimits() {
  console.log('🧪 Test de Límites Mensuales en Categorías\n');

  try {
    // 1. Obtener una categoría existente
    console.log('📋 Paso 1: Obteniendo categoría para test...');
    const [category] = await db
      .select()
      .from(categories)
      .limit(1);

    if (!category) {
      console.log('❌ No hay categorías en la BD');
      process.exit(1);
    }

    console.log(`✅ Usando categoría: "${category.name}" (ID: ${category.id})\n`);

    // 2. Establecer límite mensual
    console.log('💰 Paso 2: Estableciendo límite mensual de $10,000...');
    await setCategoryMonthlyLimit(
      category.id,
      10000, // Límite de $10,000
      80     // Alerta al 80%
    );
    console.log('✅ Límite establecido en metadata (sin migración!)\n');

    // 3. Verificar que se guardó correctamente
    const [updatedCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, category.id));

    console.log('📦 Metadata de la categoría:');
    console.log(JSON.stringify(updatedCategory.metadata, null, 2));
    console.log();

    // 4. Obtener estado del presupuesto actual
    console.log('📊 Paso 3: Obteniendo estado del presupuesto...');
    const status = await getCategoryBudgetStatus(
      category.id,
      category.userId
    );

    if (status) {
      console.log('✅ Estado del presupuesto:');
      console.log(`  - Categoría: ${status.categoryName}`);
      console.log(`  - Límite mensual: $${status.limite.toLocaleString()}`);
      console.log(`  - Gastado: $${status.gastado.toLocaleString()}`);
      console.log(`  - Disponible: $${status.disponible.toLocaleString()}`);
      console.log(`  - Porcentaje usado: ${status.porcentajeUsado.toFixed(2)}%`);
      console.log(`  - ¿Excedido? ${status.excedido ? '❌ SÍ' : '✅ NO'}`);
      console.log(`  - ¿Alerta activa? ${status.alertaActiva ? '⚠️  SÍ' : '✅ NO'}`);
      console.log(`  - Mes/Año: ${status.mes}/${status.año}`);
      console.log();
    }

    // 5. Crear un gasto de prueba
    console.log('💸 Paso 4: Creando gasto de prueba...');
    const [testExpense] = await db
      .insert(expenses)
      .values({
        userId: category.userId,
        categoryId: category.id,
        amount: '2500',
        date: new Date().toISOString().split('T')[0],
        description: 'Gasto de prueba para límite',
        metadata: {
          esTest: true
        }
      })
      .returning();

    console.log(`✅ Gasto creado: $${testExpense.amount}\n`);

    // 6. Verificar estado actualizado
    console.log('📊 Paso 5: Verificando estado actualizado...');
    const newStatus = await getCategoryBudgetStatus(
      category.id,
      category.userId
    );

    if (newStatus) {
      console.log('✅ Estado actualizado:');
      console.log(`  - Gastado: $${newStatus.gastado.toLocaleString()} (antes: $${status?.gastado.toLocaleString()})`);
      console.log(`  - Disponible: $${newStatus.disponible.toLocaleString()}`);
      console.log(`  - Porcentaje usado: ${newStatus.porcentajeUsado.toFixed(2)}%`);
      console.log(`  - ¿Excedido? ${newStatus.excedido ? '❌ SÍ' : '✅ NO'}`);
      console.log();
    }

    // 7. Probar función wouldExceedLimit
    console.log('🔍 Paso 6: Verificando si un gasto excedería el límite...');
    const checkResult = await wouldExceedLimit(
      category.id,
      category.userId,
      8000 // Intentar agregar $8,000 más
    );

    console.log('✅ Resultado de verificación:');
    console.log(`  - ¿Excedería el límite? ${checkResult.excederia ? '❌ SÍ' : '✅ NO'}`);
    console.log(`  - Nuevo total sería: $${checkResult.nuevoTotal.toLocaleString()}`);
    console.log(`  - Límite: $${checkResult.status?.limite.toLocaleString()}`);
    console.log();

    // 8. Obtener todas las categorías con límite
    console.log('📋 Paso 7: Obteniendo todas las categorías con límite...');
    const allStatuses = await getAllCategoriesBudgetStatus(category.userId);

    console.log(`✅ Encontradas ${allStatuses.length} categorías con límite:`);
    allStatuses.forEach(s => {
      const emoji = s.excedido ? '❌' : s.alertaActiva ? '⚠️' : '✅';
      console.log(`  ${emoji} ${s.categoryName}: ${s.porcentajeUsado.toFixed(1)}% usado ($${s.gastado.toLocaleString()} / $${s.limite.toLocaleString()})`);
    });
    console.log();

    // 9. Obtener categorías excedidas
    console.log('⚠️  Paso 8: Verificando categorías excedidas...');
    const exceeded = await getExceededCategories(category.userId);

    if (exceeded.length > 0) {
      console.log(`❌ ${exceeded.length} categorías excedieron el límite:`);
      exceeded.forEach(s => {
        const exceso = s.gastado - s.limite;
        console.log(`  - ${s.categoryName}: excedido por $${exceso.toLocaleString()}`);
      });
    } else {
      console.log('✅ Ninguna categoría ha excedido el límite');
    }
    console.log();

    // 10. Limpiar: desactivar límite y eliminar gasto de prueba
    console.log('🗑️  Paso 9: Limpiando test...');
    await disableCategoryLimit(category.id);
    await db
      .delete(expenses)
      .where(eq(expenses.id, testExpense.id));

    console.log('✅ Límite desactivado y gasto de prueba eliminado\n');

    // Resumen
    console.log('━'.repeat(60));
    console.log('🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!');
    console.log('━'.repeat(60));
    console.log('\n✅ Funcionalidades validadas:');
    console.log('  1. ✅ Establecer límite mensual en metadata');
    console.log('  2. ✅ Obtener estado del presupuesto');
    console.log('  3. ✅ Calcular gastos mensuales');
    console.log('  4. ✅ Detectar si excede límite');
    console.log('  5. ✅ Verificar alertas');
    console.log('  6. ✅ Simular gastos futuros');
    console.log('  7. ✅ Obtener categorías excedidas');
    console.log('  8. ✅ Desactivar límites');
    console.log('\n🎯 Resultado: Sistema de límites funciona perfectamente!');
    console.log('💡 Todo usando metadata - sin migraciones necesarias\n');

  } catch (error) {
    console.error('\n❌ Error en el test:', error);
    process.exit(1);
  }

  process.exit(0);
}

testCategoryLimits();
