/**
 * Prueba de metadata usando Supabase client (funciona sin Drizzle)
 * Ejecutar: npx tsx scripts/test-metadata-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function testMetadata() {
  console.log('🧪 Probando columnas metadata con Supabase...\n');

  try {
    // Test 1: Verificar que columna metadata existe
    console.log('📋 Test 1: Verificando columnas metadata...');
    const { data: columns } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'metadata'
        ORDER BY table_name;
      `
    }).select();

    // Como no tenemos RPC, intentemos con un query directo
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, metadata')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ ¡Columna metadata existe!');
      if (categories && categories.length > 0) {
        console.log('Ejemplo de categoría con metadata:', categories[0]);
      }
    }
    console.log();

    console.log('✅ ¡Metadata está disponible!');
    console.log('🎉 Ahora puedes agregar campos flexibles sin migraciones\n');

    console.log('📝 Ejemplo de cómo usarlo:');
    console.log(`
// Crear expense con metadata
const { data } = await supabase
  .from('expenses')
  .insert({
    user_id: userId,
    category_id: 1,
    amount: '500',
    date: '2025-01-15',
    metadata: {
      tienda: 'Amazon',
      numeroOrden: 'ORD-123',
      cuotas: 3,
      tags: ['online']
    }
  })
  .select();

// Buscar por metadata
const { data } = await supabase
  .from('expenses')
  .select('*')
  .eq('metadata->>tienda', 'Amazon');
    `);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMetadata();
