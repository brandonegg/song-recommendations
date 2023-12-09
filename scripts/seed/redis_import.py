import csv
import redis
import json
import os
from dotenv import dotenv_values

dir_path = os.path.dirname(os.path.realpath(__file__))
config = dotenv_values(os.path.join(dir_path, "../../.env"))

# Creating the Redis Search index
# FT.CREATE songs_index ON JSON SCHEMA $.id AS id TEXT $.name AS name TEXT $.artists AS artists TEXT
# r.execute_command("FT.DROPINDEX", index_name)

DATA_PATH=config["DATA_PATH"]
REDIS_PASSWORD=config["REDIS_PASSWORD"]
REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_DB=0

def create_song_search_table():
    print("Connecting to redis DB...")
    r_driver = redis.StrictRedis(host='localhost', port=6379, db=0)
    print("Successfully connected to redis DB!")

    print(f"Opening data at path {DATA_PATH} (this path can be configured in .env)")
    count=0

    with open(DATA_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        index_name = 'songs_index'

        print("Creating search index")
        r_driver.execute_command("FT.CREATE", index_name, "ON", "JSON", "PREFIX" ,"1", "item:", "SCHEMA", "$.id", "AS", "id", "TEXT", "$.name", "AS", "name", "TEXT", "$.artists", "AS", "artists", "TEXT", "$.album", "AS", "album", "TEXT")
        print("Index created!")

        print("Adding data... (this will take a bit)")
        for row in reader:
            track_id = row['id'].replace("[", "").replace("]", "").replace("'", "")
            track_name = row['name'].replace("[", "").replace("]", "").replace("'", "")
            artists = row['artists'].replace("[", "").replace("]", "").replace("'", "")
            artist_ids = row['artist_ids'].replace("[", "").replace("]", "").replace("'", "")
            album = row['album'].replace("[", "").replace("]", "").replace("'", "")
            ablum_id = row['album_id'].replace("[", "").replace("]", "").replace("'", "")

            json_data = {
                'id': track_id,
                'name': track_name,
                'artists': artists,
                'artist_ids': artist_ids,
                'album': album,
                'album_id': ablum_id
            }

            r_driver.execute_command('JSON.SET', f'item:{count}', '.', json.dumps(json_data))
            count +=1

    print("Import data completed. Redis search table seeded!")
