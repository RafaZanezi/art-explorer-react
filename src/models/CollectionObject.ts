export interface CollectionObject {
    objectID: number;
    primaryImage: string;
    primaryImageSmall: string;
    additionalImages: string[];
    constituents: Constituents[]
    title: string;
    artistDisplayName: string;
    artistDisplayBio: string;
}

export interface Constituents {
    constituentID: number;
    role: string;
    name: string;
    constituentULAN_URL: string;
    constituentWikidata_URL: string;
    gender: string;
}

// imagem, título, artista, data, técnica, departamento, link para o site oficial
/**
 {
    "objectID": 51868,
    "isHighlight": false,
    "accessionNumber": "1984.492.3",
    "accessionYear": "1984",
    "isPublicDomain": true,
    "primaryImage": "https://images.metmuseum.org/CRDImages/as/original/DP154393.jpg",
    "primaryImageSmall": "https://images.metmuseum.org/CRDImages/as/web-large/DP154393.jpg",
    "additionalImages": [],
    "constituents": [
        {
            "constituentID": 37502,
            "role": "Artist",
            "name": "Unidentified artist",
            "constituentULAN_URL": "",
            "constituentWikidata_URL": "",
            "gender": ""
        }
    ],
    "department": "Asian Art",
    "objectName": "Album leaf",
    "title": "Painting",
    "culture": "China",
    "period": "Qing dynasty (1644–1911)",
    "dynasty": "",
    "reign": "",
    "portfolio": "",
    "artistRole": "Artist",
    "artistPrefix": "",
    "artistDisplayName": "Unidentified artist",
    "artistDisplayBio": "",
    "artistSuffix": "",
    "artistAlphaSort": "Unidentified artist",
    "artistNationality": "",
    "artistBeginDate": "",
    "artistEndDate": "",
    "artistGender": "",
    "artistWikidata_URL": "",
    "artistULAN_URL": "",
    "objectDate": "20th century",
    "objectBeginDate": 1900,
    "objectEndDate": 1911,
    "medium": "Leaf from an album; ink on paper",
    "dimensions": "H. 9 11/16 in. (24.6 cm); W. 12 in. (30.5 cm)",
    "measurements": [
        {
            "elementName": "Overall",
            "elementDescription": null,
            "elementMeasurements": {
                "Height": 24.6,
                "Width": 30.5
            }
        },
        {
            "elementName": "Other",
            "elementDescription": "in mat",
            "elementMeasurements": {
                "Height": 31.1,
                "Width": 38.1
            }
        }
    ],
    "creditLine": "Gift of Fritzi and Murray Sanders, 1984",
    "geographyType": "",
    "city": "",
    "state": "",
    "county": "",
    "country": "",
    "region": "",
    "subregion": "",
    "locale": "",
    "locus": "",
    "excavation": "",
    "river": "",
    "classification": "Paintings",
    "rightsAndReproduction": "",
    "linkResource": "",
    "metadataDate": "2025-03-06T04:54:30Z",
    "repository": "Metropolitan Museum of Art, New York, NY",
    "objectURL": "https://www.metmuseum.org/art/collection/search/51868",
    "tags": [
        {
            "term": "Men",
            "AAT_URL": "http://vocab.getty.edu/page/aat/300025928",
            "Wikidata_URL": "https://www.wikidata.org/wiki/Q8441"
        }
    ],
    "objectWikidata_URL": "https://www.wikidata.org/wiki/Q78762496",
    "isTimelineWork": false,
    "GalleryNumber": ""
}
 */