class Item:
    """Class representing a file or a folder."""
    def __init__(self, type_, path, size, last_accessed):
        self.type = type_
        self.path = path
        self.size = size
        self.last_accessed = last_accessed
