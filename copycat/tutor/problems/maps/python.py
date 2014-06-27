def get(map, key):
  return map[key]

def insert(map, key, val):
  map[key] = val
  
def remove(map, key):
  del map[key]