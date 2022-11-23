class Item:
    def __init__(self, itype, path, size, last_accessed):
        self.type = itype
        self.path = path
        self.size = size
        self.last_accessed = last_accessed