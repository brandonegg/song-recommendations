import redis
import json

# Connect to Redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Test query this is the first song in the CSV file
# FT.SEARCH songs_index '@name:(Testify)'
index_name = 'songs_index'
# this can be one query and whatever the search term ends up being can populate all three
search_term = "Born of a Broken Man"
search_query = f'@name:{search_term} | @artists:{search_term} | @album:{search_term}'
result = r.execute_command('FT.SEARCH', index_name, search_query)
for i in result: print(f"{type(i)}: {i}")

result = r.execute_command('FT.SEARCH', index_name, '@id:7lmeHLHBe4nmXzuXc0HDjk')
for i in result: print(f"{type(i)}: {i}")

print('\n')
# Storing user selected songs query, this will come from the next.js part
session_id = "unique_idenifier_1"
# The list of track_ids, will add to this list once a user selects a song:
# FT.SEARCH songs_index "@id:7lmeHLHBe4nmXzuXc0HDjk"
ids = ['7lmeHLHBe4nmXzuXc0HDjk', '1wsRitfRRtWyEapl0q22o8', '1hR0fIFK2qRG3f3RF70pb7']
# create JSON payload to make Redis happy
serialized_items = json.dumps(ids)
r.hset(session_id, 'songs', serialized_items)
serialized_items = r.hget(session_id, 'songs')
id_list = []
if serialized_items:
    # if we get items then we need to deserialized the JSON to get the proper list
    id_list = json.loads(serialized_items)
    print(id_list)

# Search for song info stored in index with the song id
for id in id_list:
    search_term = f'@id:{id}'
    result = r.execute_command('FT.SEARCH', index_name, search_term)
    print(result)
