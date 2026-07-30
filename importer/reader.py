import xmltodict , json

def reader_read(file_path = 'books-onix.xml'):
    with open(file_path, 'r', encoding='utf-8') as f:
        return xmltodict.parse(f.read())