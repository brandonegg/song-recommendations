import neo4j from "neo4j-driver";

export const neo4jDriver = neo4j.driver(
  "neo4j://neo4j",
  neo4j.auth.basic(
    process.env.NEO4J_USER ?? "neo4j",
    process.env.NEO4J_PASSWORD ?? "",
  ),
);
