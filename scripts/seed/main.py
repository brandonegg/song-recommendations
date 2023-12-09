from redis_import import create_song_search_table

if __name__ == "__main__":
    print("Initializing & seeding Redis DB...")
    create_song_search_table()
    print("Redis seeding complete!")