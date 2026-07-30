#BSP-9
def map_fields(book):
    return {
        "isbn": map_isbn(book),
         "title": map_title(book),
         "subtitle": map_subtitle(book),
         "authors": map_authors(book),
         "language": map_language(book),
         "publisher": map_publisher(book),
         "publicationDate": map_publication_date(book)

    }



def map_isbn(book):
    identifier = book.get('ProductIdentifier', [])

    if not isinstance(identifier, list):
        identifier = [identifier]

    for id in identifier:
        if id.get('ProductIDType') == '15':
            return id.get('IDValue')
    return 'Unknown ISBN'


def map_title(book):
    detail = book.get('DescriptiveDetail', {})
    title_detail = detail.get('TitleDetail', [])

    if not isinstance(title_detail, list):
        title_detail = [title_detail]

    for td in title_detail:
        title_element = td.get('TitleElement', [])

        if not isinstance(title_element, list):
            title_element = [title_element]

        for element in title_element:
            if element.get('TitleElementLevel') == '01':
                title_text = element.get('TitleText')

                if isinstance(title_text, str):
                    return title_text
                elif isinstance(title_text, dict):
                    return title_text.get('#text', 'Unknown Title')

    return 'Unknown Title'


def map_subtitle(book):
    detail = book.get('DescriptiveDetail', {})
    title_detail = detail.get('TitleDetail', [])

    if not isinstance(title_detail, list):
        title_detail = [title_detail]

    for td in title_detail:
        title_element = td.get('TitleElement', [])

        if not isinstance(title_element, list):
            title_element = [title_element]

        for element in title_element:
            if element.get('TitleElementLevel') == '01':
                subtitile = element.get('Subtitle')

                if isinstance(subtitile, str):
                    return subtitile
                elif isinstance(subtitile, dict):
                    return subtitile.get('#text', 'Unknown Subtitle')
    return 'Unknown Subtitle'


def map_authors(book):
    author_code = "A01"
    translator_code = "B06"
    editor_code = "B01"
    authors = []
    detail = book.get('DescriptiveDetail', {})
    contributors = detail.get('Contributor', [])

    if not isinstance(contributors, list):
        contributors = [contributors]

    for contributor in contributors:
        if contributor.get('ContributorRole') == author_code:
            name = contributor.get('PersonName', 'Unknown Author')
            authors.append({"role" : "author", "name": name})

        elif contributor.get('ContributorRole') == translator_code:
            name = contributor.get('PersonName', 'Unknown Translator')
            authors.append({"role" : "translator", "name": name})

        elif contributor.get('ContributorRole') == editor_code:
            name = contributor.get('PersonName', 'Unknown Editor')
            authors.append({"role" : "editor", "name": name})

    return authors if authors else [{"role": "unknown", "name": "Unknown Contributor"}]

def map_language(book):
    detail = book.get('DescriptiveDetail', {})
    language = detail.get('Language', [])

    if not isinstance(language, list):
        language = [language]

    for lang in language:
        if lang.get('LanguageRole') == '01':
            return lang.get('LanguageCode', 'Unknown Language')
    return 'Unknown Language'


def map_publisher(book):
    detail = book.get('PublishingDetail', {})
    publisher = detail.get('Publisher', [])

    if not isinstance(publisher, list):
        publisher = [publisher]

    for pub in publisher:
        name = pub.get('PublisherName')
        if name:
            return name

    return 'Unknown Publisher'


def map_publication_date(book):
    detail = book.get('PublishingDetail', {})
    publishing_date = detail.get('PublishingDate', [])

    if not isinstance(publishing_date, list):
        publishing_date = [publishing_date]

    for date in publishing_date:
        if date.get('PublishingDateRole') == '01':
            raw_date = date.get('Date', '')

            if isinstance(raw_date, dict):
                raw_date = raw_date.get('#text', '')

            if isinstance(raw_date, str) and len(raw_date) == 8:
                return f"{raw_date[0:4]}-{raw_date[4:6]}-{raw_date[6:8]}"

            return raw_date

    return 'Unknown Publication Date'


