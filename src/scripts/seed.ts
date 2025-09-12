import { db } from "~/server/db";
import { items } from "~/server/db/schema";
import { createId } from "@paralleldrive/cuid2";

async function main() {
  console.log("Seeding database...");

  // Sample battle items data
  const sampleItems = [
    {
      id: createId(),
      title: "Dragon Slayer Sword",
      description:
        "A legendary sword forged to slay dragons. Extremely sharp and durable.",
      category: "weapons",
      imageUrl: "https://example.com/images/dragon-slayer.jpg",
      ownerId: "admin",
    },
    {
      id: createId(),
      title: "Phoenix Shield",
      description:
        "A shield that can withstand fire attacks and regenerate itself.",
      category: "armor",
      imageUrl: "https://example.com/images/phoenix-shield.jpg",
      ownerId: "admin",
    },
    {
      id: createId(),
      title: "Elixir of Health",
      description: "Restores 100% health when consumed. Rare and valuable.",
      category: "potions",
      imageUrl: "https://example.com/images/health-elixir.jpg",
      ownerId: "admin",
    },
    // Add more sample items as needed
  ];

  // Insert sample data
  for (const item of sampleItems) {
    await db.insert(items).values(item);
  }

  console.log("Seeding completed!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
