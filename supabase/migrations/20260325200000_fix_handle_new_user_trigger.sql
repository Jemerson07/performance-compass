/*
  # Correção da trigger handle_new_user

  Atualiza a função `handle_new_user` para:
  1. Aceitar metadados adicionais como `job_title` e `avatar` do signup
  2. Tratar erros de duplicação de forma segura com ON CONFLICT
  3. Garantir que o papel (role) seja sempre criado corretamente
*/

-- Atualiza a função handle_new_user para aceitar metadados adicionais
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role public.app_role;
BEGIN
  -- Determina o papel com fallback seguro
  BEGIN
    v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'employee');
  EXCEPTION WHEN invalid_text_representation THEN
    v_role := 'employee';
  END;

  -- Insere perfil com dados extras (job_title, avatar) se fornecidos
  INSERT INTO public.profiles (user_id, name, job_title, avatar)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), NEW.email),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'job_title', '')), ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'avatar', ''), '👤')
  )
  ON CONFLICT (user_id) DO UPDATE
    SET
      name = EXCLUDED.name,
      job_title = COALESCE(EXCLUDED.job_title, profiles.job_title),
      avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
      updated_at = now();

  -- Insere registro de employee
  INSERT INTO public.employees (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Insere papel do usuário
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Garante que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Adiciona política de INSERT em employees para o trigger (SECURITY DEFINER já cuida disso,
-- mas garantimos que não há bloqueio de RLS para o service role)
DO $$
BEGIN
  -- Adiciona política de insert para employees caso não exista
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'employees' AND policyname = 'Service role can insert employees'
  ) THEN
    EXECUTE 'CREATE POLICY "Service role can insert employees" ON public.employees FOR INSERT TO service_role WITH CHECK (true)';
  END IF;
END $$;
