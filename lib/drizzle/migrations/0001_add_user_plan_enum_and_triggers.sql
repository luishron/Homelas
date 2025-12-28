-- ==================================================
-- Migration: Add user_plan ENUM and auth triggers
-- ==================================================
-- Esta migración corrige el esquema de user_profiles
-- y agrega los triggers de autenticación
-- ==================================================

-- 1. Crear el ENUM user_plan
DO $$ BEGIN
  CREATE TYPE "public"."user_plan" AS ENUM ('free', 'pro', 'plus', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Agregar columna email si no existe
DO $$ BEGIN
  ALTER TABLE "public"."user_profiles" ADD COLUMN "email" text;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 3. Migrar role -> plan (si role existe)
DO $$
DECLARE
  has_role boolean;
  has_plan boolean;
BEGIN
  -- Check if role column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'role'
  ) INTO has_role;

  -- Check if plan column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'plan'
  ) INTO has_plan;

  -- If role exists and plan doesn't, migrate
  IF has_role AND NOT has_plan THEN
    -- Rename column
    ALTER TABLE "public"."user_profiles" RENAME COLUMN "role" TO "plan";

    -- Change type to user_plan ENUM
    ALTER TABLE "public"."user_profiles"
    ALTER COLUMN "plan" TYPE "public"."user_plan"
    USING "plan"::text::"public"."user_plan";

    -- Ensure NOT NULL and default
    ALTER TABLE "public"."user_profiles"
    ALTER COLUMN "plan" SET NOT NULL,
    ALTER COLUMN "plan" SET DEFAULT 'free'::"public"."user_plan";

    RAISE NOTICE 'Migrated role column to plan with user_plan type';

  -- If neither exists, add plan column
  ELSIF NOT has_role AND NOT has_plan THEN
    ALTER TABLE "public"."user_profiles"
    ADD COLUMN "plan" "public"."user_plan" NOT NULL DEFAULT 'free'::"public"."user_plan";

    RAISE NOTICE 'Added plan column with user_plan type';

  -- If plan exists, ensure it has correct type
  ELSIF has_plan THEN
    -- Try to alter type (will fail silently if already correct)
    BEGIN
      ALTER TABLE "public"."user_profiles"
      ALTER COLUMN "plan" TYPE "public"."user_plan"
      USING "plan"::text::"public"."user_plan";
    EXCEPTION
      WHEN OTHERS THEN null;
    END;

    RAISE NOTICE 'Plan column already exists';
  END IF;
END $$;

-- 4. Drop old indexes if they exist
DROP INDEX IF EXISTS "public"."idx_user_profiles_role";
DROP INDEX IF EXISTS "public"."idx_user_profiles_onboarding";

-- 5. Create new indexes
CREATE INDEX IF NOT EXISTS "idx_user_profiles_plan" ON "public"."user_profiles" USING btree ("plan");
CREATE INDEX IF NOT EXISTS "idx_user_profiles_email" ON "public"."user_profiles" USING btree ("email");
CREATE INDEX IF NOT EXISTS "idx_user_profiles_onboarding_completed" ON "public"."user_profiles" USING btree ("onboarding_completed");

-- ==================================================
-- 6. Create handle_new_user function
-- ==================================================
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO "public"."user_profiles" (
    "id",
    "email",
    "full_name",
    "plan",
    "created_at",
    "updated_at"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'::"public"."user_plan",
    now(),
    now()
  )
  ON CONFLICT ("id") DO UPDATE SET
    "email" = EXCLUDED."email",
    "full_name" = COALESCE(EXCLUDED."full_name", "user_profiles"."full_name"),
    "updated_at" = now();

  RETURN NEW;
END;
$$;

-- ==================================================
-- 7. Create trigger on auth.users
-- ==================================================
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";

CREATE TRIGGER "on_auth_user_created"
  AFTER INSERT ON "auth"."users"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."handle_new_user"();

-- ==================================================
-- 8. Grant necessary permissions
-- ==================================================
-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "service_role";

-- ==================================================
-- 9. Verification
-- ==================================================
DO $$
DECLARE
  v_enum_exists boolean;
  v_function_exists boolean;
  v_trigger_exists boolean;
  v_plan_column_exists boolean;
  v_email_column_exists boolean;
  v_plan_column_type text;
BEGIN
  -- Check ENUM
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_plan'
  ) INTO v_enum_exists;

  -- Check function
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user'
  ) INTO v_function_exists;

  -- Check trigger
  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_schema = 'auth'
    AND event_object_table = 'users'
    AND trigger_name = 'on_auth_user_created'
  ) INTO v_trigger_exists;

  -- Check plan column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'plan'
  ) INTO v_plan_column_exists;

  -- Check plan column type
  SELECT data_type INTO v_plan_column_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'plan';

  -- Check email column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'email'
  ) INTO v_email_column_exists;

  -- Log results
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION VERIFICATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ENUM user_plan exists: %', v_enum_exists;
  RAISE NOTICE 'Function handle_new_user exists: %', v_function_exists;
  RAISE NOTICE 'Trigger on_auth_user_created exists: %', v_trigger_exists;
  RAISE NOTICE 'Column user_profiles.plan exists: %', v_plan_column_exists;
  RAISE NOTICE 'Column user_profiles.plan type: %', v_plan_column_type;
  RAISE NOTICE 'Column user_profiles.email exists: %', v_email_column_exists;
  RAISE NOTICE '========================================';

  IF v_enum_exists AND v_function_exists AND v_trigger_exists
     AND v_plan_column_exists AND v_email_column_exists
     AND v_plan_column_type = 'USER-DEFINED' THEN
    RAISE NOTICE '✅ Migration completed successfully';
  ELSE
    RAISE WARNING '⚠️  Migration may have issues - please verify manually';
  END IF;
END $$;
