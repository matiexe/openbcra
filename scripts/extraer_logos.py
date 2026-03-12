import os
import time
from playwright.sync_api import sync_playwright

def extraer_logos_agresivo():
    url_base = "https://icons.com.ar/?type=Bancos+y+Billeteras"
    folder = "logos_argentina"
    
    if not os.path.exists(folder):
        os.makedirs(folder)

    with sync_playwright() as p:
        print(f"🚀 Iniciando navegador (Modo Agresivo) para {url_base}...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url_base, wait_until="networkidle")
        
        print("🖱️ Cargando y haciendo scroll...")
        for _ in range(15):
            page.keyboard.press("PageDown")
            time.sleep(0.3)

        # Ejecutamos JS en el navegador para extraer todo
        print("💉 Ejecutando script de extracción en el cliente...")
        iconos = page.evaluate("""
            () => {
                const results = [];
                // Buscamos todos los SVGs
                const svgs = document.querySelectorAll('svg');
                svgs.forEach(svg => {
                    // Intentamos encontrar el texto descriptivo cercano (padre o hermano)
                    const container = svg.closest('li') || svg.closest('button') || svg.parentElement;
                    const text = container ? container.innerText.trim() : '';
                    
                    if (text && text.length > 2 && text.length < 50) {
                        results.push({
                            name: text.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                            html: svg.outerHTML
                        });
                    }
                });
                return results;
            }
        """)

        guardados = 0
        vistos = set()
        for ico in iconos:
            name = ico['name']
            if name in vistos or 'github' in name or 'inicio' in name: continue
            
            svg_content = ico['html']
            if 'xmlns' not in svg_content:
                svg_content = svg_content.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
            
            with open(f"{folder}/{name}.svg", "w", encoding="utf-8") as f:
                f.write(svg_content)
            
            print(f"✅ Extraído: {name}.svg")
            guardados += 1
            vistos.add(name)

        browser.close()
        print(f"\n✨ Proceso terminado. Se extrajeron {guardados} iconos.")

if __name__ == "__main__":
    extraer_logos_agresivo()
