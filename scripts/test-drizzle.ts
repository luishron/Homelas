/**
 * Script de prueba para verificar que Drizzle funciona correctamente
 *
 * Ejecutar con: npx tsx scripts/test-drizzle.ts
 */

import { db } from '../lib/drizzle/client-standalone';
import { expenses, categories } from '../lib/drizzle/schema';

async function testDrizzle() {
  console.log('🧪 Probando conexión de Drizzle...\n');

  try {
    // Test 1: Obtener todas las categorías
    console.log('📋 Test 1: Obtener categorías...');
    const allCategories = await db.select().from(categories).limit(5);
    console.log(`✅ Encontradas ${allCategories.length} categorías`);
    if (allCategories.length > 0) {
      console.log('Primera categoría:', {
        id: allCategories[0].id,
        name: allCategories[0].name,
        metadata: allCategories[0].metadata
      });
    }
    console.log();

    // Test 2: Obtener gastos
    console.log('💰 Test 2: Obtener gastos...');
    const allExpenses = await db.select().from(expenses).limit(5);
    console.log(`✅ Encontrados ${allExpenses.length} gastos`);
    if (allExpenses.length > 0) {
      console.log('Primer gasto:', {
        id: allExpenses[0].id,
        amount: allExpenses[0].amount,
        description: allExpenses[0].description,
        metadata: allExpenses[0].metadata
      });
    }
    console.log();

    // Test 3: Contar registros
    console.log('🔢 Test 3: Contar registros totales...');
    const expenseCount = await db.select().from(expenses);
    const categoryCount = await db.select().from(categories);
    console.log(`✅ Total gastos: ${expenseCount.length}`);
    console.log(`✅ Total categorías: ${categoryCount.length}`);
    console.log();

    console.log('✅ ¡Todos los tests pasaron exitosamente!');
    console.log('🎉 Drizzle está funcionando correctamente\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

testDrizzle();
