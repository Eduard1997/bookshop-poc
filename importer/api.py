
def convert_to_emporix_data(book_object):
    return {
        "name": {
            book_object["language"]: book_object["title"]
        },
        "code": book_object["isbn"],
        "description":{
            book_object["language"]: book_object["description"]},
        "published": False,
        "productType": "BASIC",
        
        "mixins": {
            "bookDetails":{
                "1e916fe6-b678-4ecc-bbae-bc26e2323305": [
                    {
                        "0752e4e2-0c78-4f77-b051-397962ae0a55": person.get("role"),
                        "ea660a09-a300-4815-92a2-3387e61a3775": person.get("name")
                    } for person in book_object.get("authors", [])
                ],
                "0e70195d-3327-4e1e-8ba3-19291d0851ca": book_object["publisher"],
                "5424cd7c-bb1c-47d4-be6c-916c1cb1f0d0": book_object["publicationDate"],
                "5b10f342-26b7-4573-9c3d-ea1d70c11053": book_object["subtitle"],
                "7b55e0d4-abd8-41e0-afb2-841010a3e2a2": book_object["category"],
                "88c144fe-37ca-4dd8-9075-5d9b51600813": book_object["language"],
                "ce763c33-8352-46e6-ba05-04ac6bb64c0c": book_object["pageCount"],
                "ee7a09b7-1769-47bf-83c3-4caadc60bb78": book_object["productForm"],
            }
        }
    }

#emporix structure for the book object
#     '{
#     "name": "Smartphone X2",
#     "code": "BASIC001",
#     "description": "The world best camera and camcorder in a waterproof smartphone.",
#     "published": false,
#     "productType": "BASIC"
#
# }'

def POST_object(book_object):

    emporix_object = convert_to_emporix_data(book_object)

    #emporix structure for the book object
    # {
    #     "code": "9783662731864",
    #     "name": {
    #         "en": " "
    #     },
    #     "description": {
    #         "en": " "
    #     },
    #     "published": false,
    #     "productType": "BASIC",
    #     "mixins": {
    #         "bookDetails": {

    #         }
    #     }
    # }

def POST_price(book_object, book_id):
    #TODO: BSP-12 here
    return