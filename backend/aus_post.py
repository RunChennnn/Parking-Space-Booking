import json
import numpy as np

with open('backend/australian_postcodes.json') as file:
    read_data = json.load(file)

    postcodes = {}
    for elem in read_data:
        postcode = elem['postcode']
        if postcode not in postcodes:
            postcodes[postcode] = [[], []]

        postcodes[postcode][0].append(elem['Lat_precise'])
        postcodes[postcode][1].append(elem['Long_precise'])

    final = []
    for pc in postcodes:
        element = {
            'postcode': pc,
            'Lat_precise': np.mean(postcodes[pc][0]),
            'Long_precise': np.mean(postcodes[pc][1]),
        }
        final.append(element)

with open('postcodes.json', 'w+') as file:
    file.write(json.dumps(final, indent=4))
