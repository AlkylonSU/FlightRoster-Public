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
    # Navigate to the Tabular View page
    logger.info("Navigating to the Tabular View page")
    driver.get("http://localhost:3000/tabular-view/ABC123")  # Adjust URL to your app's Tabular View page
    time.sleep(10)
    # Wait for the page to load
    logger.info("Waiting for the page to load")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    # Verify the page title
    assert "React App" in driver.title

    # Verify the presence of key elements
    assert "Tabular View - Interior of the Plane" in driver.page_source
    logger.info("Verifying presence of key elements")

    # Verify data is displayed in the table
    wait.until(EC.presence_of_element_located((By.XPATH, "//th[contains(text(), 'ID')]")))
    wait.until(EC.presence_of_element_located((By.XPATH, "//th[contains(text(), 'Full Name')]")))

    # Check if at least one row of data is present
    rows = driver.find_elements(By.XPATH, "//tbody/tr")
    assert len(rows) > 0
    logger.info(f"Found {len(rows)} rows in the table")

    print("Tabular View test passed.")
except Exception as e:
    logger.error(f"Tabular View test failed: {e}")
finally:
    logger.info("Closing the browser")
    driver.quit()
