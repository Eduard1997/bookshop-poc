import reader,mapper,api

def main_loop(file_path, auth_token):
    print(f"token: {auth_token}")

    raw_books = reader.reader_read(file_path)
    raw_books_list = raw_books.get('ONIXMessage', {}).get('Product', [])

    if not isinstance(raw_books_list, list):
        raw_books_list = [raw_books_list]

    for book in raw_books_list:
        book_object = mapper.map_fields(book)

        input("> Press Enter to continue to the next book...")
        object_id = api.POST_object(book_object, auth_token)

        # api.POST_price(book_object, object_id)

    return

if __name__ == '__main__':
    main_loop('books-onix1.xml', api.get_auth_data())

