import prisma from "@/lib/prismadb";

export default async function getProducts() {
  try {
    const products = await prisma.product.findMany();

    return products;
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
