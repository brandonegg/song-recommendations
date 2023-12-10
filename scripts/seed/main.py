from redis_import import create_song_search_table, clear_song_table
from neo4j_import import create_song_nodes, create_similarity_relation

if __name__ == "__main__":
    print("Initializing & seeding Redis DB...")
    clear_song_table()
    create_song_search_table()
    print("Redis seeding complete!")

    print("Creating neo4j song nodes...")
    create_song_nodes()
    create_similarity_relation()
    print("Neo4J seeding complete!")
