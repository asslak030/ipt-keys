import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .input(
      z.object({
        gameName: z.string().min(2, "Game name is required"),
        category: z.string().min(2, "Category is required"),
        price: z.string().min(1, "Price is required"),
        description: z.string().optional(),
      }),
    )
    .middleware(async ({ req, input }) => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for user:", metadata.userId);
      console.log("🖼️ File URL:", file.ufsUrl);

     
      return {
        uploadedBy: metadata.userId,
        imageUrl: file.ufsUrl,
        message: "Game successfully uploaded!",
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
