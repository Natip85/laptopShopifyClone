import prisma from "@/lib/prismadb";

interface IParams {
  variantId?: number;
}

export default async function getProductByVariantId(params: IParams) {
  try {
    console.log("THE PARAMS>>>", params);

    const { variantId } = params;
    console.log("VARIANTID>>>", variantId);
    const parsedVariantId =
      typeof variantId === "undefined"
        ? undefined
        : parseInt(variantId.toString(), 10);

    const product = await prisma.product.findFirst({
      where: {
        variants: {
          some: {
            variantID: parsedVariantId,
          },
        },
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });
    console.log("FINAL PROD>>>", product);

    return product || null;
  } catch (error: any) {
    throw new Error(error);
  }
}
