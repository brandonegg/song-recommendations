import redis

# Connect to Redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Test query this is the first song in the CSV file
# FT.SEARCH songs_index '@name:(Testify)'
index_name = 'songs_index'
search_term = '@name:Born of a Broken Man'
result = r.execute_command('FT.SEARCH', index_name, search_term)
for i in result: print(f"{type(i)}: {i}")

# FT.SEARCH songs_index '@artists:Rage Against The Machine'
search_term = '@artists:Rage Against The Machine'
result = r.execute_command('FT.SEARCH', index_name, search_term)
for i in result: print(f"{type(i)}: {i}")

# FT.SEARCH songs_index '@album:The Battle Of Los Angeles'
search_term = '@album:The Battle Of Los Angeles'
result = r.execute_command('FT.SEARCH', index_name, search_term)
for i in result: print(f"{type(i)}: {i}")

# [22, b'item:10561', [b'$', b'{"id":"3wmKa3pt9kyHKRxtqsVGYG","name":"Born of a Broken Man - Live at the Grand Olympic Auditorium, Los Angeles, CA - September 2000","artists":"[\'Rage Against The Machine\']","artist_ids":"[\'2d0hyoQ5ynDBnkvAbJKORj\']"}'], b'item:7401', [b'$', b'{"id":"3WmiisfwPICXyzJBrOSfI8","name":"Born Like This","artists":"[\'Three Days Grace\']","artist_ids":"[\'2xiIXseIJcq3nG7C8fHeBj\']"}'], b'item:6908', [b'$', b'{"id":"6lbGZSI5ptoB8JXn0wtBC2","name":"Born Under a Bad Sign","artists":"[\'Etta James\']","artist_ids":"[\'0iOVhN3tnSvgDbcg25JoJb\']"}'], b'item:1084', [b'$', b'{"id":"6YGPDRydgFqOB6UIIrYefx","name":"Before You Were Born","artists":"[\'Toad The Wet Sprocket\']","artist_ids":"[\'4j7EVY3kuDwLPfD2jfC7LC\']"}'], b'item:22282', [b'$', b'{"id":"5x3VjWoaGvUXFRrtr9frIr","name":"Maybe She\'s Born With It","artists":"[\'Stop It!!\']","artist_ids":"[\'4SZtuc01s2gmhy1njwuICj\']"}'], b'item:3268', [b'$', b'{"id":"3C8h5AnkJW2jrfJ7rcobsa","name":"Born to Hum","artists":"[\'Erin McKeown\']","artist_ids":"[\'715aftFykfb77AGFFs9WDj\']"}'], b'item:7547', [b'$', b'{"id":"3UUxgiU8x4pcBQm18Jp8z0","name":"Born Free (From The Film \\"Born Free\\")","artists":"[\'Kate Smith\', \'Glenn Osser\']","artist_ids":"[\'0Te1NusV6mkAMJ1VAkzJiX\', \'5IzlXnIwa5PWqv5Eh4vJnj\']"}'], b'item:22861', [b'$', b'{"id":"1hcMdkYr3oswSEPG4TGOe5","name":"With You I\'m Born Again","artists":"[\'Regine Velasquez\']","artist_ids":"[\'3wNylAjJX1PiCpMKx8Lrfp\']"}'], b'item:18798', [b'$', b'{"id":"6Kx7dhyOVXblnEs0AkJ4xI","name":"Babe Is Born/Enter The Stable Gently","artists":"[\'Liz Story\']","artist_ids":"[\'7yqRFgyP3seQwIu2FWGBbU\']"}'], b'item:6983', [b'$', b'{"id":"4HBxVkfgzZMS4m9AWpvOma","name":"I Was Born In The Country","artists":"[\\"Dan Melchior\'s Broke Revue\\"]","artist_ids":"[\'2FO7ma9WG3Zc4rg3KN5Lb8\']"}']]