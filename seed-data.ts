import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function seedData() {
  // Obtener el usuario admin
  const { data: { user } } = await supabase.auth.signInWithPassword({
    email: 'admin@test.local',
    password: 'admin123',
  });

  if (!user) {
    console.error('No se pudo iniciar sesión');
    return;
  }

  console.log('Usuario autenticado:', user.id);

  // Crear categorías adicionales
  const categories = [
    { name: 'Transporte', icon: '🚗', color: '#3b82f6' }, // azul
    { name: 'Vivienda', icon: '🏠', color: '#8b5cf6' }, // púrpura
    { name: 'Entretenimiento', icon: '🎬', color: '#f59e0b' }, // naranja
    { name: 'Salud', icon: '💊', color: '#ef4444' }, // rojo
  ];

  for (const cat of categories) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        user_id: user.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
      }])
      .select();

    if (error) {
      console.error(`Error creando categoría ${cat.name}:`, error);
    } else {
      console.log(`✓ Categoría creada: ${cat.name}`);
    }
  }

  // Crear métodos de pago
  const paymentMethods = [
    { name: 'Tarjeta Crédito', type: 'tarjeta_credito', color: '#3b82f6', is_default: true },
    { name: 'Efectivo', type: 'efectivo', color: '#10b981', is_default: false },
    { name: 'Tarjeta Débito', type: 'tarjeta_debito', color: '#8b5cf6', is_default: false },
  ];

  for (const pm of paymentMethods) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{
        user_id: user.id,
        name: pm.name,
        type: pm.type,
        color: pm.color,
        is_default: pm.is_default,
      }])
      .select();

    if (error) {
      console.error(`Error creando método de pago ${pm.name}:`, error);
    } else {
      console.log(`✓ Método de pago creado: ${pm.name}`);
    }
  }

  // Obtener las categorías y métodos de pago creados
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id);

  const { data: allPaymentMethods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id);

  if (!allCategories || !allPaymentMethods || allPaymentMethods.length === 0) {
    console.error('No se pudieron obtener categorías o métodos de pago');
    return;
  }

  // Crear gastos de ejemplo
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const expenses = [
    // Gastos del mes actual
    { category: 'Alimentos', amount: 45.50, description: 'Supermercado', days_ago: 2, status: 'pagado' },
    { category: 'Alimentos', amount: 25.00, description: 'Restaurante', days_ago: 5, status: 'pagado' },
    { category: 'Transporte', amount: 60.00, description: 'Gasolina', days_ago: 3, status: 'pagado' },
    { category: 'Transporte', amount: 15.00, description: 'Uber', days_ago: 1, status: 'pagado' },
    { category: 'Vivienda', amount: 800.00, description: 'Renta', days_ago: 10, status: 'pagado' },
    { category: 'Vivienda', amount: 120.00, description: 'Electricidad', days_ago: 8, status: 'pagado' },
    { category: 'Entretenimiento', amount: 35.00, description: 'Netflix', days_ago: 15, status: 'pagado' },
    { category: 'Entretenimiento', amount: 50.00, description: 'Cine', days_ago: 7, status: 'pagado' },
    { category: 'Salud', amount: 80.00, description: 'Farmacia', days_ago: 4, status: 'pagado' },

    // Gastos pendientes
    { category: 'Alimentos', amount: 100.00, description: 'Compra semanal', days_ago: -2, status: 'pendiente' },
    { category: 'Transporte', amount: 50.00, description: 'Mantenimiento auto', days_ago: -5, status: 'pendiente' },
  ];

  for (const exp of expenses) {
    const category = allCategories.find(c => c.name === exp.category);
    if (!category) continue;

    const expenseDate = new Date(now);
    expenseDate.setDate(expenseDate.getDate() - exp.days_ago);

    const { data, error} = await supabase
      .from('expenses')
      .insert([{
        user_id: user.id,
        category_id: category.id,
        amount: exp.amount.toString(),
        description: exp.description,
        date: expenseDate.toISOString().split('T')[0],
        payment_status: exp.status,
      }])
      .select();

    if (error) {
      console.error(`Error creando gasto ${exp.description}:`, error);
    } else {
      console.log(`✓ Gasto creado: ${exp.description} - $${exp.amount}`);
    }
  }

  // Crear algunos ingresos
  const incomes = [
    { amount: 3000.00, description: 'Salario', days_ago: 15 },
    { amount: 500.00, description: 'Freelance', days_ago: 8 },
  ];

  for (const inc of incomes) {
    const incomeDate = new Date(now);
    incomeDate.setDate(incomeDate.getDate() - inc.days_ago);

    const { data, error } = await supabase
      .from('incomes')
      .insert([{
        user_id: user.id,
        source: inc.description,
        amount: inc.amount.toString(),
        description: inc.description,
        date: incomeDate.toISOString().split('T')[0],
      }])
      .select();

    if (error) {
      console.error(`Error creando ingreso ${inc.description}:`, error);
    } else {
      console.log(`✓ Ingreso creado: ${inc.description} - $${inc.amount}`);
    }
  }

  console.log('\n✅ Datos de prueba creados exitosamente');
}

seedData();
