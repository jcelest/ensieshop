import { PrismaClient } from "@prisma/client";
import { serializeColorImages, serializeImageUrls } from "../src/lib/product-images";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "FlexiDock 3-in-1 Organizer",
        description:
          "A compact desk and travel organizer with a foldable phone stand, cable dock, accessory tray, and charging-pad area. Built for nightstands, workstations, and carry-on setups.",
        price: 39.99,
        category: "desk organizer",
        sizes: "Standard,Bundle",
        colors: "Charcoal,White",
        colorImages: serializeColorImages({
          Charcoal: "/images/organizer-product.png",
          White: "/images/organizer-product.png",
        }),
        imageUrls: serializeImageUrls(["/images/organizer-product.png"]),
        featured: true,
        inStock: true,
        sortOrder: 0,
      },
      {
        name: "FlexiDock Travel Bundle",
        description:
          "The organizer plus a compact cable kit and soft travel sleeve for customers who want the complete everyday-carry setup.",
        price: 54.99,
        category: "travel bundle",
        sizes: "Bundle",
        colors: "Charcoal",
        colorImages: serializeColorImages({
          Charcoal: "/images/organizer-product.png",
        }),
        imageUrls: serializeImageUrls(["/images/organizer-product.png"]),
        featured: true,
        inStock: true,
        sortOrder: 1,
      },
    ],
  });

  console.log("EnsieShop seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
