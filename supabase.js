import { createClient } from '@supabase/supabase-js';

// Орчны хувьсагч (env) эсвэл шууд оруулсан утгыг ашиглана
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xoqawpnlqpngfrdukdbg.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_Dhg9B1R6FpQtgqfcYUynMw_GC8UuT5f';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Захиалга үүсгэх
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      code: orderData.code,
      name: orderData.name,
      birth_date: orderData.birthDate,
      gender: orderData.gender,
      phone: orderData.phone,
      email: orderData.email || null,
      status: 'pending'
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Захиалгын статус шалгах (хэрэглэгч хэрэглэдэг)
export const checkOrderStatus = async (code) => {
  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('code', code)
    .single();
  if (error) return null;
  return data?.status;
};

// Бүх хүлээгдэж буй захиалга авах (админ хэрэглэдэг)
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Захиалгыг зөвшөөрөх (админ хэрэглэдэг)
export const approveOrder = async (code) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('code', code)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Захиалгыг устгах (админ хэрэглэдэг)
export const deleteOrder = async (code) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('code', code);
  if (error) throw error;
  return true;
};
