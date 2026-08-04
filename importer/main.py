import reader,mapper,api

def main_loop(file_path, auth_token):
    print(f"token: {auth_token}")
    if not auth_token:
        print("Authentication failed. Exiting.")
        return

    raw_books = reader.reader_read(file_path)
    raw_books_list = raw_books.get('ONIXMessage', {}).get('Product', [])

    if not isinstance(raw_books_list, list):
        raw_books_list = [raw_books_list]

    for book in raw_books_list:
        book_object = mapper.map_fields(book)

        input("> Press Enter to continue to the next book...")

        cover_image = book_object["cover_image_url"]

        emporix_object = api.convert_to_emporix_data(book_object)

        book_id, existing_media = api.isProduct(emporix_object, auth_token)

        if not book_id:
            object_id = api.POST_product(emporix_object, auth_token)
            if object_id:
                api.POST_product_to_category(object_id, auth_token)
        else :
            object_id = api.PUT_product(emporix_object, book_id, auth_token)

        if object_id and cover_image and not cover_image == "Unknown Cover Image URL":
            image_already_exists = any(media.get('url') == cover_image for media in existing_media)
            if not image_already_exists:
                api.POST_media(cover_image, object_id, auth_token)
            else:
                print(f"Cover image already exists for product {object_id}. Skipping upload.")


        #api.POST_price(book_object, object_id)

    return

if __name__ == '__main__':
    main_loop('books-onix.xml', api.get_auth_data())

