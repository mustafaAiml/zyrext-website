import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_TEMPLATE = os.path.join(BASE_DIR, 'index.html')
SECTIONS_DIR = os.path.join(BASE_DIR, 'sections')
OUTPUT_FILE = os.path.join(BASE_DIR, 'index.html')

PLACEHOLDERS = {
    '<!-- HEADER -->': 'header.html',
    '<!-- HOME -->': 'home.html',
    '<!-- JOURNEY -->': 'journey.html',
    '<!-- CAPABILITIES -->': 'capabilities.html',
    '<!-- CONNECT -->': 'connect.html',
}


def read_file(path):
    with open(path, 'r', encoding='utf-8') as file:
        return file.read()


def build_index():
    template = read_file(INDEX_TEMPLATE)

    for placeholder, filename in PLACEHOLDERS.items():
        section_path = os.path.join(SECTIONS_DIR, filename)
        if not os.path.exists(section_path):
            raise FileNotFoundError(f'Section file not found: {section_path}')
        template = template.replace(placeholder, read_file(section_path))

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as output_file:
        output_file.write(template)

    print('Build complete!')


if __name__ == '__main__':
    build_index()
