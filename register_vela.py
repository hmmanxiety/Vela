import winreg
import os
import ctypes

exe_path = os.path.abspath(r'release\Vela\Vela.exe')
icon_path = os.path.abspath(r'assets\icon_white.ico')
app_name = 'Vela'

extensions = [
    '.mp4', '.mkv', '.webm', '.avi', '.mov', '.flv', '.wmv', '.ts', '.m2ts', '.mts',
    '.m4v', '.3gp', '.vob', '.mpg', '.mpeg', '.ogv', '.rmvb', '.divx', '.asf', '.f4v'
]

print(f'Registering {app_name} at: {exe_path}')

# 1. Applications\Vela.exe
app_key_path = r'Software\Classes\Applications\Vela.exe'
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, app_key_path) as k:
    winreg.SetValueEx(k, 'FriendlyAppName', 0, winreg.REG_SZ, app_name)

with winreg.CreateKey(winreg.HKEY_CURRENT_USER, app_key_path + r'\DefaultIcon') as k:
    winreg.SetValue(k, '', winreg.REG_SZ, icon_path)

with winreg.CreateKey(winreg.HKEY_CURRENT_USER, app_key_path + r'\shell\open\command') as k:
    winreg.SetValue(k, '', winreg.REG_SZ, f'"{exe_path}" "%1"')

supported_types_path = app_key_path + r'\SupportedTypes'
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, supported_types_path) as k:
    for ext in extensions:
        winreg.SetValueEx(k, ext, 0, winreg.REG_SZ, '')

# 2. Context Menu: Play with Vela on all videos
menu_key_path = r'Software\Classes\SystemFileAssociations\video\shell\PlayWithVela'
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, menu_key_path) as k:
    winreg.SetValue(k, '', winreg.REG_SZ, 'Play with Vela')
    winreg.SetValueEx(k, 'Icon', 0, winreg.REG_SZ, icon_path)

with winreg.CreateKey(winreg.HKEY_CURRENT_USER, menu_key_path + r'\command') as k:
    winreg.SetValue(k, '', winreg.REG_SZ, f'"{exe_path}" "%1"')

# 3. ProgID Vela.Video
progid_path = r'Software\Classes\Vela.Video'
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, progid_path) as k:
    winreg.SetValue(k, '', winreg.REG_SZ, 'Vela Video')

with winreg.CreateKey(winreg.HKEY_CURRENT_USER, progid_path + r'\DefaultIcon') as k:
    winreg.SetValue(k, '', winreg.REG_SZ, icon_path)

with winreg.CreateKey(winreg.HKEY_CURRENT_USER, progid_path + r'\shell\open\command') as k:
    winreg.SetValue(k, '', winreg.REG_SZ, f'"{exe_path}" "%1"')

# 4. OpenWithProgids & OpenWithList for each extension
for ext in extensions:
    try:
        owp_path = f'Software\\Classes\\{ext}\\OpenWithProgids'
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, owp_path) as k:
            winreg.SetValueEx(k, 'Vela.Video', 0, winreg.REG_SZ, '')

        owl_path = f'Software\\Classes\\{ext}\\OpenWithList\\Vela.exe'
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, owl_path) as k:
            pass
    except Exception as e:
        print(f'Error on {ext}: {e}')

# Clean up any old VELA Media Player entries in MRU / OpenWith
try:
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Classes\Applications\Vela.exe', 0, winreg.KEY_SET_VALUE) as k:
        winreg.SetValueEx(k, 'FriendlyAppName', 0, winreg.REG_SZ, 'Vela')
except Exception:
    pass

# Notify Windows Shell
ctypes.windll.shell32.SHChangeNotify(0x08000000, 0x0000, None, None)
print('Registration completed successfully! Name set to Vela.')

