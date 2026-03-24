import * as productsDal from '@/dal/products'

export async function getUserProducts(userId: string) {
  return productsDal.getProductsByUserId(userId)
}

export async function createProduct(userId: string, data: Record<string, unknown>) {
  return productsDal.createProduct({ ...data, user_id: userId })
}

export async function updateProduct(id: string, userId: string, data: Record<string, unknown>) {
  // Ürünün kullanıcıya ait olduğunu doğrula
  const existing = await productsDal.getProductById(id, userId)
  if (!existing) {
    throw new Error('Ürün bulunamadı veya erişim yetkiniz yok')
  }

  await productsDal.updateProduct(id, data)
}
