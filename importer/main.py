import reader, mapper, api


def main_loop(file_path, auth_token):
    print(f"token: {auth_token}")

    try:
        if catalog_id := api.isCatalog( auth_token, "Books"):
            print(f"Catalog already exists with ID: {catalog_id}")
        else:
            catalog_id = api.POST_catalog(auth_token, "Books", "This is the main catalog for ONIX books.")
            if not catalog_id:
                raise Exception("Failed to create catalog.")
    except Exception as e:
        print(f"Catalog initialization failed: {e}")
        return

    try:
        raw_books = reader.reader_read(file_path)
        raw_books_list = raw_books.get('ONIXMessage', {}).get('Product', [])

        if not isinstance(raw_books_list, list):
            raw_books_list = [raw_books_list]
    except Exception as e:
        print(f"Failed to read file: {e}")
        return

    for book in raw_books_list:
        try:
            input("> Press Enter to continue to the next book...")

            book_object = mapper.map_fields(book)
            emporix_object = api.convert_to_emporix_data(book_object)


            category_name = book_object["category"]
            category_id = api.isCategory(category_name, auth_token)
            if not category_id:
                category_id = api.POST_category(category_name, auth_token)

            api.PUT_category_in_catalog( catalog_id , category_id , auth_token)

            cover_image = book_object["cover_image_url"]
            book_id, existing_media, old_category_ids = api.isProduct(emporix_object, auth_token)

            if not book_id:
                object_id = api.POST_product(emporix_object, auth_token)
            else :
                object_id = api.PUT_product(emporix_object, book_id, auth_token)

                if old_category_ids:
                    for old_cat in old_category_ids:
                        if old_cat != category_id:
                            api.DELETE_product_from_category(object_id, old_cat, auth_token)


            api.POST_product_to_category(object_id, category_id, auth_token)

            if cover_image and not cover_image == "Unknown Cover Image URL":
                image_already_exists = any(media.get('url') == cover_image for media in existing_media)
                if not image_already_exists:
                    api.POST_media(cover_image, object_id, auth_token)
                else:
                    print(f"Cover image already exists for product {object_id}. Skipping upload.")






            if book_id:
                api.PUT_price(emporix_object, object_id, auth_token)
                api.PUT_availability(emporix_object, object_id, auth_token)
            else:

                api.POST_price(emporix_object, object_id, auth_token)
                api.POST_availability(emporix_object, object_id, auth_token)
                

        except Exception as e:
            print(f"Error processing book: {e}")
            #TODO LOGGING
            continue

    return

if __name__ == '__main__':
    try:
        main_loop('books-onix1.xml', api.get_auth_data())
    except Exception as e:
        print(f"Fatal setup error: {e}")