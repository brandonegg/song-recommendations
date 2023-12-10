import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export function getCurationCookie() {
  const curation_uuid = cookies().get("curation_uuid")?.value;

  if (curation_uuid) {
    return curation_uuid;
  }

  const newUuid = randomUUID();
  cookies().set("curation_uuid", randomUUID());

  return newUuid;
}
