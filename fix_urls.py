import os

dir_path = r'c:\Users\hp\OneDrive\Desktop\AttandancemanagmentSystem\frontend\src\pages'
for f in os.listdir(dir_path):
    if f.endswith('.tsx'):
        filepath = os.path.join(dir_path, f)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # replace urls.js added a backslash before the $
        new_content = content.replace(r'\${import.meta.env', r'${import.meta.env')
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Fixed {f}')
