from selenium import webdriver
import sys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from time import sleep
from selenium.webdriver.common.by import By
import json

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def get_chrome_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors')
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-impl-side-painting")
    options.add_argument("--disable-setuid-sandbox")
    options.add_argument("--disable-seccomp-filter-sandbox")
    options.add_argument("--disable-breakpad")
    options.add_argument("--disable-client-side-phishing-detection")
    options.add_argument("--disable-cast")
    options.add_argument("--disable-cast-streaming-hw-encoding")
    options.add_argument("--disable-cloud-import")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-session-crashed-bubble")
    options.add_argument("--disable-ipv6")
    options.add_argument("--allow-http-screen-capture")
    options.add_argument("--disable-gpu")
    options.add_argument("--headless") #not use windown
    chrome_driver = webdriver.Chrome(executable_path=r"chrome_driver/chromedriver.exe", options=options)
    #chrome_driver.maximize_window()
    #chrome_driver.minimize_window()
    chrome_driver.set_window_rect(x=50, y=100, width=50, height=400)
    return chrome_driver
    
def get_hex_url(chrome_driver, hex_code):
    chrome_driver.get('https://cafef.vn/') 
    sleep(2)
    hex_text_field = chrome_driver.find_element(By.ID, "CafeF_SearchKeyword_Company")
    hex_text_field.send_keys(hex_code)
    #hex_text_field.clear()
    sleep(1)
    chrome_driver.find_element(By.CLASS_NAME, "bt_search").click()
    #chrome_driver.close()
    return chrome_driver.current_url

chrome_driver = get_chrome_driver()
file_code = "check_hex.txt"
f = open(file_code, "r+")
#f_out = open("out_url.txt", "w+")
hex_code = f.read().split(",")
dict_hex = {}
for i in range(len(hex_code)):
    hex_code[i] = hex_code[i].strip()
    print (hex_code[i])
    hex_url = get_hex_url(chrome_driver, hex_code[i])
    dict_hex[f"{hex_code[i]}"] = hex_url
    print (hex_url)

with open("hex_url.json", "w") as fp:
    json.dump(dict_hex , fp, cls=NpEncoder)

chrome_driver.close()






