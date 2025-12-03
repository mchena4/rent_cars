import { useAuth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

const HandleAuth = ()=> {
    const { userId } = useAuth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
}

export const ourFileRouter = {
    photo: f({image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(() => HandleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;