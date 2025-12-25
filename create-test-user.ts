import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!);

async function confirmUser() {
  try {
    // Confirmar el email del usuario
    const result = await sql`
      UPDATE auth.users
      SET email_confirmed_at = NOW(),
          confirmed_at = NOW()
      WHERE email = 'testadmin@gmail.com'
      RETURNING id, email, email_confirmed_at
    `;

    console.log('User confirmed successfully:', result);
  } catch (error) {
    console.error('Error confirming user:', error);
  } finally {
    await sql.end();
  }
}

confirmUser();
