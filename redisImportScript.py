import csv
import redis
import json

# Connect to Redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)
print("Connected")
# Read CSV and import data into Redis
PATH_TO_SONG_DATA='tracks_features.csv'
with open(PATH_TO_SONG_DATA, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    index_name = 'songs_index'

    # Creating the Redis Search index
    # FT.CREATE songs_index ON JSON SCHEMA $.id AS id TEXT $.name AS name TEXT $.artists AS artists TEXT
    # r.execute_command("FT.DROPINDEX", index_name)
    r.execute_command("FT.CREATE", index_name, "ON", "JSON", "PREFIX" ,"1", "item:", "SCHEMA", "$.id", "AS", "id", "TEXT", "$.name", "AS", "name", "TEXT", "$.artists", "AS", "artists", "TEXT", "$.album", "AS", "album", "TEXT")
    print("Command Executed")
    # Importing data into the created index
    count = 1
    for row in reader:
        track_id = row['id'].replace("[", "").replace("]", "").replace("'", "")
        track_name = row['name'].replace("[", "").replace("]", "").replace("'", "")
        artists = row['artists'].replace("[", "").replace("]", "").replace("'", "")
        artist_ids = row['artist_ids'].replace("[", "").replace("]", "").replace("'", "")
        album = row['album'].replace("[", "").replace("]", "").replace("'", "")
        ablum_id = row['album_id'].replace("[", "").replace("]", "").replace("'", "")

        # Convert row to JSON format including lists
        json_data = {
            'id': track_id,
            'name': track_name,
            'artists': artists,
            'artist_ids': artist_ids,
            'album': album,
            'album_id': ablum_id
        }

        # Add JSON data to the Redis Search index
        # JSON.SET item:1 . { json payload }
        r.execute_command('JSON.SET', f'item:{count}', '.', json.dumps(json_data))
        count += 1

        # Use this if you need quicker testing
        # if count == 1000: break

print("Redis Search index created and data imported successfully.")
