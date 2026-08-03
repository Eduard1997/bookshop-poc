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
        emporix_object = api.convert_to_emporix_data(book_object)

        book_id = api.isProduct(emporix_object, auth_token)
        if not book_id:
            object_id = api.POST_product(emporix_object, auth_token)
        else :
            object_id = api.PUT_product(emporix_object, book_id, auth_token)

        #api.POST_price(book_object, object_id)

    return

if __name__ == '__main__':
    main_loop('test.xml', api.get_auth_data())

