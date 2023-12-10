"use server";
import { z } from "zod";
import { addToCuration, removeFromCuration } from "@/lib/queries/curation";
import { getCurationCookie } from "@/lib/cookies";
import { revalidatePath } from "next/cache";

const schema = z.object({
  id: z.string({
    invalid_type_error: "Invalid song id",
  }),
});

export async function addSongToCuration(formData: FormData) {
  const validatedFields = schema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const curation_uuid = getCurationCookie();

  await addToCuration(curation_uuid, validatedFields.data.id);
  revalidatePath("/");
}

export async function removeSongFromCuration(formData: FormData) {
  const validatedFields = schema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const curationUuid = getCurationCookie();
  removeFromCuration(curationUuid, validatedFields.data.id);
  revalidatePath("/");
}
