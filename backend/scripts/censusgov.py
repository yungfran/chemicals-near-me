import requests
import json
from tqdm import tqdm
from openfile import *

output_json = "censusgov_data.json"
all_cities = []
income_dict = {}
disability_dict = {}
insurance_dict = {}

"""
	Scrape data from Census.gov's API 
	to get info on each state
"""


def get_cities():
    cities_url = "http://api.census.gov/data/2019/acs/acs5?get=NAME,B01003_001E&for=place:*&in=state:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    data = requests.get(cities_url).json()

    # loops through census.gov's cities and only creates
    # an object for cities found in epa's list of cities
    for i in tqdm(range(1, len(data))):
        dict = {}
        location = data[i][0].split(",")
        # removes the last word of the city string
        city_state = location[0].split()
        del city_state[-1]
        city_state = " ".join(city_state)
        city_state += "," + location[1]

        if city_state.upper() in list_of_locations:
            dict["name"] = location[0]
            dict["state"] = location[1].strip()
            dict["population"] = data[i][1]
            dict["median_household_income"] = income_dict.get(data[i][0])
            dict["disability"] = disability_dict.get(data[i][0])
            dict["no_health_insurance"] = insurance_dict.get(data[i][0])
            dict["county"], dict["latitude"], dict["longitude"] = get_coordinates(
                location[0], location[1].strip()
            )
            dict[
                "map_url"
            ] = "https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/utils/geocoder#q%3D{}%252C%2520{}".format(
                location[0].replace(" ", ""), location[1].strip()
            )
            dict["image_url"] = get_image(data[i][0])

            all_cities.append(dict)


"""
	Exports the created data into a json file for 
	insertion into SQL database
"""


def export_data():
    with open(output_json, "w") as f:
        f.write(json.dumps(all_cities, indent=4))


"""
	Creates city object for the United States
"""


def get_us():
    us_url = "http://api.census.gov/data/2019/acs/acs5?get=NAME,B01003_001E&for=us:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    data = requests.get(us_url).json()
    dict = {}
    city = data[1][0].split()[0]
    state = data[1][0].split()[1]
    dict["name"] = data[1][0]
    dict["state"] = "null"
    dict["population"] = data[1][1]
    dict["median_household_income"] = income_dict.get(data[1][0])
    dict["disability"] = disability_dict.get(data[1][0])
    dict["no_health_insurance"] = insurance_dict.get(data[1][0])
    dict["county"], dict["latitude"], dict["longitude"] = get_coordinates(city, state)
    dict[
        "map_url"
    ] = "https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/utils/geocoder#q%3DUnited%2520States%2520of%2520America"
    dict["image_url"] = get_image(data[1][0])
    all_cities.append(dict)


"""
	Returns image url of the given city and state
"""


def get_image(city_state):
    info_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={}&inputtype=textquery&fields=photo&key=AIzaSyC828NPdBZWFRqDknEjdr_X2RYeyLJ5iE8".format(
        city_state
    )
    payload = {}
    headers = {}
    response = requests.request("GET", info_url, headers=headers, data=payload)
    data = response.json()
    # check if there's actually data on the city's image
    if len(data["candidates"][0]) > 0:
        photo_ref = data["candidates"][0]["photos"][0]["photo_reference"]
        photo_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={}&key=AIzaSyC828NPdBZWFRqDknEjdr_X2RYeyLJ5iE8".format(
            photo_ref
        )
    else:
        photo_url = "null"
    return photo_url


"""
	Returns latitude and longitude of the given city and state
"""


def get_coordinates(city, state):
    if city == "United" and state == "States":
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=United,+States&key=AIzaSyC828NPdBZWFRqDknEjdr_X2RYeyLJ5iE8"
        data = requests.get(url).json()
        county = "null"
        latitude = data["results"][0]["geometry"]["location"]["lat"]
        longitude = data["results"][0]["geometry"]["location"]["lng"]
    else:
        url = "https://maps.googleapis.com/maps/api/geocode/json?address={},+{}&key=AIzaSyC828NPdBZWFRqDknEjdr_X2RYeyLJ5iE8".format(
            city, state
        )
        data = requests.get(url).json()
        county = data["results"][0]["address_components"][1]["long_name"]
        latitude = data["results"][0]["geometry"]["location"]["lat"]
        longitude = data["results"][0]["geometry"]["location"]["lng"]

    return county, latitude, longitude


"""	
	Stores data on percentage of residents with no insurance into insurance_dict. 
		Key: city, state
		Value: total number of residents with no insurance in that city
"""


def get_insurance():
    ins_url = "http://api.census.gov/data/2019/acs/acs5/subject?get=NAME,S2701_C05_001E&for=place:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(ins_url)
    data = result.json()

    for i in range(1, len(data)):
        insurance_dict[data[i][0]] = data[i][1]

    us_ins_url = "http://api.census.gov/data/2019/acs/acs5/subject?get=NAME,S2701_C05_001E&for=us:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(us_ins_url)
    data = result.json()
    insurance_dict[data[1][0]] = data[1][1]


"""
	Stores data on median household earnings into income_dict.
		Key: city, state
		Value: median household earnings in that city
"""


def get_income():
    income_url = "http://api.census.gov/data/2019/acs/acs5?get=NAME,B19013_001E&for=place:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(income_url)
    data = result.json()

    for i in range(1, len(data)):
        income_dict[data[i][0]] = data[i][1]

    us_income_url = "http://api.census.gov/data/2019/acs/acs5?get=NAME,B19013_001E&for=us:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(us_income_url)
    data = result.json()
    income_dict[data[1][0]] = data[1][1]


"""
	Stores data on percentage of residents that have a disability into disability_dict.
		Key: city, state
		Value: total number of residents that have a disability in that city
"""


def get_disability():
    dis_url = "http://api.census.gov/data/2019/acs/acs5/subject?get=NAME,S1810_C03_001E&for=place:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(dis_url)
    data = result.json()

    for i in range(1, len(data)):
        disability_dict[data[i][0]] = data[i][1]

    us_dis_url = "http://api.census.gov/data/2019/acs/acs5/subject?get=NAME,S1810_C03_001E&for=us:*&key=64c8e56c96dbdc498514b15897cd7f2972e72337"
    result = requests.get(us_dis_url)
    data = result.json()
    disability_dict[data[1][0]] = data[1][1]


def main():
    map_states()
    open_json = open(
        "epa_data.json",
    )
    og_data = json.load(open_json)
    parse_file(og_data)
    get_income()
    get_insurance()
    get_disability()
    get_us()
    get_cities()
    export_data()


if __name__ == "__main__":
    main()
