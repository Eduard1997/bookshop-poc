import json, requests, re

def convert_to_emporix_data(book_object):
    name_dict = {book_object["language"]: book_object["title"]}
    if book_object["language"] != "en":
        name_dict["en"] = book_object["title"]

    return {
        "name":name_dict,
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
                "5424cd7c-bb1c-47d4-be6c-916c1cb1f0d0": book_object["publicationDate"],
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
        raise Exception("Credentials file not found! Please create it.")
    except json.JSONDecodeError:
        raise Exception("Credentials file is not valid JSON.")

    auth_url="https://api.emporix.io/oauth/token"

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    try:
        response = requests.post(auth_url, headers=headers, data=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during authentication: {e}")

    if response.status_code == 200:
        return {
            "token": response.json().get("access_token"),
            "tenant": tenant
        }
    else:
        raise Exception(f"Authentication failed! Status: {response.status_code}\n{response.text}")

def isProduct(emporix_object, auth_token):
    search_url=f"https://api.emporix.io/product/{auth_token['tenant']}/products/search"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
            "q": f"code:{emporix_object['code']}"
    }

    try:
        response = requests.post(search_url, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during isProduct check: {e}")

    if response.status_code == 200:
        data = response.json()
        if data:
            print(f"Product exists: {emporix_object['code']}")
            return data[0].get('id'), data[0].get('media',[])
        else:
            print(f"Product does not exist: {emporix_object['code']}")
            return None, []
    else:
        raise Exception(f"Search failed! Status Code: {response.status_code}\n{response.text}")

def isCatalog(auth_token, catalog_name):
    get_url = f"https://api.emporix.io/catalog/{auth_token['tenant']}/catalogs"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    query_params = {
        "name": catalog_name
    }

    try:
        response = requests.get(get_url, headers=headers, params=query_params)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during isCatalog check: {e}")

    if response.status_code == 200:
        catalogs = response.json()

        if catalogs and len(catalogs) > 0:
            catalog_id = catalogs[0].get("id")
            return catalog_id

        print(f"Catalog '{catalog_name}' does not exist.")
        return None

    else:
        raise Exception(f"Failed to fetch catalogs! Status Code: {response.status_code}\n{response.text}")


def isCategory(category_name, auth_token):
    slug = category_name.lower().strip()
    slug = re.sub(r'[^a-z0-9\- ]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'\-+', '-', slug)

    get_url = f"https://api.emporix.io/category/{auth_token['tenant']}/categories"

    headers = {
        "X-Version": "v2",
        "Accept": "application/json",
        "Content-Language": "*",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    try:
        response = requests.get(get_url, headers=headers)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during isCategory check: {e}")

    if response.status_code == 200:
        categories = response.json()

        for category in categories:
            loc_names = category.get("localizedName", {})
            loc_slugs = category.get("localizedSlug", {})

            if category_name in loc_names.values() or slug in loc_slugs.values():
                category_id = category.get("id")
                print(f"Category '{category_name}' already exists with ID: {category_id}")
                return category_id

        print(f"Category '{category_name}' does not exist.")
        return None
    else:
        raise Exception(f"Failed to fetch categories! Status Code: {response.status_code}\n{response.text}")

def POST_media(cover_image ,book_id, auth_token):
    post_url = f"https://api.emporix.io/media/{auth_token['tenant']}/assets"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
        "type": "LINK",
        "access": "PUBLIC",
        "url": cover_image,
        "refIds" : [{
            "id": book_id,
            "type": "PRODUCT"
        }]
    }

    try:
        response = requests.post(post_url, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during POST_media: {e}")

    if response.status_code in [200, 201]:
        media_id = response.json().get('id')
        print(f"Created media: {media_id}")
        return media_id
    else:
        raise Exception(f"Post media failed! Status Code: {response.status_code}\n{response.text}")

def POST_catalog(auth_token,catalog_name, catalog_description):
    post_url = f"https://api.emporix.io/catalog/{auth_token['tenant']}/catalogs"

    headers = {
        "Content-Language": "en",
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
        "name": catalog_name,
        "description": catalog_description,
        "visibility": {
            "visible": "true",
            "from": "2022-01-24T12:12:12.623z",
            "to": "2030-03-24T12:12:12.616Z"
        },
        "publishedSites": [
            "main"
        ],
        "categoryIds": []
    }

    try:
        response = requests.post(post_url, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during POST_catalog: {e}")

    if response.status_code in [200, 201]:
        catalog_id = response.json().get('id')
        print(f"Created catalog: {catalog_id}")
        return catalog_id
    else:
        raise Exception(f"Post catalog failed! Status Code: {response.status_code}\n{response.text}")

def POST_category(category_name,auth_token):
    slug = category_name.lower().strip()
    slug = re.sub(r'[^a-z0-9\- ]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'\-+', '-', slug)

    post_url = f"https://api.emporix.io/category/{auth_token['tenant']}/categories?publish=true"

    headers = {
        "X-Version": "v2",
        "Accept": "application/json",
        "Content-Language": "*",
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
        "localizedName": {
            "en": category_name
        },
        "localizedSlug": {
            "en": slug
        },
        "published": True
    }

    try:
        response = requests.post(post_url, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during POST_category: {e}")

    if response.status_code in [200, 201]:
        return response.json().get('id')
    else:
        raise Exception(f"Post category failed! Status Code: {response.status_code}\n{response.text}")



def POST_product_to_category(book_id, auth_token):
    post_url = f"https://api.emporix.io/category/{auth_token['tenant']}/categories/dde8517c-f75e-4261-bde4-bff75f010236/assignments"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    payload = {
        "ref": {
            "id": book_id,
            "type": "PRODUCT"
        }
    }

    try:
        response = requests.post(post_url, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during POST_product_to_category: {e}")

    if response.status_code in [200, 201, 207]:
        print(f"Assigned product {book_id} to category")
        return
    else:
        raise Exception(f"Post product to category failed! Status Code: {response.status_code}\n{response.text}")

def POST_product(emporix_object, auth_token):
    print(emporix_object)
    post_url = f"https://api.emporix.io/product/{auth_token['tenant']}/products"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    try:
        response = requests.post(post_url, headers=headers, json=emporix_object)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during POST_product: {e}")

    if response.status_code in [200, 201]:
        id = response.json().get('id')
        print(f"Created book: {id}")
        return id
    else:
        raise Exception(f"Post failed! Status Code: {response.status_code}\n{response.text}")

def PUT_product(emporix_object, book_id, auth_token):
    print(emporix_object)
    put_url= f"https://api.emporix.io/product/{auth_token['tenant']}/products/{book_id}"

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {auth_token['token']}"
    }

    try:
        response = requests.put(put_url, headers=headers, json=emporix_object)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error during PUT_product: {e}")

    if response.status_code in [200, 201, 204]:
        print(f"Updated book: {book_id}")
        return book_id
    else:
        raise Exception(f"Put failed! Status Code: {response.status_code}\n{response.text}")

def POST_price(book_object, book_id):
    #TODO: BSP-12 here
    return