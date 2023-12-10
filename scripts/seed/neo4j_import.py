#Import script to import ColumnIds and create Song Node linking all the property keys together
import os
import pandas as pd
from neo4j import GraphDatabase
from dotenv import dotenv_values

dir_path = os.path.dirname(os.path.realpath(__file__))
config = dotenv_values(os.path.join(dir_path, "../../.env"))

BATCH_SIZE = 1000
DATA_PATH = config["DATA_PATH"]
NEO4J_PASSWORD = config["NEO4J_PASSWORD"]
NEO4J_USER = config["NEO4J_USER"]
NEO4J_URI = "bolt://localhost:7687"

def remove_song_nodes():
    def delete_all_songs(tx):
        tx.run("MATCH (s:Song)\n"
               "DETACH DELETE s;")

    with neo_connect() as driver:
        with driver.session() as session:
            session.write_transaction(delete_all_songs)

#Driver (Just in case, but you can probably hardcode this)
def neo_connect():
    return GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def create_nodes(tx, data):
    for _, row in data.iterrows():
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

def create_song_nodes():
    spotify_data = pd.read_csv(DATA_PATH)

    with neo_connect() as driver:
        with driver.session() as session:
            for i in range(0, len(spotify_data), BATCH_SIZE):
                batch_data = spotify_data.iloc[i:i+BATCH_SIZE]
                session.write_transaction(create_nodes, batch_data)

def create_similarity_relation():
    with neo_connect() as driver:
        with driver.session() as session:
            # Project graph and scale properties
            session.run('CALL gds.graph.project("SongGraph", "Song", "*",'
                        '{nodeProperties:["danceability", "energy", "loudness", "key", "mode", '
                        '"speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"]})')
            #MinMax to normalize 0,1
            session.run('CALL gds.scaleProperties.mutate("SongGraph",'
                        '{nodeProperties: ["danceability", "energy", "loudness", "key", "mode", '
                        '"speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"], '
                        'scaler:"MinMax", mutateProperty: "scaledProperties"}) YIELD nodePropertiesWritten')

            # Create Euclidean distance similarity relation
            '''
            similarity cutoff computed with:
                session.run('CALL gds.knn.stats("SongGraph",'
                            '{nodeProperties:{scaledProperties:"EUCLIDEAN"}, topK:15, sampleRate:1, randomSeed:42, concurrency:1}) '
                            'YIELD similarityDistribution RETURN similarityDistribution')
            '''
            session.run('CALL gds.knn.mutate("SongGraph",'
                        '{nodeProperties: {scaledProperties: "EUCLIDEAN"}, topK: 15, mutateRelationshipType: "IS_SIMILAR",'
                        'mutateProperty: "similarity", similarityCutoff: 0.7620086669921875, sampleRate:1, randomSeed:42, concurrency:1})')

            # Write the projection graph relationship IS_SIMILAR to graph
            session.run('CALL gds.graph.writeRelationship("SongGraph", "IS_SIMILAR", "similarity")')
            # Drop the SongGraph
            session.run('CALL gds.graph.drop("SongGraph")')
