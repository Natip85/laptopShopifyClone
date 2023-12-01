import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return NextResponse.error();
  // }

  const body = await request.json();
  const {
    title,
    description,
    images,
    price,
    quantity,
    shipping,
    weight,
    weightMeasurement,
    productStatus,
    category,
    sku,
    variants,
  } = body;
  console.log("MAIN VARIANTS", variants);

  const product = await prisma.product.create({
    data: {
      title,
      description,
      images,
      price: parseFloat(price) || 0,
      quantity: +quantity || 0,
      shipping,
      weight: weight || undefined,
      weightMeasurement: weightMeasurement || "lb",
      productStatus,
      category,
      sku,
      variants: variants || undefined,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   return NextResponse.error();
  // }

  const body = await request.json();
  const {
    id,
    title,
    description,
    images,
    price,
    quantity,
    shipping,
    weight,
    weightMeasurement,
    productStatus,
    category,
    variants,
  } = body;

  const product = await prisma.product.update({
    where: { id: id },
    data: {
      title,
      description,
      images: images || "https://i.stack.imgur.com/y9DpT.jpg",
      price: parseFloat(price),
      quantity: +quantity,
      shipping,
      weight: weight || undefined,
      weightMeasurement,
      productStatus,
      category,
      variants: variants || undefined,
    },
  });

  return NextResponse.json(product);
}
