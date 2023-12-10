"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { addToCuration } from "@/lib/queries/curation";
import { getCurationCookie } from "@/lib/cookies";

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
}
