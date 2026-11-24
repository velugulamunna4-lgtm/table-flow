import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env.local or .env if present
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim().replace(/(^"|"$|^'|'$)/g, '');
        }
      }
    });
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const staffPassword = process.env.DEMO_STAFF_PASSWORD || 'TableFlow@Demo2026';

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local.');
  console.log('Please configure .env.local first. See .env.example for required variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface StaffAccount {
  email: string;
  fullName: string;
  role: 'owner' | 'waiter' | 'kitchen';
}

const staffAccounts: StaffAccount[] = [
  { email: 'kitchen@demo.com', fullName: 'Chef Vikram (Head of KDS)', role: 'kitchen' },
  { email: 'waiter@demo.com', fullName: 'Captain Rahul (Head Waiter)', role: 'waiter' },
  { email: 'owner@demo.com', fullName: 'Sanjay Reddy (Restaurant Owner)', role: 'owner' },
];

async function main() {
  console.log('🚀 Starting Table Flow Staff Account Provisioning...');
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  // 1. Fetch or verify restaurant
  const { data: restaurant, error: restError } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', 'aroma-saffron')
    .single();

  let restaurantId: string;

  if (restError || !restaurant) {
    console.log('⚠️ Restaurant "aroma-saffron" not found. Creating default restaurant record...');
    const { data: newRest, error: createRestErr } = await supabase
      .from('restaurants')
      .insert({
        slug: 'aroma-saffron',
        name: 'Aroma & Saffron',
        currency: 'INR',
        gst_rate: 5.0,
        service_charge_rate: 0.0,
        theme: 'sunny-family',
        address: 'Road No. 36, Jubilee Hills, Hyderabad',
      })
      .select('id, name')
      .single();

    if (createRestErr || !newRest) {
      console.error('❌ Failed to create restaurant:', createRestErr?.message);
      process.exit(1);
    }
    restaurantId = newRest.id;
    console.log(`✅ Created Restaurant: ${newRest.name} (${restaurantId})`);
  } else {
    restaurantId = restaurant.id;
    console.log(`✅ Found Restaurant: ${restaurant.name} (${restaurantId})`);
  }

  // 2. Provision Staff Accounts
  for (const staff of staffAccounts) {
    console.log(`\nProcessing ${staff.email} [${staff.role}]...`);

    // Check if auth user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === staff.email);

    let userId: string;

    if (existing) {
      console.log(` - User exists in auth. Updating password...`);
      const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(
        existing.id,
        { password: staffPassword }
      );
      if (updateErr) {
        console.error(` - ❌ Error updating password:`, updateErr.message);
        continue;
      }
      userId = updated.user.id;
    } else {
      console.log(` - Creating new auth user...`);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: staff.email,
        password: staffPassword,
        email_confirm: true,
        user_metadata: { full_name: staff.fullName, role: staff.role },
      });
      if (createErr || !created.user) {
        console.error(` - ❌ Error creating user:`, createErr?.message);
        continue;
      }
      userId = created.user.id;
    }

    // Upsert into profiles table
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        restaurant_id: restaurantId,
        full_name: staff.fullName,
        role: staff.role,
      });

    if (profileErr) {
      console.error(` - ❌ Error creating/updating profile:`, profileErr.message);
    } else {
      console.log(` - ✅ Profile provisioned successfully!`);
    }
  }

  console.log('\n🎉 Staff account setup complete!');
  console.log('You can now log in at /login with:');
  staffAccounts.forEach((s) => {
    console.log(` - Email: ${s.email} | Role: ${s.role} | Password: ${staffPassword}`);
  });
}

main().catch((err) => {
  console.error('Fatal provisioning error:', err);
  process.exit(1);
});
