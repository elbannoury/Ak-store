import { supabase } from '@/lib/supabaseClient';

const BUCKET_NAME = 'product-images';

/**
 * رفع صورة إلى Supabase Storage
 * @param file - ملف الصورة
 * @param productId - معرف المنتج (اختياري)
 * @returns رابط الصورة العام
 */
export const uploadProductImage = async (file: File, productId?: string): Promise<string> => {
  try {
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // التحقق من حجم الملف (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId || 'product'}-${timestamp}-${randomString}.${fileExtension}`;

    // رفع الملف إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`products/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // الحصول على الرابط العام للصورة
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`products/${fileName}`);

    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

/**
 * حذف صورة من Supabase Storage
 * @param imageUrl - رابط الصورة
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // استخراج اسم الملف من الرابط
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`products/${fileName}`]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Image delete error:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};
