import unittest
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

import sys

URL = "https://dev.chemicalsnear.me/"

class Test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        cls.driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)
        cls.driver.get(URL)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    """
    Tests are a little redundant, but we can use it as a nice base
    find elements by tag name instead of by text when the website is up.
    """
    def testSuperfunds(self):
        self.driver.get(URL + 'superfunds')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')
        time.sleep(2)
        assert 'Superfund Sites' in x[0].text


    def testChemicals(self):
        self.driver.get(URL + 'contaminants')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')
        time.sleep(2)
        assert 'Contaminants' in x[0].text


    def testCities(self):
        self.driver.get(URL + 'cities')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')
        time.sleep(2)
        assert 'Cities' in x[0].text


    def testAbout(self):
        self.driver.get(URL + 'about')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')
        time.sleep(2)
        assert 'About Us' in x[0].text
    

if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
