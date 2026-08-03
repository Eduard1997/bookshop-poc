import json, requests


def convert_to_emporix_data(book_object):
    return {
        "name": {
            book_object["language"]: book_object["title"]
        },
        "code": book_object["isbn"],
        "description": {
            book_object["language"]: book_object["description"]
        },
        "published": False,
        "productType": "BASIC",

        "mixins": {
            "6a6b3582e7cadf3c8a834e15": {
                "1e916fe6-b678-4ecc-bbae-bc26e2323305": [
                    {
                        "0752e4e2-0c78-4f77-b051-397962ae0a55": person.get("role"),
                        "ea660a09-a300-4815-92a2-3387e61a3775": person.get("name")
                    } for person in book_object.get("authors", [])
                ],
                "0e70195d-3327-4e1e-8ba3-19291d0851ca": book_object["publisher"],
                "5424cd7c-bb1c-47d4-be6c-916c1cb1f0d0": book_object["publicationDate"] + "T00:00:00.000Z",#need check if it works without this time part, NOT TESTED
                "5b10f342-26b7-4573-9c3d-ea1d70c11053": book_object["subtitle"],
                "7b55e0d4-abd8-41e0-afb2-841010a3e2a2": book_object["category"],
                "225d2927-f0aa-412c-a7da-a4aee78a2351": book_object["language"],
                "ce763c33-8352-46e6-ba05-04ac6bb64c0c": book_object["pageCount"],
                "ee7a09b7-1769-47bf-83c3-4caadc60bb78": book_object["productForm"]
            }
        },

        "metadata": {
            "mixins": {
                "6a6b3582e7cadf3c8a834e15": "https://res.cloudinary.com/saas-ag/raw/upload/schemata2/ant2/6a6b3582e7cadf3c8a834e15_v5.json"
            },
            "schema": "https://res.cloudinary.com/saas-ag/raw/upload/v1544786405/schemata/CAAS/product.v2"
        }
    }

def get_auth_data():
    try:
        with open('credentials.json', 'r') as file:
            creds = json.load(file)
            tenant = creds.get('TENANT')
            client_id = creds.get('CLIENT_ID')
            client_secret = creds.get('CLIENT_SECRET')
    except FileNotFoundError:
        print("Credentials file not found! Please create it.")
        return None

    auth_url="https://api.emporix.io/oauth/token"

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    response = requests.post(auth_url, headers=headers, data=payload)

    if response.status_code == 200:
        return {
            "token": response.json().get("access_token"),
            "tenant": tenant
        }
    else:
        print(response.status_code)
        print(response.text)
        return None


def isProduct(emporix_object, auth_token):
    search_url=f"https://api.emporix.io/product/{auth_token['tenant']}/products/search"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
            "q": f"code:{emporix_object["code"]}"
    }

    response = requests.post(search_url, headers=headers, json=payload)


    if response.status_code == 200:

        if response.json():
            print(f"Product exists: {emporix_object}")
            return response.json()[0].get('id')
        else:
            print(f"Product does not exist: {emporix_object}")
            return None
    else:
        print(f"Search failed! Status Code: {response.status_code}")
        print(response.text)
        return None


def POST_product(emporix_object, auth_token):
    print(emporix_object)
    post_url = f"https://api.emporix.io/product/{auth_token['tenant']}/products"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    response = requests.post(post_url, headers=headers, json=emporix_object)

    if response.status_code in [200, 201]:
        id = response.json().get('id')
        print(f"Created book: {id}")

        return id
    else:
        print(f"Post failed! Status Code: {response.status_code}")
        print(response.text)
        return None


def PUT_product(emporix_object, book_id, auth_token):
    return None



def POST_price(book_object, book_id):
    #TODO: BSP-12 here
    return