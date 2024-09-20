from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Static path to your WebDriver
driver_path = 'D:/Projects/FlightRoster/FrontendTestCases/chromedriver.exe'

# Initialize Chrome options
options = Options()
options.headless = False  # Set to True if you want to run in headless mode

# Initialize the ChromeDriver service with the correct path
service = Service(driver_path)

# Initialize the WebDriver with the service and options
driver = webdriver.Chrome(service=service, options=options)

driver.get("http://localhost:3000/select-flight")

try:
    # Wait for the flight selection dropdown to be visible and clickable
    flight_dropdown = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@id='root']//div[contains(@class, 'MuiSelect-root')]"))
    )
    flight_dropdown.click()

    # Wait for the dropdown options to be visible
    flight_option = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//li[@data-value='ABC123']"))
    )
    flight_option.click()

    # Add assertions or further actions as needed
    # For example, checking if the selected flight is displayed correctly
    selected_flight = WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.XPATH, "//div[@id='root']//div[contains(@class, 'MuiSelect-root')]"), "ABC123 - New York to London")
    )

    print("Flight selection test passed")

except Exception as e:
    print(f"Flight selection test failed: {e}")

finally:
    driver.quit()