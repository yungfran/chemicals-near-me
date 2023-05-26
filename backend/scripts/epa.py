import requests
import json
import lxml.html as lh
from tqdm import tqdm

output_json = "epa_data.json"
sites_table = "SEMS_ACTIVE_SITES"
chem_table = "ENVIROFACTS_CONTAMINANTS"
state_col = "SITE_STATE"
id_col = "FK_SITE_ID"
output_type = "JSON"
rows = "0:300"
dummy_states = ["WI"]
link = "https://enviro.epa.gov/enviro"
states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
]
database_keys = [
    "SITE_EPA_ID",
    "SITE_NAME",
    "SITE_ID",
    "NPL",
    "SITE_CITY_NAME",
    "SITE_STATE",
    "SITE_CNTY_NAME",
    "SITE_ZIP_CODE",
    "FF",
    "LONGITUDE",
    "LATITUDE",
    "NUM_CHEM",
    "CHEMICALS",
    "IMAGE_URL",
]
goog_api_key = "AIzaSyBFb5LG00rpOToZ04N0s9TY-dV1HjWF-78"
goog_link = "https://maps.googleapis.com/maps/api/place"


def scrape_data():
    """
    Scrape data from EPA's API, iterating over
    all 50 states and retrieving specified number
    of data points for each state.
    """
    print("SCRAPING DATA...")
    sites = []
    for state in tqdm(states):
        api_link = f"{link}/efservice/{sites_table}/{state_col}/{state}/{output_type}/rows/{rows}"
        try:
            response = requests.get(api_link).json()
        except:
            print("\nError when calling EPA API.\n")
        else:
            for r in response:
                epa_id = r["SITE_EPA_ID"]
                site_name = r["SITE_NAME"]
                chemicals = get_chemicals(epa_id)
                if not len(chemicals) > 0:
                    continue
                image_url = get_image(site_name)
                r["NUM_CHEM"] = len(chemicals)
                r["CHEMICALS"] = list(chemicals)
                r["IMAGE_URL"] = image_url
                if image_url:
                    sites.append(r)
    return sites


def create_db_data(sites):
    """
    Create list of dictionaries, with each element
    representing a Superfund site, and each key-value
    pair representing a valid column name and its
    associated value for its respective site.
    """
    print("CREATING DATA...")
    database_data = []
    for site in sites:
        site_dict = {}
        for key in database_keys:
            site_dict[key] = site[key]
        database_data.append(site_dict)
    return database_data


def export_data(database_data):
    """
    Exports the created data into a json file for
    insertion into SQL database.
    """
    print("EXPORTING DATA...")
    with open(output_json, "w") as f:
        f.write(json.dumps(database_data, indent=4))


def get_chemicals(epa_id):
    """
    Retrieve the list of chemicals for a given Superfund
    from the raw HTML and return a set of the chemicals.
    """
    chemical_set = set()
    api_link = f"{link}/SEMSquery.get_report?pgm_sys_id={epa_id}"
    try:
        response = requests.get(api_link)
    except:
        print("Connection/Timeout Error when retrieving chemicals.\n")
    else:
        doc = lh.fromstring(response.content)
        tr_elements = doc.xpath("//tr")
        for i in range(1, len(tr_elements) - 2):
            row = tr_elements[i]
            chemical_set.add(row[5].text_content())
    return chemical_set


def get_image(site_name):
    """
    Call the Google Places API to retrieve URLs to photos that correspond
    to specific Superfunds.
    """
    image_url = ""
    api_link = f"{goog_link}/findplacefromtext/json?input={site_name}&inputtype=textquery&fields=photo&key={goog_api_key}"
    try:
        response = requests.get(api_link).json()
    except:
        print("Error when calling Google API.\n")
    else:
        candidates = response["candidates"]
        if candidates:
            photos = candidates[0]
            if photos:
                photos = photos["photos"]
                if photos:
                    photo_ref = photos[0]["photo_reference"]
                    image_url = f"{goog_link}/photo?maxwidth=400&photo_reference={photo_ref}&key={goog_api_key}"
    return image_url


def main():
    """Driver function."""
    sites = scrape_data()
    database_data = create_db_data(sites)
    export_data(database_data)


if __name__ == "__main__":
    main()
