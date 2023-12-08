#Import script to import ColumnIds and create Song Node linking all the property keys together
import os
import pandas as pd
from neo4j import GraphDatabase

#This helped with memory allocation lol
BATCH_SIZE = 1000  

#Driver (Just in case, but you can probably hardcode this)
def login(uri, user, password):
    return GraphDatabase.driver(uri, auth=(user, password))

#Import method for all columns
def importData(tx, data):
    for index, row in data.iterrows():
        tx.run(
            '''
            CREATE (s:Song {
                id: $id,
                name: $name,
                album: $album,
                album_id: $album_id,
                artists: $artists,
                artist_ids: $artist_ids,
                track_number: $track_number,
                disc_number: $disc_number,
                explicit: $explicit,
                danceability: $danceability,
                energy: $energy,
                key: $key,
                loudness: $loudness,
                mode: $mode,
                speechiness: $speechiness,
                acousticness: $acousticness,
                instrumentalness: $instrumentalness,
                liveness: $liveness,
                valence: $valence,
                tempo: $tempo,
                duration_ms: $duration_ms,
                time_signature: $time_signature,
                year: $year,
                release_date: $release_date
            })
            ''',
            **row.to_dict()
        )

uri = "bolt://localhost:7687"  
user = os.environ.get("NEO4J_USER", "neo4j")
password = os.environ.get("NEO4J_PASSWORD", "MDBproject")   

#Note -> Path will need to change per person
filePath = "C:/Users/Gokes/.Neo4jDesktop/relate-data/dbmss/dbms-98a65315-2d6d-4cc2-abab-46b7e16aa436/import/tracks_features.csv"
spotifyData = pd.read_csv(filePath)

with login(uri, user, password) as driver:
    with driver.session() as session:
        for i in range(0, len(spotifyData), BATCH_SIZE):
            batch_data = spotifyData.iloc[i:i+BATCH_SIZE]
            session.write_transaction(importData, batch_data)

print("Imported")
