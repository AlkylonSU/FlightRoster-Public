from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

# Initialize the WebDriver
driver_path = 'D:/Projects/FlightRoster/FrontendTestCases/chromedriver.exe'
options = Options()
options.headless = False
service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=options)

try:
    # Navigate to the Extended View page
    logger.info("Navigating to the Extended View page")
    driver.get("http://localhost:3000/extended-view/ABC123/")  # Adjust URL to your app's Extended View page
    time.sleep(10)
    # Wait for the page to load
    logger.info("Waiting for the page to load")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    # Print and verify the page title
    actual_title = driver.title
    logger.info(f"Page title is: {actual_title}")
    assert "React App" in actual_title, f"Page title does not contain 'React App', it is '{actual_title}'"

    # Verify the presence of key elements
    logger.info("Verifying presence of key elements")
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'ID')]").is_displayed(), "ID column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Full Name')]").is_displayed(), "Full Name column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Age')]").is_displayed(), "Age column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Gender')]").is_displayed(), "Gender column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Nationality')]").is_displayed(), "Nationality column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Seat Type')]").is_displayed(), "Seat Type column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Children')]").is_displayed(), "Children column not found"
    assert driver.find_element(By.XPATH, "//th[contains(text(), 'Actions')]").is_displayed(), "Actions column not found"
    logger.info("Presence of key elements verified")

    # Verify data rows
    logger.info("Verifying data rows")
    data_rows = driver.find_elements(By.XPATH, "//tbody/tr")
    assert len(data_rows) > 0, "No data rows found."
    logger.info("Data rows found")

    # Verify a specific row's data
    logger.info("Verifying specific row's data")
    row_data = data_rows[0].find_elements(By.TAG_NAME, "td")
    assert row_data[0].text == "1", "ID does not match"
    assert row_data[1].text == "John Doe", "Full Name does not match"
    assert row_data[2].text == "30", "Age does not match"
    assert row_data[3].text == "Male", "Gender does not match"
    assert row_data[4].text == "American", "Nationality does not match"
    assert row_data[5].text == "Economy", "Seat Type does not match"
    assert "Emily Doe" in row_data[6].text, "Child name 'Emily Doe' not found"
    assert "Michael Doe" in row_data[6].text, "Child name 'Michael Doe' not found"
    logger.info("Specific row's data verified")

    print("Extended View test passed.")
except Exception as e:
    logger.error(f"Extended View test failed: {e}")
finally:
    logger.info("Closing the browser")
    driver.quit()
