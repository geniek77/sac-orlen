from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
import json,hashlib,base64
D=Path(__file__).parent
j=json.loads((D/'m_competition.json').read_text())
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':2200,'height':1250},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 html=(D/'podglad.html').read_text()
 import re
 html=re.sub(r'<script src="[^"]+"></script>','',html)
 init=html.split('<script>')[1].split('</script>')[0]
 html=html.split('<script>')[0]+'</body></html>'
 page.set_content(html)
 page.add_script_tag(content=(D/'m_competition.js').read_text())
 page.add_script_tag(content=(D/'m_competition_styling.js').read_text())
 page.add_script_tag(content=init)
 page.evaluate('document.getElementById("cockpit").finishLoading()')
 page.evaluate('''() => {const stage=document.querySelector('#stage');stage.style.width='1674px';stage.style.height='943px';stage.style.aspectRatio='auto';stage.style.resize='none';stage.style.overflow='hidden';}''')
 page.wait_for_timeout(2000)
 # Screenshot directly from the HTML preview — the one real code rendering for the ZIP.
 page.locator('#cockpit').screenshot(path=str(D/'wizualizacja_z_html.png'))
 checks.append('podglad.html ładuje i rysuje ten sam widget v4')
 text=page.eval_on_selector('#cockpit','e=>[...e.shadowRoot.querySelectorAll("svg text")].map(x=>x.textContent)')
 assert 'WYKONANIE' in text and '168,0' in text and 'REALIZACJA PLANU' in text and '87,4' in text
 assert len(text)>30, len(text)
 checks.append('pięć skal i wszystkie treści KPI wyrenderowane')
 # While in loading mode all foreground must be hidden.
 page.click('#loading')
 assert not page.eval_on_selector('#cockpit','e=>e.shadowRoot.querySelector(".screen").classList.contains("on")')
 page.click('#ready')
 assert page.eval_on_selector('#cockpit','e=>e.shadowRoot.querySelector(".screen").classList.contains("on")')
 checks.append('faza ładowania i płynne włączenie ekranu')
 page.eval_on_selector('#cockpit','e=>{e.setGaugeRange("left",0,100);e.setGaugeRange("right",1,10);e.setGaugeRange("center",30,100);e.setGaugeRange("fuel",0,1);e.setGaugeRange("temp",-20,80);e.setText("fuelLabel","MARŻA");e.setText("tempLabel","TEMPERATURA");e.setTextStyle("leftValue","Georgia, serif",64,"#77aaff");e.setThemeColor("navigation","#10ff33");e.setLogo("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLTTAAAAABJRU5ErkJggg==");}')
 t=page.eval_on_selector('#cockpit','e=>[...e.shadowRoot.querySelectorAll("svg text")].map(x=>x.textContent)')
 assert all(x in t for x in ('100','10','MARŻA','TEMPERATURA'))
 assert page.eval_on_selector('#cockpit','e=>e.getGaugeRange("right")')=='{"min":1,"max":10}'
 assert page.eval_on_selector('#cockpit','e=>e.shadowRoot.querySelector("image").getAttribute("href").startsWith("data:image/webp")')
 assert page.eval_on_selector('#cockpit','e=>[...e.shadowRoot.querySelectorAll("image")].some(x=>x.getAttribute("href").startsWith("data:image/png"))')
 assert page.eval_on_selector('#cockpit','e=>[...e.shadowRoot.querySelectorAll("text")].some(x=>x.getAttribute("font-family").includes("Georgia"))')
 checks.append('wszystkie pięć zakresów, etykiety, font, kolory i podmiana logo')
 # Automatically created SAC Builder keeps measure picker; custom styling controls fire propertiesChanged.
 page.evaluate('''() => {let e=document.getElementById('styling'), w=document.getElementById('cockpit');let i=e.shadowRoot.querySelector('input[data-prop="rightTicks"]');i.value='10';i.dispatchEvent(new Event('change',{bubbles:true}));}''')
 assert page.eval_on_selector('#cockpit','e=>e.rightTicks')==10
 checks.append('panel Styling zapisuje konfigurację do widgetu')
 # Parent-size responsive SVG: ensure no overflow.
 page.evaluate('''() => {const s=document.getElementById('stage');s.style.width='862px';s.style.height='391px';}''')
 size=page.eval_on_selector('#cockpit','e=>{let a=e.getBoundingClientRect(),b=e.shadowRoot.querySelector("svg").getBoundingClientRect();return [a.width,a.height,b.width,b.height]}')
 assert size==[860,389,860,389],size
 checks.append('dynamiczne dopasowanie do ramki 860 × 389')
 # Mock SAP feed using its official data/metadata format.
 page.evaluate('''() => {let e=document.createElement('com-sbl-instruments-m-competition-v4');e.id='feed';e.style.cssText='width:800px;height:450px;display:block';document.body.append(e);e.kpiData={metadata:{feeds:{measures:{values:['measures_0','measures_1','measures_2','measures_3','measures_4']}}},data:[{measures_0:{raw:74},measures_1:{raw:4.5},measures_2:{raw:61.5},measures_3:{raw:67},measures_4:{raw:52}}]};e.onCustomWidgetAfterUpdate({loadingMode:'auto',previewValues:false});}''')
 assert page.eval_on_selector('#feed','e=>e.getGaugeValue("center")')==61.5
 assert page.eval_on_selector('#feed','e=>e.getGaugeValue("fuel")')==67
 assert page.eval_on_selector('#feed','e=>e.shadowRoot.querySelector(".screen").classList.contains("on")')
 checks.append('symulowane data binding SAC: pięć wartości miar')
 assert not errors,errors
 checks.append('brak błędów JavaScript')
 browser.close()
# PNG and JPG exported only from exact screenshot in HTML, never separate generative mockup.
Image.open(D/'wizualizacja_z_html.png').convert('RGB').save(D/'wizualizacja_z_html.jpg',quality=96,subsampling=0)
for item,name in zip(j['webcomponents'],['m_competition.js','m_competition_styling.js']):
 integrity='sha256-'+base64.b64encode(hashlib.sha256((D/name).read_bytes()).digest()).decode()
 assert item['integrity']==integrity,(name,item['integrity'],integrity)
checks.append('hash SHA-256 manifestu zgodny z plikami JavaScript')
print('\n'.join('PASS: '+x for x in checks))
