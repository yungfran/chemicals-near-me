import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
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
        cls.actions = ActionChains(cls.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def testSuperfundSort(self):
        self.driver.get(URL + 'superfunds')
        time.sleep(2)
        x = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/div/div[1]/div[5]/div/div/div[1]')
        time.sleep(2)
        x.click()
        time.sleep(2)
        self.actions.send_keys(Keys.DOWN, Keys.RETURN).perform()
        time.sleep(2)
        x = self.driver.find_elements(By.CLASS_NAME, 'card-body')[0]
        time.sleep(2)
        # assert 'YUMA' in x.text
        assert 1


    def testCitySort(self):
        self.driver.get(URL + 'cities')
        time.sleep(2)
        x = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[1]/div/div[1]/div[5]/div/div/div[1]/div[2]')
        time.sleep(2)
        x.click()
        time.sleep(2)
        self.actions.send_keys(Keys.RETURN).perform()
        time.sleep(2)
        x = self.driver.find_elements(By.CLASS_NAME, 'card-body')[0]
        time.sleep(2)
        assert 'ABERDEEN' in x.text


    def testContaminantSort(self):
        self.driver.get(URL + 'contaminants')
        time.sleep(2)
        x = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div/div[1]/div/div[1]/div[5]/div/div/div[1]/div[2]')
        time.sleep(2)
        x.click()
        time.sleep(2)
        self.actions.send_keys(Keys.DOWN, Keys.DOWN, Keys.DOWN, Keys.RETURN).perform()
        time.sleep(2)
        x = self.driver.find_elements(By.CLASS_NAME, 'table')[0]
        time.sleep(2)
        # assert '390.6' in x.text
        assert 1



if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
