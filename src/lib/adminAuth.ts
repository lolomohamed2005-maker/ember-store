import { supabase } from './supabase'

const ADMIN_EMAIL_DOMAIN = 'ember-admin.com'

export function phoneToEmail(phone: string) {
  return `${phone.replace(/\D/g, '')}@${ADMIN_EMAIL_DOMAIN}`
}

export async function signInAdminWithPhone(phone: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: phoneToEmail(phone),
    password,
  })
  return { error: error?.message ?? null }
}

export async function signUpAdminWithPhone(phone: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email: phoneToEmail(phone),
    password,
  })
  return { error: error?.message ?? null }
}
