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

try:
    # Test 1: Correct username and password
    driver.get("http://localhost:3000")  # Replace with your local URL

    # Enter username
    username_input = driver.find_element(By.ID, "username")
    username_input.send_keys("flightadmin")

    # Enter password
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("acd@4a123")

    # Submit the form
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Log in')]")
    login_button.click()

    time.sleep(5)  # Wait for the page to load

    # Check if redirected to the Select Flight page
    assert "Select Flight" in driver.page_source
    print("Login test with correct credentials passed")

except Exception as e:
    print("Login test with correct credentials failed:", e)

finally:
    driver.quit()

# Initialize the WebDriver again for the second test
driver = webdriver.Chrome(service=service, options=options)

try:
    # Test 2: Incorrect username or password
    driver.get("http://localhost:3000")  # Replace with your local URL

    # Enter username
    username_input = driver.find_element(By.ID, "username")
    username_input.send_keys("wronguser")

    # Enter password
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("wrongpassword")

    # Submit the form
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Log in')]")
    login_button.click()

    # Increase wait time to ensure error message appears
    time.sleep(10)  # Wait for the page to load

    # Check for an error message or failure to redirect
    assert "Select Flight" not in driver.page_source
    
    error_message = None
    try:
        error_message = driver.find_element(By.XPATH, "//div[contains(text(), 'Invalid username or password')]")
    except:
        pass
    
    if error_message is not None:
        print("Login test with incorrect credentials failed as expected")
    else:
        print("Login test with incorrect credentials did not find the expected error message")
    
except Exception as e:
    print("Login test with incorrect credentials:", e)

finally:
    driver.quit()
