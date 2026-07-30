import reader,mapper,api

def main():
    main_loop('books-onix.xml')
    return



def main_loop(file_path):
    raw_books = reader.reader_read(file_path)
    raw_books_list = raw_books.get('ONIXMessage', {}).get('Product', [])

    for book in raw_books_list:
        book_object = mapper.map_fields(book)

        object_id = api.POST_object(book_object)
        api.POST_price(book_object, object_id)

    return


main()