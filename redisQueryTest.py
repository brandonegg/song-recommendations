import redis

# Connect to Redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Test query this is the first song in the CSV file
# FT.SEARCH songs_index '@name:(Testify)'
index_name = 'songs_index'
search_term = '@name:"Born"'
result = r.execute_command('FT.SEARCH', index_name, search_term)
print(result)

# Unsure about tags, currently it does not work
# search_term = '@artists:{Rage Against The Machine}'
# result = r.execute_command('FT.SEARCH', index_name, search_term)
# print(result)