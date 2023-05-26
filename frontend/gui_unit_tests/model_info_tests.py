import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
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
    Go to a main model page and click on the first entry
    """
    def testAboutMembers(self):
        self.driver.get(URL + 'about')
        time.sleep(2)
        x = self.driver.find_elements(By.ID, 'about')[0]
        time.sleep(2)
        text = x.text
      
        assert 'Francis Tran' in text
        assert 'Lorenzo Martinez' in text
        assert 'Vivian Ta' in text
        assert 'Fedor Aglyamov' in text
        assert 'Timothy Keeton' in text
        

    def testCityInfo(self): 
        self.driver.get(URL + 'cities')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')[0]
        time.sleep(2)
        assert x.text == 'Cities'

        x = self.driver.find_elements(By.TAG_NAME, 'p')[0]
        time.sleep(2)
        assert 'Population' in x.text


    def testContaminantInstance(self):
        self.driver.get(URL + 'contaminants/39')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'div')[0]
        time.sleep(2)
        assert '2,4,6-TRINITROTOLUENE' in x.text
        


    def testSuperfundInfo(self):
        self.driver.get(URL + 'superfunds')
        time.sleep(2)
        x = self.driver.find_elements(By.TAG_NAME, 'h1')[0]
        time.sleep(2)
        assert 'Superfund Sites' in x.text

        x = self.driver.find_elements(By.TAG_NAME, 'p')[0]
        time.sleep(2)
        assert 'NPL Status' in x.text



if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
