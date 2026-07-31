#BSP-9
def map_fields(book):
    return {
        "description": map_description(book),
        "cover_image_url": map_cover_image_url(book),
        "category": map_category(book),
        "availability": map_availability(book),
        "product form": map_product_form(book),
        "page count":map_page_count(book),
        "prices": map_prices(book)
    }

PRODUCT_FORM_MAP = {
    'BB': 'Hardback',
    'BC': 'Paperback'
}

AVAILABILITY_MAP = {
    '20': 'IN_STOCK',
    '21': 'IN_STOCK',
    '23': 'PRINT_ON_DEMAND',
    '10': 'NOT_IN_STOCK'  
}
IN_STOCK_CODES = {"20", "21"}

PRICE_TYPE_MAP = {
    "01": "RRP_excluding_tax",  
    "02": "RRP_including_tax"
}

PAGE_COUNT_CODES = {"00", "11"}

def map_description(book):
    collateral = book.get('CollateralDetail', {})
    if not collateral:
        return "Unknown Description"
    text_contents= collateral.get('TextContent', [])
    if isinstance(text_contents, dict):
        text_contents = [text_contents]

    for item in text_contents:
        if(item.get('TextType') == '03'):
            text_val = item.get('Text', '')

            if isinstance(text_val, dict):
                return text_val.get('#text', 'Unknown Description')
            return text_val
        
    return "Unknown Description"

def map_cover_image_url(book):
    collateral = book.get('CollateralDetail', {})
    resources = collateral.get('SupportingResource', [])
    if not resources:
        return "Unknown Cover Image URL"
    
    if isinstance(resources, dict):
        resources = [resources]

    for res in resources:
        content_type = res.get('ResourceContentType')
        mode = res.get('ResourceMode')

        if content_type == '01' and mode =='03':
            versions = res.get('ResourceVersion', [])

            if isinstance(versions, dict):
                versions = [versions]

            for v in versions:
                link = v.get('ResourceLink')
                if link:
                    return "https://picsum.photos/200/300"

    return "Unknown Cover Image URL"

def map_category(book):
    descriptive = book.get('DescriptiveDetail', {})
    subjects = descriptive.get('Subject', [])
    if not subjects:
        return "Unknown Category"

    if isinstance(subjects, dict):
        subjects = [subjects]

    fallback_category = None 

    #24 + 10 fallback category
    #93 cautare prioritara

    for sub in subjects:
        scheme = sub.get('SubjectSchemeIdentifier')
        if isinstance(scheme, dict):
            scheme = scheme.get('#text')

        heading_text = sub.get('SubjectHeadingText')
        if isinstance(heading_text, dict):
            heading_text = heading_text.get('#text')

        if heading_text and not fallback_category:
            fallback_category = heading_text

        if scheme == '93' and heading_text:
            return heading_text

    if fallback_category:
        return fallback_category

    return "Unknown Category"

def map_availability(book):
    product_supply = book.get("ProductSupply", {})
    supply_details = product_supply.get("SupplyDetail", [])

    if not supply_details:
        return None

    if isinstance(supply_details, dict):
        supply_details = [supply_details]

    for detail in supply_details:
        availability_code = detail.get("ProductAvailability")
        if isinstance(availability_code, dict):
            availability_code = availability_code.get("#text")

        if availability_code:
            availability_code = str(availability_code).strip()

            if availability_code in IN_STOCK_CODES:
                return {"stockLevel": 10, "available": True, "distributionChannel": "ASSORTMENT"}
            elif availability_code == "10":
                return {"stockLevel": 0, "available": False, "distributionChannel": "ASSORTMENT"}
            elif availability_code == "23":
                return {"stockLevel": 0, "available": True, "distributionChannel": "ASSORTMENT"}

    return None

def map_product_form(book):
    descriptive = book.get('DescriptiveDetail', {})
    form_code = descriptive.get('ProductForm')

    if not form_code:
        return "Unknown Format"

    if isinstance(form_code, dict):
        form_code = form_code.get('#text')

    return PRODUCT_FORM_MAP.get(form_code, "Unknown Format")

def map_page_count(book):
    descriptive = book.get("DescriptiveDetail", {})

    extents = descriptive.get("Extent", [])
    if isinstance(extents, dict):
        extents = [extents]
    for extent in extents:
        if extent.get("ExtentType") in PAGE_COUNT_CODES:
            val = extent.get("ExtentValue")
            if isinstance(val, dict):
                val = val.get('#text')
            if val and str(val).isdigit():
                return int(val)

    return None

def map_prices(book, default_currency="EUR"):
    prices_list = []

    publishing = book.get("PublishingDetail", {})
    country = publishing.get("CountryOfPublication")
    if isinstance(country, dict):
        country = country.get("#text")

    product_supply = book.get("ProductSupply", {})
    supply_details = product_supply.get("SupplyDetail", [])

    if not isinstance(supply_details, list):
        supply_details = [supply_details]

    for detail in supply_details:
        prices = detail.get("Price", [])
        if not isinstance(prices, list):
            prices = [prices]

        for price in prices:
            amount = price.get("PriceAmount")
            currency = price.get("CurrencyCode", default_currency)

            if isinstance(amount, dict):
                amount = amount.get("#text")
            if isinstance(currency, dict):
                currency = currency.get("#text")

            final_currency = currency or default_currency

            if final_currency == "EUR" and amount:
                try:
                    price_obj = {
                        "amount": float(amount),
                        "currency": "EUR",
                    }

                    if country:
                        price_obj["countries"] = [str(country).strip()]

                    prices_list.append(price_obj)
                except (ValueError, TypeError):
                    continue

    return prices_list if prices_list else None